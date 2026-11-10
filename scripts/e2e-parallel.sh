#!/bin/bash

# Runs the e2e specs in parallel against the running dev server (`npm start`).
#
# Every worker takes the next spec file from a common queue and runs it with its own `cypress run`,
# so a slow spec does not hold up the others. The output of every spec goes to its own log file,
# the console only shows one line per spec and the logs of the failed specs at the end.
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
  if npx cypress run --spec "${spec}" --config trashAssetsBeforeRuns=false > "${log_file}" 2>&1; then
    echo "PASS  $((SECONDS - start))s  ${spec}"
  else
    echo "FAIL  $((SECONDS - start))s  ${spec}"
    return 1
  fi
}
export -f run_spec
export log_dir

echo "Running the specs with ${workers} workers, logs in ${log_dir}"
start=${SECONDS}

status=0
find cypress/e2e -name '*.spec.cy.ts' -not -path 'cypress/e2e/shared/*' | sort \
  | xargs -P "${workers}" -I {} bash -c 'run_spec "$1"' _ {} \
  | tee "${log_dir}/summary.txt" || status=$?

echo "Finished in $((SECONDS - start))s"

if [ "${status}" -ne 0 ]; then
  for log_file in $(grep '^FAIL' "${log_dir}/summary.txt" | awk '{print $3}' \
    | xargs -n 1 basename | sed 's/\.spec\.cy\.ts$/.log/'); do
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
  exit 1
fi
