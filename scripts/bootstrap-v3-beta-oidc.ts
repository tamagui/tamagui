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
// Run it from a real terminal. npm asks for a fresh one-time password on trust
// operations and answers it in a browser, so every npm call that can prompt
// inherits this terminal rather than being captured.

import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
// configuring 166 packages is a long single run, so each success is recorded and
// a rerun resumes instead of repeating work that already succeeded
const progressFile = resolve(scratch, 'configured.json')
const owner = 'nwienert'
const repository = 'tamagui/tamagui'
const workflowFile = 'release.yml'

function capture(command: string, args: string[], cwd = root): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8' }).trim()
}

// inherits the terminal so npm can run its browser one-time-password handshake
function runNpm(args: string[], cwd = root): void {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(' ')} failed with exit code ${result.status}`)
  }
}

// npm answers a create on an already-configured package with 409, which is the
// only way to learn the config is there without spending a second slow call
// reading it first. treated as success so the run is idempotent and resumable.
function configureTrust(name: string): 'created' | 'already configured' {
  const result = spawnSync(
    process.execPath,
    [npmCli, 'trust', 'github', name, '--repo', repository, '--file', workflowFile, '--allow-publish', '--yes'],
    { cwd: root, stdio: ['inherit', 'inherit', 'pipe'], encoding: 'utf8' }
  )
  if (result.error) throw result.error
  if (result.status === 0) return 'created'
  process.stderr.write(result.stderr)
  if (/\bE409\b|already exists/.test(result.stderr)) return 'already configured'
  throw new Error(`could not configure ${name}`)
}

function readProgress(): Set<string> {
  if (!existsSync(progressFile)) return new Set()
  return new Set(JSON.parse(readFileSync(progressFile, 'utf8')) as string[])
}

function recordProgress(done: Set<string>): void {
  writeFileSync(progressFile, JSON.stringify([...done].sort(), null, 2) + '\n')
}

// the public registry answers this without auth, so 166 of them take seconds
// where 166 npm subprocesses took ten minutes
async function existsOnNpm(name: string): Promise<boolean> {
  const response = await fetch(
    `https://registry.npmjs.org/${name.replace('/', '%2F')}`,
    { method: 'HEAD' }
  )
  if (response.status === 404) return false
  if (!response.ok) throw new Error(`registry returned ${response.status} for ${name}`)
  return true
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

  const configured = readProgress()
  const pending = packages.filter((name) => !configured.has(name))

  console.info(`\nChecking ${pending.length} packages against the registry...`)
  const missing = (
    await Promise.all(
      pending.map(async (name) => ((await existsOnNpm(name)) ? undefined : name))
    )
  ).filter((name): name is string => name !== undefined)

  if (configured.size > 0) {
    console.info(`\n${configured.size} already configured by an earlier run.`)
  }
  if (missing.length > 0) {
    console.info(`\nNot on npm, need a one-time bootstrap publish (${missing.length}):`)
    for (const name of missing) console.info(`  ${name}`)
  }
  console.info(
    `\n${pending.length} packages need a trusted publisher, ${missing.length} of them need publishing first.`
  )

  if (pending.length === 0) {
    console.info('\nEvery package is ready. Rerun the Release workflow.')
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

  mkdirSync(npmPrefix, { recursive: true })
  execFileSync(
    'npm',
    ['install', '--prefix', npmPrefix, '--no-package-lock', '--no-save', `npm@${npmVersion}`],
    { cwd: root, stdio: 'inherit' }
  )
  if (capture(process.execPath, [npmCli, '--version']) !== npmVersion) {
    throw new Error(`failed to install npm ${npmVersion}`)
  }
  const whoami = spawnSync(process.execPath, [npmCli, 'whoami'], { encoding: 'utf8' })
  if (whoami.status !== 0 || whoami.stdout.trim() !== owner) {
    throw new Error(
      `npm must be authenticated as ${owner} (got "${whoami.stdout.trim() || 'nobody'}").\n` +
        `Run: node ${npmCli} login --auth-type web`
    )
  }

  console.info(
    `\nThis permanently claims ${missing.length} npm package names and grants ${repository} (${workflowFile}) publish rights on ${pending.length} packages.` +
      `\nnpm may ask for a one-time password in your browser; approve it when it does.`
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
    for (const name of missing) {
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
      ['publish', '--workspaces', '--access', 'public', '--tag', 'bootstrap', '--ignore-scripts'],
      bootstrapDir
    )
    for (const name of missing) {
      for (let attempt = 1; !(await existsOnNpm(name)); attempt++) {
        if (attempt > 30) throw new Error(`${name} never appeared on the registry`)
        console.info(`${name}: waiting for npm registry propagation (${attempt}/30)`)
        await Bun.sleep(10_000)
      }
    }
  }

  for (const [index, name] of pending.entries()) {
    console.info(`\n[${index + 1}/${pending.length}] ${name}`)
    console.info(`  ${configureTrust(name)}`)
    configured.add(name)
    recordProgress(configured)
  }

  console.info(`\nAll ${packages.length} packages are ready. Rerun the Release workflow.`)
}

main().catch((error) => {
  console.error(`\nBootstrap stopped: ${error instanceof Error ? error.message : error}`)
  console.error('Fix the reported problem, then rerun the same command.')
  console.error('Packages already configured are recorded, so a rerun resumes.')
  process.exitCode = 1
})
