#!/usr/bin/env bun

import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'

const root = resolve(import.meta.dirname, '..')
const execute = process.argv.includes('--execute')
const npmVersion = '12.0.1'
const bootstrapVersion = '0.0.0-bootstrap.0'
const scratch = resolve(tmpdir(), 'tamagui-v3-oidc-bootstrap')
const npmPrefix = resolve(scratch, 'npm-runtime')
const bootstrapDir = resolve(scratch, 'packages')
const npmCli = resolve(npmPrefix, 'node_modules/npm/bin/npm-cli.js')
const packages = [
  '@tamagui/compiler-core',
  '@tamagui/create-system-font',
  '@tamagui/field',
  '@tamagui/size',
  '@tamagui/style-grammar',
  '@tamagui/to-tailwind',
  '@tamagui/ui',
]

function capture(command: string, args: string[], cwd = root): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8' }).trim()
}

function npm(args: string[], cwd = root) {
  const command = execute ? process.execPath : 'npm'
  const commandArgs = execute ? [npmCli, ...args] : args
  return spawnSync(command, commandArgs, { cwd, encoding: 'utf8' })
}

function runNpm(args: string[], cwd = root): void {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`npm ${args[0]} failed with exit code ${result.status}`)
  }
}

function packageExists(name: string): boolean {
  const result = npm(['view', name, 'name', '--json'])
  if (result.status === 0) return true
  if (result.stderr.includes('E404')) return false
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
  if (!maintainers.includes('nwienert')) {
    throw new Error(`${name} exists but is not maintained by nwienert`)
  }
}

type TrustConfig = {
  type?: string
  file?: string
  repository?: string
  environment?: string
  permissions?: string[]
}

function readTrust(name: string): TrustConfig | undefined {
  const result = npm(['trust', 'list', name, '--json'])
  if (result.status !== 0) {
    throw new Error(`could not read ${name} trust: ${result.stderr.trim()}`)
  }
  if (!result.stdout.trim()) return undefined
  return JSON.parse(result.stdout)
}

function trustMatches(config: TrustConfig): boolean {
  return (
    config.type === 'github' &&
    config.repository === 'tamagui/tamagui' &&
    config.file === 'release.yml' &&
    config.environment === undefined &&
    config.permissions?.length === 1 &&
    config.permissions[0] === 'createPackage'
  )
}

async function main(): Promise<void> {
  if (execute) {
    if (capture('git', ['branch', '--show-current']) !== 'v3-beta') {
      throw new Error('run this only from the v3-beta branch')
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
      [
        'install',
        '--prefix',
        npmPrefix,
        '--ignore-scripts=false',
        '--no-package-lock',
        '--no-save',
        `npm@${npmVersion}`,
      ],
      { cwd: root, stdio: 'inherit' }
    )
    if (capture(process.execPath, [npmCli, '--version']) !== npmVersion) {
      throw new Error(`failed to install npm ${npmVersion}`)
    }
    if (capture(process.execPath, [npmCli, 'whoami']) !== 'nwienert') {
      throw new Error('npm must be authenticated as nwienert')
    }
  }

  const missing = packages.filter((name) => !packageExists(name))
  console.info('Tamagui v3 package OIDC plan:\n')
  for (const name of packages) {
    console.info(
      `  ${name}: ${missing.includes(name) ? 'bootstrap publish required' : 'exists'}`
    )
  }

  if (!execute) {
    console.info(
      `\n${missing.length} package names require a one-time bootstrap publish. Run with --execute only after reviewing this plan.`
    )
    return
  }

  for (const name of packages.filter(packageExists)) {
    verifyOwner(name)
    const trust = readTrust(name)
    if (trust && !trustMatches(trust)) {
      throw new Error(`${name} already has a different trusted publisher`)
    }
  }

  console.info('\nThis permanently claims and configures these npm package names:\n')
  for (const name of packages) console.info(`  ${name}`)
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  const confirmation = await prompt.question(
    '\nType BOOTSTRAP TAMAGUI V3 OIDC to continue: '
  )
  prompt.close()
  if (confirmation !== 'BOOTSTRAP TAMAGUI V3 OIDC') {
    throw new Error('package bootstrap cancelled')
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
            repository: 'https://github.com/tamagui/tamagui',
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
        {
          name: 'tamagui-v3-oidc-bootstrap',
          private: true,
          workspaces: workspaceDirs,
        },
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

  for (const name of packages) {
    if (!packageExists(name)) throw new Error(`${name} was not published`)
    verifyOwner(name)
    const trust = readTrust(name)
    if (trustMatches(trust ?? {})) {
      console.info(`${name}: trusted publisher already configured`)
      continue
    }
    if (trust) throw new Error(`${name} already has a different trusted publisher`)
    runNpm([
      'trust',
      'github',
      name,
      '--repo',
      'tamagui/tamagui',
      '--file',
      'release.yml',
      '--allow-publish',
      '--yes',
    ])
    const configured = readTrust(name)
    if (!configured || !trustMatches(configured)) {
      throw new Error(`${name} trusted publisher did not match after configuration`)
    }
    await Bun.sleep(2_000)
  }

  console.info('\nAll Tamagui v3 package names and trusted publishers are ready.')
}

main().catch((error) => {
  console.error(`\nBootstrap stopped: ${error instanceof Error ? error.message : error}`)
  console.error('Fix the reported problem, then rerun the same command.')
  process.exitCode = 1
})
