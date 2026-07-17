#!/usr/bin/env bun
// install a generated registry item into a target app dir (shadcn-compatible).
//
//   bun scripts/registry-install.ts <item> <appDir> [--registry <dir>]
//
// used by the blank web/expo CI harnesses. resolves registryDependencies,
// writes files to their targets, prints the npm deps the app must provide.

import { resolve } from 'node:path'
import { installItem } from './lib/registry/installer'
import { outDir } from './lib/registry/config'

const [name, appDir] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const flags = process.argv.slice(2)
const registryDir = flags.includes('--registry')
  ? flags[flags.indexOf('--registry') + 1]
  : outDir

if (!name || !appDir) {
  console.error('usage: bun scripts/registry-install.ts <item> <appDir> [--registry <dir>]')
  process.exit(1)
}

const result = installItem({ registryDir, name, appDir: resolve(appDir) })
console.log(`installed item(s): ${result.items.join(', ')}`)
for (const f of result.files) console.log(`  wrote ${f}`)
console.log(`npm dependencies required: ${result.dependencies.join(', ') || '(none)'}`)
if (result.devDependencies.length)
  console.log(`npm devDependencies required: ${result.devDependencies.join(', ')}`)
