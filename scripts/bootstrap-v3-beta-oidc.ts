#!/usr/bin/env bun

// Claims npm package names and configures their GitHub trusted publisher so the
// Release workflow can publish over OIDC with no npm token.
//
// The package list is derived from the same workspace scan the release lane uses,
// so it can never drift from what CI actually publishes.
//
// Both lanes in release.yml are covered by one trust entry: the beta job runs in
// the npm-publish-beta environment and the stable job runs in none, so the entry
// deliberately pins no environment. Adding one would break the other lane.
//
// Run it from a real terminal. npm's trust endpoints require 2FA, so npm opens a
// browser to authenticate; a piped or non-interactive shell fails with EOTP.

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { discoverPublicWorkspacePackages } from './v3-release-dry-run-lib'

const root = resolve(import.meta.dirname, '..')
const execute = process.argv.includes('--execute')
const npmVersion = '12.0.1'
const bootstrapVersion = '0.0.0-bootstrap.0'
const scratch = resolve(tmpdir(), 'tamagui-v3-oidc-bootstrap')
const npmPrefix = resolve(scratch, 'npm-runtime')
const bootstrapDir = resolve(scratch, 'packages')
const npmCli = resolve(npmPrefix, 'node_modules/npm/bin/npm-cli.js')
const owner = 'nwienert'
const repository = 'tamagui/tamagui'
const workflowFile = 'release.yml'
// npm trust needs 11.15+; reads are parallel because 166 sequential round trips
// take minutes, writes stay sequential so a 2FA prompt is never interleaved.
const readConcurrency = 8

function capture(command: string, args: string[], cwd = root): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8' }).trim()
}

function npm(args: string[], cwd = root) {
  return spawnSync(process.execPath, [npmCli, ...args], { cwd, encoding: 'utf8' })
}

