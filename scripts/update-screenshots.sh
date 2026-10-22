#!/usr/bin/env bash
# Regenerates the visual regression baselines for the current branch on GitHub's Linux runners and
# downloads them into apps/docs/screenshots for you to review and commit. Run it with
# `pnpm screenshots:update` after pushing the change that alters how components look.
set -euo pipefail

workflow="update-screenshots.yml"
dir="apps/docs/screenshots"

cd "$(git rev-parse --show-toplevel)"
branch="$(git branch --show-current)"
sha="$(git rev-parse HEAD)"

if [ -z "$branch" ] || [ "$branch" = "main" ]; then
  echo "Run this on a feature branch, not main or a detached HEAD." >&2
  exit 1
fi

# The workflow renders the commit on GitHub, so it has to be the one checked out here.
git fetch --quiet origin "$branch" || true
if [ "$(git rev-parse --verify --quiet "origin/$branch" || true)" != "$sha" ]; then
  echo "Push $branch first: the workflow renders the commit on GitHub, which doesn't match HEAD." >&2
  exit 1
fi

find_run() {
  gh run list --workflow "$workflow" --branch "$branch" --limit 20 --json databaseId,headSha \
    --jq "[.[] | select(.headSha == \"$sha\")][0].databaseId // empty"
}

run_id="$(find_run)"
if [ -z "$run_id" ]; then
  echo "Starting $workflow on $branch..."
  gh workflow run "$workflow" --ref "$branch"
  for _ in $(seq 1 30); do
    sleep 2
    run_id="$(find_run)"
    [ -n "$run_id" ] && break
  done
  if [ -z "$run_id" ]; then
    echo "Couldn't find the workflow run. Check the Actions tab." >&2
    exit 1
  fi
fi

echo "Waiting for run $run_id..."
gh run watch "$run_id" --exit-status

rm -rf "$dir"
gh run download "$run_id" --name screenshots --dir "$dir"

if [ -z "$(git status --porcelain -- "$dir")" ]; then
  echo "Baselines are already up to date."
else
  git status --short -- "$dir"
  echo
  echo "Review the changed images (your editor or GitHub's PR diff shows them), then commit and push."
fi
