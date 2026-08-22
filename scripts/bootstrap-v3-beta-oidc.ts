#!/usr/bin/env bun

// Claims npm package names and configures their GitHub trusted publisher so the
// Release workflow can publish over OIDC with no npm token.
//
// The package list is derived from the same workspace scan the release lane uses,
// so it can never drift from what CI actually publishes.
//
// One trust entry covers both lanes in release.yml, and it deliberately pins no
// environment. GitHub adds an `environment` claim to the OIDC token whenever a
// job names one, so a job with an environment stops matching. Neither lane names
// one, which is what keeps a single entry valid for both. An entry that DOES pin
// an environment is therefore broken, and this script repairs it rather than
// reading its existence as success.
//
// Run it from a real terminal. Trust operations are two-factor operations, and
// each approval opens a window covering roughly fifty calls, so a full run asks
// for a handful of browser approvals rather than one per package. Spawning the
// npm CLI per package would ask once each regardless, which is why this talks to
// the registry's trust API directly.
//
// Use --only <package> to inspect or fix a single package.

import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { discoverPublicWorkspacePackages } from './v3-release-dry-run-lib'

const root = resolve(import.meta.dirname, '..')
const execute = process.argv.includes('--execute')
// one package, to prove a credential works before spending a full run on it
const onlyFlag = process.argv.indexOf('--only')
const only = onlyFlag === -1 ? null : process.argv[onlyFlag + 1]
const npmVersion = '12.0.2'
const bootstrapVersion = '0.0.0-bootstrap.0'
const scratch = resolve(tmpdir(), 'tamagui-v3-oidc-bootstrap')
const npmPrefix = resolve(scratch, 'npm-runtime')
const bootstrapDir = resolve(scratch, 'packages')
const npmCli = resolve(npmPrefix, 'node_modules/npm/bin/npm-cli.js')
const owner = 'nwienert'
const repository = 'tamagui/tamagui'
const workflowFile = 'release.yml'
const registry = 'https://registry.npmjs.org'

interface TrustClaims {
  repository?: string
  workflow_ref?: { file?: string }
  environment?: string
}

interface TrustConfig {
  id?: string
  type?: string
  claims?: TrustClaims
  permissions?: string[]
}

type TrustState = 'correct' | 'wrong' | 'absent'

function capture(command: string, args: string[], cwd = root): string {
  return execFileSync(command, args, { cwd, encoding: 'utf8' }).trim()
}