function runNpm(args: string[], cwd = root): void {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(' ')} failed with exit code ${result.status}`)
  }
}

function assertNotAuthFailure(name: string, stderr: string): void {
  if (/\bEOTP\b|one-time password|ENEEDAUTH/.test(stderr)) {
    throw new Error(
      `npm needs interactive 2FA to read ${name}.\n` +
        `Run this from a real terminal (not a pipe or CI) so npm can open a browser.`
    )
  }
}

async function mapWithConcurrency<In, Out>(
  items: readonly In[],
  limit: number,
  worker: (item: In, index: number) => Promise<Out>
): Promise<Out[]> {
  const results = new Array<Out>(items.length)
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index], index)
    }
  })
  await Promise.all(runners)
  return results
}

function packageExists(name: string): boolean {
  const result = npm(['view', name, 'name', '--json'])
  if (result.status === 0) return true
  if (result.stderr.includes('E404')) return false
  assertNotAuthFailure(name, result.stderr)
  throw new Error(`could not check ${name}: ${result.stderr.trim()}`)
}

function verifyOwner(name: string): void {
  const result = npm(['view', name, 'maintainers', '--json'])
  if (result.status !== 0) {
    throw new Error(`could not read ${name} maintainers: ${result.stderr.trim()}`)
  }
  const raw = JSON.parse(result.stdout)
  const maintainers = (Array.isArray(raw) ? raw : [raw]).map(
    (maintainer: string | { name?: string }) =>
      typeof maintainer === 'string' ? maintainer.match(/^[^ <]+/)?.[0] : maintainer.name
  )
  if (!maintainers.includes(owner)) {
    throw new Error(`${name} exists but is not maintained by ${owner}`)
  }
}

type TrustConfig = {
  id?: string
  type?: string
  file?: string
  repository?: string
  environment?: string
  permissions?: string[]
}

function readTrust(name: string): TrustConfig[] {
  const result = npm(['trust', 'list', name, '--json'])
  if (result.status !== 0) {
    assertNotAuthFailure(name, result.stderr)
    throw new Error(`could not read ${name} trust: ${result.stderr.trim()}`)
  }
  const raw = result.stdout.trim()
  if (!raw) return []
  const parsed = JSON.parse(raw)
  const list = Array.isArray(parsed) ? parsed : [parsed]
  return list.filter((entry) => entry && typeof entry === 'object')
}

// Verifies the parts that decide whether CI can publish, and deliberately does
// not pin the exact permission spelling: npm names the grant behind
// --allow-publish, and a future rename there must not make this script refuse a
// config that works. An entry pinning an environment is reported as a mismatch
// because the stable lane runs without one.
function trustPermitsRelease(config: TrustConfig): boolean {
  return (
    config.type === 'github' &&
    config.repository === repository &&
    config.file === workflowFile &&
    config.environment == null &&
    (config.permissions ?? []).some((permission) => /publish/i.test(permission))
  )
}

function describeTrust(entries: readonly TrustConfig[]): string {
  if (entries.length === 0) return 'none'
  return entries
    .map((entry) => {
      const scope = [
        entry.type ?? '?',
        entry.repository ?? '?',
        entry.file ?? '?',
        entry.environment ? `env=${entry.environment}` : 'env=any',
      ].join(' ')
      return `${scope} [${(entry.permissions ?? []).join(',') || 'no permissions'}]`
    })
    .join('; ')
}

async function main(): Promise<void> {
  const branch = capture('git', ['branch', '--show-current'])
  if (branch !== 'v3-beta') {
    throw new Error(`run this from the v3-beta branch (currently on ${branch})`)
  }

  const discovered = await discoverPublicWorkspacePackages(root)
  // mirrors the filter in scripts/release.ts so the plan matches what CI publishes
  const packages = discovered
    .filter((pkg) => !pkg.manifest['skipPublish'])
    .map((pkg) => pkg.name)
    .sort()
  if (packages.length === 0) throw new Error('found no publishable workspace packages')

  mkdirSync(npmPrefix, { recursive: true })
  execFileSync(
    'npm',
    [
      'install',
      '--prefix',
      npmPrefix,
      '--no-package-lock',
      '--no-save',
      `npm@${npmVersion}`,
    ],
    { cwd: root, stdio: 'inherit' }
  )
  if (capture(process.execPath, [npmCli, '--version']) !== npmVersion) {
    throw new Error(`failed to install npm ${npmVersion}`)
  }
  const whoami = spawnSync(process.execPath, [npmCli, 'whoami'], { encoding: 'utf8' })
  if (whoami.status !== 0 || whoami.stdout.trim() !== owner) {
    throw new Error(
      `npm must be authenticated as ${owner} (got "${whoami.stdout.trim() || 'nobody'}").\n` +
        `Run: node ${npmCli} login`
    )
  }

  console.info(`\nInspecting ${packages.length} packages on npm...`)
  const state = await mapWithConcurrency(packages, readConcurrency, async (name) => {
    const exists = packageExists(name)
    const trust = exists ? readTrust(name) : []
    return { name, exists, trust, ready: exists && trust.some(trustPermitsRelease) }
  })

  const missing = state.filter((entry) => !entry.exists)
  const needsTrust = state.filter((entry) => entry.exists && !entry.ready)
  const ready = state.filter((entry) => entry.ready)

  if (missing.length > 0) {
    console.info(`\nNot on npm, need a one-time bootstrap publish (${missing.length}):`)
    for (const entry of missing) console.info(`  ${entry.name}`)
  }
  if (needsTrust.length > 0) {
    console.info(`\nOn npm but cannot publish from CI (${needsTrust.length}):`)
    for (const entry of needsTrust) {
      console.info(`  ${entry.name}: ${describeTrust(entry.trust)}`)
    }
  }
  console.info(
    `\n${ready.length} ready, ${needsTrust.length} need a trusted publisher, ${missing.length} need publishing first.`
  )

  if (missing.length === 0 && needsTrust.length === 0) {
    console.info('\nEvery package is ready. CI can publish over OIDC.')
    return
  }

  if (!execute) {
    console.info('\nRerun with --execute to apply this plan.')
    return
  }

  const head = capture('git', ['rev-parse', 'HEAD'])
  const remote = capture('git', ['ls-remote', 'origin', 'refs/heads/v3-beta']).split(
    /\s/
  )[0]
  if (head !== remote) {
    throw new Error(`local HEAD ${head} is not current origin/v3-beta ${remote}`)
  }

  console.info(
    `\nThis permanently claims ${missing.length} npm package names and grants ${repository} (${workflowFile}) publish rights on ${missing.length + needsTrust.length} packages.`
  )
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  const confirmation = await prompt.question(
    '\nType BOOTSTRAP TAMAGUI V3 OIDC to continue: '
  )
  prompt.close()
  if (confirmation !== 'BOOTSTRAP TAMAGUI V3 OIDC') {
    throw new Error('bootstrap cancelled')
  }

  if (missing.length > 0) {
    const workspaceDirs: string[] = []
    for (const { name } of missing) {
      const packageDir = resolve(bootstrapDir, name.replace('@', '').replace('/', '-'))
      mkdirSync(packageDir, { recursive: true })
      writeFileSync(
        resolve(packageDir, 'package.json'),
        JSON.stringify(
          {
            name,
            version: bootstrapVersion,
            description: 'Tamagui v3 package bootstrap',
            repository: { type: 'git', url: `git+https://github.com/${repository}.git` },
            license: 'MIT',
            files: ['README.md'],
            publishConfig: { access: 'public' },
          },
          null,
          2
        ) + '\n'
      )
      writeFileSync(resolve(packageDir, 'README.md'), `# ${name}\n`)
      workspaceDirs.push(relative(bootstrapDir, packageDir))
    }
    writeFileSync(
      resolve(bootstrapDir, 'package.json'),
      JSON.stringify(
        { name: 'tamagui-v3-oidc-bootstrap', private: true, workspaces: workspaceDirs },
        null,
        2
      ) + '\n'
    )
    runNpm(
      [
        'publish',
        '--workspaces',
        '--access',
        'public',
        '--tag',
        'bootstrap',
        '--ignore-scripts',
        '--auth-type',
        'web',
      ],
      bootstrapDir
    )
  }

  for (const { name } of [...missing, ...needsTrust]) {
    for (let attempt = 1; !packageExists(name); attempt++) {
      if (attempt > 30) throw new Error(`${name} never appeared on the registry`)
      console.info(`${name}: waiting for npm registry propagation (${attempt}/30)`)
      await Bun.sleep(10_000)
    }
    verifyOwner(name)

    const existing = readTrust(name)
    if (existing.some(trustPermitsRelease)) {
      console.info(`${name}: already configured`)
      continue
    }
    if (existing.length > 0) {
      throw new Error(
        `${name} has a conflicting trusted publisher: ${describeTrust(existing)}\n` +
          `Revoke it with: node ${npmCli} trust revoke ${name} --id=<trust-id>`
      )
    }

    runNpm([
      'trust',
      'github',
      name,
      '--repo',
      repository,
      '--file',
      workflowFile,
      '--allow-publish',
      '--yes',
    ])
    const configured = readTrust(name)
    if (!configured.some(trustPermitsRelease)) {
      throw new Error(
        `${name} trust did not take effect: ${describeTrust(configured)}`
      )
    }
    console.info(`${name}: configured`)
  }

  console.info(`\nAll ${packages.length} packages are ready. Rerun the Release workflow.`)
}

main().catch((error) => {
  console.error(`\nBootstrap stopped: ${error instanceof Error ? error.message : error}`)
  console.error('Fix the reported problem, then rerun the same command.')
  process.exitCode = 1
})
