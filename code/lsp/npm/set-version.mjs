#!/usr/bin/env node

// Sets the umbrella version and repins its eight leaves to match.
//
// Every other package in the workspace gets its version from scripts/release.ts,
// which filters out anything carrying `skipPublish` before it writes a single
// version. The umbrella carries `skipPublish` because the main release lane
// cannot cross-compile the eight binaries, so nothing in that flow ever moved
// this version and the language server published at whatever was committed here
// while the rest of the workspace was on a beta. The release passes the version
// it is cutting to this script instead, so the whole set stays in lockstep.
//
//   node set-version.mjs 3.0.0-beta.1192.1
//
// The leaves are not edited: they are generated from the umbrella, both by
// build-platform-packages.mjs locally and by the staging step in lsp-build.yml.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const version = process.argv[2]
if (!version) {
  console.error('usage: node set-version.mjs <version>')
  process.exit(1)
}

// the release passes a version it computed; a typo here would publish a set of
// nine packages nobody can install as a group, so refuse anything unparseable
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error(`not a semver version: ${version}`)
  process.exit(1)
}

const here = dirname(fileURLToPath(import.meta.url))
const path = join(here, 'tamagui-lsp/package.json')
const umbrella = JSON.parse(readFileSync(path, 'utf8'))

umbrella.version = version
const leaves = Object.keys(umbrella.optionalDependencies ?? {})
if (leaves.length === 0) {
  console.error('the umbrella declares no optionalDependencies to repin')
  process.exit(1)
}
for (const name of leaves) umbrella.optionalDependencies[name] = version

writeFileSync(path, `${JSON.stringify(umbrella, null, 2)}\n`)
console.info(`@tamagui/lsp and its ${leaves.length} leaves set to ${version}`)