function runNpm(args: string[], cwd = root): void {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(' ')} failed with exit code ${result.status}`)
  }
}

// the public registry answers this without auth, so 167 of them take seconds
// where 167 npm subprocesses took ten minutes
async function existsOnNpm(name: string): Promise<boolean> {
  const response = await fetch(`${registry}/${name.replace('/', '%2F')}`, {
    method: 'HEAD',
  })
  if (response.status === 404) return false
  if (!response.ok) throw new Error(`registry returned ${response.status} for ${name}`)
  return true
}

function trustUrl(name: string, id?: string): string {
  const escaped = name.replace('/', '%2f')
  return `${registry}/-/package/${escaped}/trust${id ? `/${encodeURIComponent(id)}` : ''}`
}

/**
 * The registry only offers the browser handshake to a client that asks for it by
 * name. Without `npm-auth-type: web` it answers a plain 401 with no way forward,
 * which is what makes a hand-rolled request look like bad credentials.
 */
function headers(token: string, otp?: string): Record<string, string> {
  return {
    authorization: `Bearer ${token}`,
    accept: 'application/json',
    'content-type': 'application/json',
    'npm-auth-type': 'web',
    'npm-command': 'trust',
    'user-agent': `npm/${npmVersion} tamagui-oidc-bootstrap`,
    ...(otp ? { 'npm-otp': otp } : {}),
  }
}

// `npm config get` refuses to print an auth token, so the credential comes from
// the file `npm login` writes it to
function readAuthToken(): string {
  const userconfig = process.env.NPM_CONFIG_USERCONFIG ?? resolve(homedir(), '.npmrc')
  if (!existsSync(userconfig)) {
    throw new Error(`${userconfig} does not exist. Run: npm login --auth-type web`)
  }
  const key = `//${new URL(registry).host}/:_authToken=`
  const line = readFileSync(userconfig, 'utf8')
    .split('\n')
    .find((entry) => entry.trimStart().startsWith(key))
  if (!line) {
    throw new Error(
      `${userconfig} holds no credential for ${registry}. Run: npm login --auth-type web`
    )
  }
  return line
    .slice(line.indexOf(key) + key.length)
    .trim()
    .replace(/^["']|["']$/g, '')
}

async function pollForToken(doneUrl: string): Promise<string> {
  for (;;) {
    const response = await fetch(doneUrl, { headers: { accept: 'application/json' } })
    if (response.status === 202) {
      const retry = Number(response.headers.get('retry-after')) * 1000
      await Bun.sleep(retry > 0 ? retry : 1000)
      continue
    }
    const body = (await response.json()) as { token?: string }
    if (response.status === 200 && body.token) return body.token
    throw new Error(`web authentication failed with ${response.status}`)
  }
}

async function authorize(challenge: {
  authUrl: string
  doneUrl: string
}): Promise<string> {
  console.info(`\nApprove this run in your browser:\n  ${challenge.authUrl}\n`)
  spawnSync('open', [challenge.authUrl], { stdio: 'ignore' })
  const token = await pollForToken(challenge.doneUrl)
  console.info('Approved.\n')
  return token
}

interface Session {
  token: string
  otp: string | null
  approvals: number
}

/**
 * An approval opens a window in which this credential may call the trust API
 * freely, so the run costs a handful of approvals rather than one per package.
 *
 * The one-time password itself is spent by the single request that follows the
 * approval, and the registry answers a request carrying a spent `npm-otp` with a
 * bare 401 that offers no way forward. So it is dropped as soon as it is used,
 * and every later request rides the window instead. When the window closes the
 * registry offers a fresh challenge, which is the only time this asks again.
 */
async function trustFetch(
  session: Session,
  url: string,
  init: { method: string; body?: unknown }
): Promise<Response> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, {
      method: init.method,
      headers: headers(session.token, session.otp ?? undefined),
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
    })
    if (response.status !== 401) {
      session.otp = null
      return response
    }
    const text = await response.text()
    const challenge = (() => {
      try {
        return JSON.parse(text) as { authUrl?: string; doneUrl?: string }
      } catch {
        return {}
      }
    })()
    if (challenge.authUrl && challenge.doneUrl) {
      session.otp = await authorize({
        authUrl: challenge.authUrl,
        doneUrl: challenge.doneUrl,
      })
      session.approvals++
      continue
    }
    if (session.otp) {
      session.otp = null
      continue
    }
    throw new Error(`registry rejected the credentials for ${url}: ${text}`)
  }
  throw new Error(`still unauthorized after a fresh approval for ${url}`)
}

function isCorrect(config: TrustConfig): boolean {
  return (
    config.type === 'github' &&
    config.claims?.repository === repository &&
    config.claims?.workflow_ref?.file === workflowFile &&
    !config.claims?.environment &&
    (config.permissions ?? []).includes('createPackage')
  )
}

function describe(config: TrustConfig): string {
  const claims = config.claims ?? {}
  const parts = [
    `type=${config.type ?? '?'}`,
    `repo=${claims.repository ?? '-'}`,
    `file=${claims.workflow_ref?.file ?? '-'}`,
    `env=${claims.environment ?? '(unset)'}`,
    `permissions=${(config.permissions ?? []).join('|') || '-'}`,
  ]
  return parts.join(' ')
}

async function readTrust(
  session: Session,
  name: string
): Promise<{ state: TrustState; configs: TrustConfig[] }> {
  const response = await trustFetch(session, trustUrl(name), { method: 'GET' })
  if (response.status === 404) return { state: 'absent', configs: [] }
  if (!response.ok) {
    throw new Error(`reading ${name} trust returned ${response.status}`)
  }
  const body = (await response.json()) as TrustConfig[] | { objects?: TrustConfig[] }
  const configs = Array.isArray(body) ? body : (body.objects ?? [])
  if (configs.length === 0) return { state: 'absent', configs }
  return { state: configs.some(isCorrect) ? 'correct' : 'wrong', configs }
}

