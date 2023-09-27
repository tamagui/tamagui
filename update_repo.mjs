#!/usr/bin/env zx

// import { $ } from 'zx'

// // Ensure that the KNOWN_COMMIT argument is passed
// if (!process.argv[2]) {
//   console.error('Please provide the known commit as an argument.')
//   process.exit(1)
// }

// const KNOWN_COMMIT = process.argv[2]

// // Ensure that we're on the desired branch
// await $`git checkout dev`

// // Fetch the latest commits from the 'dev' branch of the 'upstream' remote
// await $`git fetch unistack dev`

// // Get all the commit hashes after the known commit from upstream/dev branch, excluding merge commits
// const { stdout: COMMIT_HASHES } =
//   await $`git log ${KNOWN_COMMIT}..unistack/dev --pretty=format:"%H" --no-merges`

// // Split hashes by newline and filter out empty strings
// const commits = COMMIT_HASHES.split('\n').filter(Boolean)

// // Cherry-pick each commit one by one
// for (const commit of commits) {
//   await $`git cherry-pick ${commit}`
// }

// // Run 'yarn install' from the root directory
// await $`yarn install`

// export {}

import { $ } from 'zx'

const lastArg = process.argv[process.argv.length - 1]
// Ensure that the KNOWN_COMMIT argument is passed
if (!lastArg) {
  console.error('Please provide the known commit as an argument.')
  process.exit(1)
}

const KNOWN_COMMIT = lastArg

// Ensure that we're on the desired branch
await $`git checkout dev`

// Fetch the latest commits from the 'dev' branch of the 'upstream' remote
await $`git fetch unistack dev`

console.log(`Known Commit zzz: ${KNOWN_COMMIT}`)

// Get all the commit hashes after the known commit from upstream/dev branch, excluding merge commits
const { stdout: COMMIT_HASHES } =
  await $`git log ${KNOWN_COMMIT}..unistack/dev --pretty=format:"%H" --no-merges`

// Split hashes by newline and filter out empty strings
const commits = COMMIT_HASHES.split('\n').filter(Boolean)

// Cherry-pick each commit one by one
for (const commit of commits) {
  await $`git cherry-pick ${commit}`
}

// Run 'yarn install' from the root directory
await $`yarn install`

export {}
