#!/bin/bash

# Runs the e2e specs in parallel against the running dev server (`npm start`).
#
# Every worker takes the next spec file from a common queue and runs it with its own `cypress run`,
# so a slow spec does not hold up the others. The output of every spec goes to its own log file.
# The console shows a status line (finished specs, running specs, elapsed time) and one numbered line
# per finished spec, at the end the failures of the failed specs and a summary of the specs and tests.
#
# Usage: e2e-parallel.sh [workers]   (default: 4)

set -euo pipefail

# The paths below are relative to the project root, whichever directory the script is started from
cd "$(dirname "$0")/.."

workers="${1:-4}"
url="http://localhost:4200"

if ! [[ "${workers}" =~ ^[1-9][0-9]*$ ]]; then
  echo "The number of workers must be a positive number, got '${workers}'." >&2
  exit 1
fi

# The specs visit this port, unlike `cypress run` this script does not start a server.
if ! curl -sSf --max-time 5 "${url}" > /dev/null 2>&1; then
  echo "Nothing answers on ${url} - start the player with 'npm start' first." >&2
  exit 1
fi

log_dir="$(mktemp -d -t e2e-parallel-XXXXXX)"

# Every `cypress run` empties the screenshots folder when it starts, which would delete the screenshots
# of specs that failed in another worker. So it is emptied once here and the runs are told to keep it.
rm -rf cypress/screenshots

run_spec() {
  local spec="$1"
  local log_file="${log_dir}/$(basename "${spec}" .spec.cy.ts).log"
  local start=${SECONDS}
  echo "START ${spec}"
  if npx cypress run --spec "${spec}" --config trashAssetsBeforeRuns=false > "${log_file}" 2>&1; then
    echo "PASS  $((SECONDS - start))s  ${spec}"
  else
    echo "FAIL  $((SECONDS - start))s  ${spec}"
    return 1
  fi
}
export -f run_spec
export log_dir

format_duration() {
  printf '%d:%02d' $(($1 / 60)) $(($1 % 60))
}

# Reads the START/PASS/FAIL lines of the workers, prints every finished spec with its number and
# keeps a status line (finished, running, elapsed time) at the bottom of the terminal. Without a
# terminal (e.g. output into a file) the status is printed as a line of its own once a minute instead.
show_progress() {
  local finished=0 running=0 line chunk partial='' read_status last_report=${SECONDS} status_line
  local tty=false
  [ -t 1 ] && tty=true
  while true; do
    line=''
    if IFS= read -r -t 1 chunk; then
      line="${partial}${chunk}"
      partial=''
    else
      read_status=$?
      # A status above 128 is the timeout. It can come in the middle of a line: read hands over what
      # it has read so far, the rest comes with the next read.
      if [ "${read_status}" -gt 128 ]; then
        partial="${partial}${chunk}"
      elif [ -n "${partial}${chunk}" ]; then
        # The end of the output, after a last line without newline
        line="${partial}${chunk}"
        partial=''
      else
        break
      fi
    fi
    if [ -n "${line}" ]; then
      case "${line}" in
        START\ *)
          running=$((running + 1))
          ;;
        PASS\ * | FAIL\ *)
          running=$((running - 1))
          finished=$((finished + 1))
          echo "${line}" >> "${log_dir}/summary.txt"
          if ${tty}; then printf '\r\033[K'; fi
          printf '[%*d/%d] %s\n' "${#total}" "${finished}" "${total}" "${line}"
          ;;
      esac
    fi
    status_line="${finished}/${total} specs finished, ${running} running, $(format_duration $((SECONDS - start))) elapsed"
    if ${tty}; then
      printf '\r\033[K%s' "${status_line}"
    elif [ $((SECONDS - last_report)) -ge 60 ]; then
      echo "... ${status_line}"
      last_report=${SECONDS}
    fi
  done
  if ${tty}; then printf '\r\033[K'; fi
}

# Adds up a row (e.g. "Passing") of the result tables of all specs that ran through
sum_tests() {
  cat "${log_dir}"/*.log 2>/dev/null | grep -oE "│ $1: +[0-9]+" | grep -oE '[0-9]+$' \
    | awk '{ sum += $1 } END { print sum + 0 }'
}

find cypress/e2e -name '*.spec.cy.ts' -not -path 'cypress/e2e/shared/*' | sort > "${log_dir}/specs.txt"
total=$(wc -l < "${log_dir}/specs.txt")
touch "${log_dir}/summary.txt"

echo "Running ${total} specs with ${workers} workers, logs in ${log_dir}"
start=${SECONDS}

# Ctrl+C stops the workers as well, only the status line has to be cleared, otherwise it stays in
# front of the prompt
on_interrupt() {
  if [ -t 1 ]; then printf '\r\033[K'; fi
  echo "Stopped after $(format_duration $((SECONDS - start))), logs in ${log_dir}" >&2
  exit 130
}
trap on_interrupt INT

status=0
xargs -P "${workers}" -I {} bash -c 'run_spec "$1"' _ {} < "${log_dir}/specs.txt" \
  | show_progress || status=$?

duration=$((SECONDS - start))

# A spec without a PASS or FAIL line did not run: the run itself broke off (e.g. a worker was killed)
not_run="$(awk '{print $3}' "${log_dir}/summary.txt" | grep -vxF -f - "${log_dir}/specs.txt" || true)"
if [ -n "${not_run}" ]; then
  echo
  echo "The run broke off (exit status ${status}), these specs did not run:" >&2
  echo "${not_run}" >&2
  status=1
fi

for log_file in $(grep '^FAIL' "${log_dir}/summary.txt" | awk '{print $3}' \
  | xargs -r -n 1 basename | sed 's/\.spec\.cy\.ts$/.log/'); do
  echo
  echo "===== ${log_file}"
  # Only the failures and the result table, the whole log is in the log directory
  failures="$(sed -n '/^  [0-9]* failing/,$p' "${log_dir}/${log_file}")"
  if [ -n "${failures}" ]; then
    echo "${failures}"
  else
    # No failing tests in the log: the spec did not run through (e.g. it did not compile or the
    # browser crashed), so everything after the start of the spec is shown instead, or the end
    # of the log when Cypress did not even get to start the spec
    echo "(no failing tests in the log - the spec did not run through)"
    output="$(sed -n '/^  Running:/,$p' "${log_dir}/${log_file}")"
    if [ -n "${output}" ]; then
      echo "${output}"
    else
      tail -n 40 "${log_dir}/${log_file}"
    fi
  fi
done

specs_passed=$(grep -c '^PASS' "${log_dir}/summary.txt" || true)
specs_failed=$(grep -c '^FAIL' "${log_dir}/summary.txt" || true)
specs_not_run=$((total - specs_passed - specs_failed))

echo
echo "===== Summary"
specs_result="Specs: ${specs_passed}/${total} passed, ${specs_failed}/${total} failed"
if [ "${specs_not_run}" -gt 0 ]; then
  specs_result="${specs_result}, ${specs_not_run}/${total} did not run"
fi
echo "${specs_result}"
# Specs that did not run through have no result table, so their tests are missing here
echo "Tests: $(sum_tests Passing)/$(sum_tests Tests) passed, $(sum_tests Failing)/$(sum_tests Tests) failed," \
  "$(( $(sum_tests Pending) + $(sum_tests Skipped) )) pending or skipped"
echo "Finished in $(format_duration "${duration}")"

if [ "${status}" -ne 0 ] || [ "${specs_failed}" -gt 0 ]; then
  exit 1
fi