async function writeTrust(session: Session, name: string, existing: TrustConfig[]) {
  // a stale entry is what an OIDC exchange matches against, so it has to go
  // before the right one lands rather than sitting alongside it
  for (const config of existing) {
    if (!config.id) continue
    const response = await trustFetch(session, trustUrl(name, config.id), {
      method: 'DELETE',
    })
    if (!response.ok && response.status !== 404) {
      throw new Error(`revoking ${name} ${config.id} returned ${response.status}`)
    }
  }
  const response = await trustFetch(session, trustUrl(name), {
    method: 'POST',
    body: [
      {
        type: 'github',
        claims: { repository, workflow_ref: { file: workflowFile } },
        permissions: ['createPackage'],
      },
    ],
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`configuring ${name} returned ${response.status}: ${detail}`)
  }
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
    .filter((name) => !only || name === only)
    .sort()
  if (packages.length === 0) {
    throw new Error(
      only
        ? `${only} is not a publishable workspace package`
        : 'found no publishable workspace packages'
    )
  }

  console.info(`\nChecking ${packages.length} packages against the registry...`)
  const missing = (
    await Promise.all(
      packages.map(async (name) => ((await existsOnNpm(name)) ? undefined : name))
    )
  ).filter((name): name is string => name !== undefined)

  if (missing.length > 0) {
    console.info(`\nNot on npm, need a one-time bootstrap publish (${missing.length}):`)
    for (const name of missing) console.info(`  ${name}`)
  }

  const token = readAuthToken()
  const whoami = await fetch(`${registry}/-/whoami`, {
    headers: { authorization: `Bearer ${token}` },
  })
  const identity = ((await whoami.json()) as { username?: string }).username
  if (identity !== owner) {
    throw new Error(
      `npm must be authenticated as ${owner} (got "${identity ?? 'nobody'}").\n` +
        `Run: npm login --auth-type web`
    )
  }

  console.info(
    `\nReading the trust configuration of ${packages.length - missing.length} published packages.` +
      `\nThis needs one browser approval, and the rest of the run reuses it.`
  )
  const session: Session = { token, otp: null, approvals: 0 }
  const published = packages.filter((name) => !missing.includes(name))
  const wrong: string[] = []
  const absent: string[] = []
  const correct: string[] = []
  const existingByName = new Map<string, TrustConfig[]>()

  for (const [index, name] of published.entries()) {
    const { state, configs } = await readTrust(session, name)
    existingByName.set(name, configs)
    if (state === 'correct') correct.push(name)
    else if (state === 'wrong') {
      wrong.push(name)
      for (const config of configs) console.info(`  ${name}: ${describe(config)}`)
    } else absent.push(name)
    if ((index + 1) % 25 === 0) {
      console.info(`  ...read ${index + 1}/${published.length}`)
    }
  }

  console.info(
    `\n${correct.length} already correct, ${wrong.length} misconfigured, ${absent.length} unconfigured, ${missing.length} not published.`
  )

  const needsWrite = [...wrong, ...absent]
  if (needsWrite.length === 0 && missing.length === 0) {
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

  console.info(
    `\nThis permanently claims ${missing.length} npm package names and grants ${repository} (${workflowFile}) publish rights on ${needsWrite.length + missing.length} packages.`
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
    // npm runs its own browser handshake here if the approval window has closed,
    // which is why this script wants a real terminal
    runNpm(
      [
        'publish',
        '--workspaces',
        '--access',
        'public',
        '--tag',
        'bootstrap',
        '--ignore-scripts',
      ],
      bootstrapDir
    )
    for (const name of missing) {
      for (let attempt = 1; !(await existsOnNpm(name)); attempt++) {
        if (attempt > 30) throw new Error(`${name} never appeared on the registry`)
        console.info(`${name}: waiting for npm registry propagation (${attempt}/30)`)
        await Bun.sleep(10_000)
      }
      needsWrite.push(name)
    }
  }

  needsWrite.sort()
  for (const [index, name] of needsWrite.entries()) {
    await writeTrust(session, name, existingByName.get(name) ?? [])
    console.info(`[${index + 1}/${needsWrite.length}] ${name}: configured`)
  }

  console.info(
    `\nAll ${packages.length} packages are ready after ${session.approvals} browser approval(s). Rerun the Release workflow.`
  )
}

main().catch((error) => {
  console.error(`\nBootstrap stopped: ${error instanceof Error ? error.message : error}`)
  console.error('Fix the reported problem, then rerun the same command.')
  console.error(
    'Already-correct packages are detected on the next run, so a rerun resumes.'
  )
  process.exitCode = 1
})
