#!/usr/bin/env bun
// DRY shadcn registry generator.
//
// the skin source (code/ui/<skin-source>/<Component>.tsx, one per primitive) is
// the single source of truth. this script DERIVES the shadcn registry from it
// and mechanically checks that every downstream copy stays byte-identical.
//
//   bun scripts/generate-registry.ts build      write registry.json + r/*.json
//   bun scripts/generate-registry.ts check      fail if generated artifacts are stale (CI)
//   bun scripts/generate-registry.ts validate    schema-validate the generated registry
//   bun scripts/generate-registry.ts drift [--strict]   report consumer copy drift
//
// see registry/README.md for the full design.

import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { outDir } from './lib/registry/config'
import {
  buildRegistry,
  writeRegistry,
  writeRegistryTo,
  checkDrift,
  firstDivergence,
  writeConsumers,
} from './lib/registry/emit'
import { loadSkin, renderConsumerCopy } from './lib/registry/core'
import { driftConsumers } from './lib/registry/config'

const cmd = process.argv[2] ?? 'build'
const flags = new Set(process.argv.slice(3))

function ok(msg: string) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`)
}
function fail(msg: string): never {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`)
  process.exit(1)
}

async function build() {
  mkdirSync(outDir, { recursive: true })
  const registry = await writeRegistry()
  ok(`generated registry.json + ${registry.items.length} item(s) into ${outDir}`)
  for (const item of registry.items) console.log(`  - ${item.name} (${item.type})`)
}

// regenerate to memory and diff against the checked-in files. this is the gate
// that a human ran `build` and committed the result.
async function check() {
  const { registry } = await buildRegistry()
  const indexPath = join(outDir, 'registry.json')
  if (!existsSync(indexPath)) fail(`registry not generated yet — run: bun scripts/generate-registry.ts build`)

  // build to a fresh sandbox and compare byte-for-byte
  const { execSync } = await import('node:child_process')
  const tmp = execSync('mktemp -d').toString().trim()
  writeRegistryTo(tmp, registry)

  const stale: string[] = []
  const files = [`registry.json`, ...registry.items.map((i) => `r/${i.name}.json`)]
  for (const f of files) {
    const gen = readFileSync(join(tmp, f), 'utf8')
    const committed = existsSync(join(outDir, f)) ? readFileSync(join(outDir, f), 'utf8') : ''
    if (gen !== committed) stale.push(f)
  }
  if (stale.length) {
    fail(
      `generated registry is stale (run \`bun scripts/generate-registry.ts build\` and commit):\n  ${stale.join('\n  ')}`
    )
  }
  ok(`registry artifacts are up to date (${registry.items.length} item(s))`)
}

async function validate() {
  const { registry } = await buildRegistry()
  // buildRegistry already validates and throws on failure
  ok(`registry is shadcn-valid (${registry.items.length} item(s))`)
}

async function drift() {
  const strict = flags.has('--strict')
  // --only-authorized restricts to generator-owned consumers (the blank CI
  // apps) — those ARE the shipped registry copy and must never drift. held
  // consumers (demos/kitchen-sink/site/canary) are reported until the campaign
  // flips them to generated copies.
  const onlyAuthorized = flags.has('--only-authorized')
  const authorizedKeys = new Set(driftConsumers.filter((c) => c.writeAuthorized).map((c) => c.key))
  const all = await checkDrift()
  const entries = onlyAuthorized ? all.filter((e) => authorizedKeys.has(e.consumer)) : all
  const bad = entries.filter((e) => e.status !== 'ok')
  const skinCache = new Map<string, Awaited<ReturnType<typeof loadSkin>>>()
  for (const e of entries) {
    const tag = e.status === 'ok' ? '\x1b[32mok\x1b[0m' : e.status === 'missing' ? '\x1b[33mmissing\x1b[0m' : '\x1b[31mdrift\x1b[0m'
    console.log(`  [${tag}] ${e.consumer}/${e.skin}  ${e.path}`)
    if (e.status === 'drift') {
      let skin = skinCache.get(e.skin)
      if (!skin) {
        skin = await loadSkin(e.skin)
        skinCache.set(e.skin, skin)
      }
      const consumer = driftConsumers.find((c) => c.key === e.consumer)!
      const expected = renderConsumerCopy(skin, consumer.namePrefix)
      const actual = readFileSync(join(process.cwd(), e.path), 'utf8')
      console.log(firstDivergence(expected, actual))
    }
  }
  if (bad.length) {
    const msg = `${bad.length} consumer copy/copies out of sync with the skin source`
    if (strict) fail(msg)
    console.log(`\x1b[33m!\x1b[0m ${msg} (report-only; pass --strict to fail)`)
    return
  }
  ok(`all ${entries.length} consumer copies match the skin source`)
}

// write generated copies into authorized consumers' real files (the blank CI
// apps). held consumers (demos/kitchen-sink/site/canary) are never written.
async function writeConsumersCmd() {
  const written = await writeConsumers()
  if (!written.length) {
    console.log('no write-authorized consumers configured')
    return
  }
  ok(`wrote ${written.length} generated consumer copy/copies`)
  for (const w of written) console.log(`  ${w}`)
}

const run = { build, check, validate, drift, 'write-consumers': writeConsumersCmd }[cmd]
if (!run) fail(`unknown command "${cmd}" (build | check | validate | drift | write-consumers)`)
await run()
