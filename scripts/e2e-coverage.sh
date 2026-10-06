#!/bin/bash

# Runs the e2e suite against the instrumented player, so that it leaves a coverage report behind.
#
# The ordinary dev server (`npm start`) carries no counters: `@cypress/code-coverage` then finds no
# `window.__coverage__`, warns that the application was not instrumented and writes an empty report.
# The `serve-coverage` target adds the counters through webpack.coverage.config.js.
#
# Where the report lands is decided by .nycrc.json (coverage/e2e/).
#
# Usage: e2e-coverage.sh

set -euo pipefail

port=4200
url="http://localhost:${port}"
server_pid=""

# The whole process group: `npx` hands the work to a grandchild `ng`, which keeps the port when only
# the npx process is killed.
cleanup() {
  [ -n "${server_pid}" ] || return 0
  kill -- "-${server_pid}" 2> /dev/null || true
}
trap cleanup EXIT

# The specs visit this port; a plain `ng serve` holding it would answer instead of the instrumented
# build and the run would go through with an empty report.
if curl -sSf --max-time 5 "${url}" > /dev/null 2>&1; then
  echo "Something already answers on port ${port} - stop it first." >&2
  exit 1
fi

# The plugin merges into an existing out.json, so the previous run is removed first.
rm -rf .nyc_output coverage/e2e

setsid npx ng run player:serve-coverage --port "${port}" > player.log 2>&1 &
server_pid=$!

echo "Waiting for the instrumented player at ${url}..."
deadline=$((SECONDS + 300))
until curl -sSf --max-time 10 "${url}" > /dev/null 2>&1; do
  if [ "${SECONDS}" -ge "${deadline}" ]; then
    echo "The player did not answer within 300s - see player.log." >&2
    exit 1
  fi
  sleep 5
done

bundle="$(mktemp)"
curl -sSf --max-time 300 "${url}/main.js" -o "${bundle}"
if ! grep -q "__coverage__" "${bundle}"; then
  rm -f "${bundle}"
  echo "The bundle on port ${port} carries no coverage counters - is that really serve-coverage?" >&2
  exit 1
fi
rm -f "${bundle}"

npx cypress run --expose coverage=true "$@"
