import fs, { ensureDir, writeJSON } from 'fs-extra'
import * as proc from 'node:child_process'
import path, { join } from 'node:path'
import { promisify } from 'node:util'
import pMap from 'p-map'
import prompts from 'prompts'

import { computePublishTag } from './release-publish-tag'
import { spawnify } from './spawnify'

process.setMaxListeners(50)
process.stdout.setMaxListeners(50)
process.stderr.setMaxListeners(50)

// --resume would be cool here where it stores the last failed step somewhere and tries resuming

const exec = promisify(proc.exec)
export const spawn = proc.spawn

// for failed publishes that need to re-run
const reRun = process.argv.includes('--rerun')
const rePublish = reRun || process.argv.includes('--republish')
const shouldFinish = process.argv.includes('--finish')

// convenience flags
const skipAll = process.argv.includes('--skip-all')
const undocumented = process.argv.includes('--undocumented')

const canary = process.argv.includes('--canary')
const isRC = process.argv.includes('--rc')
const isBeta = process.argv.includes('--beta')
// the prerelease channel requested via flag (null for stable / canary releases)
const requestedChannel = isBeta ? 'beta' : isRC ? 'rc' : null

// explicit dist-tag override: `--tag <name>`. always wins over version-based
// detection (the escape hatch for publishing to an arbitrary tag).
const explicitTagIdx = process.argv.indexOf('--tag')
const explicitTag =
  explicitTagIdx !== -1 ? (process.argv[explicitTagIdx + 1] || '').trim() : undefined

const skipStarters = canary || skipAll || process.argv.includes('--skip-starters')
const skipVersion = shouldFinish || rePublish || process.argv.includes('--skip-version')
const shouldPatch = process.argv.includes('--patch')
const dirty =
  shouldFinish || rePublish || undocumented || process.argv.includes('--dirty')
const skipPublish = process.argv.includes('--skip-publish')
const skipTest =
  shouldFinish ||
  rePublish ||
  skipAll ||
  process.argv.includes('--skip-test') ||
  process.argv.includes('--skip-tests')
const skipNativeTests =
  process.argv.includes('--skip-native-test') ||
  process.argv.includes('--skip-native-tests')
const skipChecks = rePublish || skipAll || process.argv.includes('--skip-checks')
const skipBuild =
  shouldFinish || rePublish || skipAll || process.argv.includes('--skip-build')
const buildFast = process.argv.includes('--build-fast')
const dryRun = process.argv.includes('--dry-run')
const tamaguiGitUser = process.argv.includes('--tamagui-git-user')
const isCI = shouldFinish || rePublish || undocumented || process.argv.includes('--ci')
const canPromptForNpmOtp =
  !shouldFinish && !undocumented && !process.argv.includes('--ci') && !process.env.CI
const skipFinish =
  rePublish || skipAll || undocumented || process.argv.includes('--skip-finish')
const forcePublishAll = process.argv.includes('--force-publish-all')

const curVersion = fs.readJSONSync('./code/ui/tamagui/package.json').version

function isPublishAuthOrOtpError(message: string) {
  return (
    /EOTP|one-time password/i.test(message) ||
    /code E404[\s\S]*PUT https:\/\/registry\.npmjs\.org\/@[^/\s]+%2f[^/\s]+/i.test(
      message
    )
  )
}

function redactNpmOtp(command: string) {
  return command.replace(/--otp(?:=|\s+)\S+/g, '--otp=******')
}

async function getLastReleaseRef(): Promise<string | null> {
  // find the most recent baseline: either a v* tag or a canary commit
  let tagRef: { ref: string; date: number } | null = null
  let canaryRef: { ref: string; date: number } | null = null

  try {
    const { stdout } = await exec(`git describe --tags --match 'v*' --abbrev=0`)
    const tag = stdout.trim()
    const { stdout: dateStr } = await exec(`git log -1 --format=%ct ${tag}`)
    tagRef = { ref: tag, date: Number(dateStr.trim()) }
  } catch {}

  try {
    const { stdout } = await exec(`git log --grep='^canary' --format='%H %ct' -1`)
    const [hash, dateStr] = stdout.trim().split(' ')
    if (hash) {
      canaryRef = { ref: hash, date: Number(dateStr) }
    }
  } catch {}

  if (!tagRef && !canaryRef) return null
  if (!tagRef) return canaryRef!.ref
  if (!canaryRef) return tagRef.ref
  // use whichever is more recent
  return canaryRef.date > tagRef.date ? canaryRef.ref : tagRef.ref
}

async function hasSourceChanges(dir: string, tag: string): Promise<boolean> {
  try {
    await exec(`git diff --quiet ${tag} HEAD -- ${dir}/src/`)
    return false
  } catch {
    // non-zero exit = there are changes
    return true
  }
}

// Detect the current prerelease channel, if any (e.g. 2.0.0-rc.34 or 3.0.0-beta.5).
// Strip any canary timestamp suffix first so a canary of X.Y.Z isn't mistaken
// for a channel prerelease.
const curVersionStripped = curVersion.replace(/-\d{10,}$/, '')
const channelMatch = curVersionStripped.match(/^(\d+\.\d+\.\d+)-([a-z]+)\.(\d+)$/i)
const currentChannel = channelMatch ? channelMatch[2].toLowerCase() : null
const currentChannelBase = channelMatch ? channelMatch[1] : null
const currentChannelNumber = channelMatch ? Number.parseInt(channelMatch[3], 10) : 0

const nextVersion = (() => {
  if (rePublish) {
    return curVersion
  }

  if (canary) {
    return `${curVersion.replace(/(-\d+)+$/, '')}-${Date.now()}`
  }

  // prerelease channel mode (--rc / --beta): bump within the channel or start it
  if (requestedChannel) {
    if (currentChannel === requestedChannel && currentChannelBase) {
      // already on this channel, bump the channel number
      return `${currentChannelBase}-${requestedChannel}.${currentChannelNumber + 1}`
    }
    // switching channels (rc -> beta) or coming from a canary: start the channel
    // at .0 on the current base version (e.g. canary of X.Y.Z -> X.Y.Z-beta.0)
    const baseVersion = curVersion.replace(/-.*$/, '') // strip any existing prerelease
    const isCanaryOfCurrent = /-\d+$/.test(curVersion)
    if (isCanaryOfCurrent || currentChannel) {
      return `${baseVersion}-${requestedChannel}.0`
    }
    // coming from a stable version - the base is ambiguous, set via prompt
    return null
  }

  // promoting a prerelease to stable: use the base version (e.g. 2.0.0-rc.34 -> 2.0.0)
  if (currentChannel && currentChannelBase) {
    return currentChannelBase
  }

  let plusVersion = skipVersion ? 0 : 1
  const patchAndCanary = curVersion.split('.')[2]
  const [patch, lastCanary] = patchAndCanary.split('-')
  // if were publishing another canary no bump version
  if (lastCanary && canary) {
    plusVersion = 0
  }
  const curMajor = +curVersion.split('.')[0] || 1
  const patchVersion = shouldPatch ? +patch + plusVersion : 0
  const curMinor = +curVersion.split('.')[1] || 0
  const minorVersion = curMinor + (shouldPatch ? 0 : plusVersion)
  const next = `${curMajor}.${minorVersion}.${patchVersion}`

  return next
})()

const sleep = (ms) => {
  console.info(`Sleeping ${ms}ms`)
  return new Promise((res) => setTimeout(res, ms))
}

if (!skipVersion) {
  console.info('Current:', curVersion, '\n')
} else {
  console.info(`Re-releasing ${curVersion}`)
}

const currentBranch = (await exec(`git rev-parse --abbrev-ref HEAD`)).stdout.trim()
const isMain = currentBranch === 'main'

async function getWorkspacePackages() {
  const rootPkg = await fs.readJSON('package.json')
  const workspaceGlobs = rootPkg.workspaces || []
  const packages: { name: string; location: string }[] = []

  for (const pattern of workspaceGlobs) {
    // normalize pattern: remove leading ./ and handle glob patterns
    const normalizedPattern = pattern.replace(/^\.\//, '')

    if (normalizedPattern.includes('**')) {
      // for **/* patterns, we need to scan subdirectories
      // e.g., code/ui/**/* -> scan all subdirs of code/ui/
      const baseDir = normalizedPattern.split('**')[0].replace(/\/$/, '')
      try {
        const entries = await fs.readdir(baseDir, { withFileTypes: true })
        for (const entry of entries) {
          if (!entry.isDirectory()) continue
          const pkgPath = path.join(baseDir, entry.name, 'package.json')
          try {
            const pkg = await fs.readJSON(pkgPath)
            if (pkg.name) {
              packages.push({ name: pkg.name, location: path.join(baseDir, entry.name) })
            }
          } catch {
            // skip directories without package.json
          }
        }
      } catch {
        // skip patterns that don't resolve
      }
    } else if (normalizedPattern.includes('*')) {
      // for single * patterns, scan the parent directory
      const baseDir = normalizedPattern.replace(/\/\*$/, '')
      try {
        const entries = await fs.readdir(baseDir, { withFileTypes: true })
        for (const entry of entries) {
          if (!entry.isDirectory()) continue
          const pkgPath = path.join(baseDir, entry.name, 'package.json')
          try {
            const pkg = await fs.readJSON(pkgPath)
            if (pkg.name) {
              packages.push({ name: pkg.name, location: path.join(baseDir, entry.name) })
            }
          } catch {
            // skip directories without package.json
          }
        }
      } catch {
        // skip patterns that don't resolve
      }
    } else {
      // exact path - just check if it has a package.json
      try {
        const pkg = await fs.readJSON(path.join(normalizedPattern, 'package.json'))
        if (pkg.name) {
          packages.push({ name: pkg.name, location: normalizedPattern })
        }
      } catch {
        // skip if no package.json
      }
    }
  }

  return packages
}

async function run() {
  try {
    let version = curVersion

    // ensure we are up to date
    // ensure we are on main (skip branch check for canary releases, channel
    // prereleases like --beta/--rc which cut from their own branch, and dry runs)
    if (!canary && !rePublish && !dryRun && !requestedChannel) {
      if (!isMain) {
        throw new Error(`Not on main`)
      }
    }
    if (!dirty && !rePublish && !shouldFinish && !canary && !dryRun) {
      await spawnify(`git pull --rebase origin ${currentBranch}`)
    }

    const packagePaths = await getWorkspacePackages()

    const allPackageJsons = (
      await Promise.all(
        packagePaths
          .filter((i) => i.location !== '.' && !i.name.startsWith('@takeout'))
          .flatMap(async ({ name, location }) => {
            const cwd = path.join(process.cwd(), location)
            const json = await fs.readJSON(path.join(cwd, 'package.json'))
            const item = {
              name,
              cwd,
              json,
              path: path.join(cwd, 'package.json'),
              directory: location,
            }

            if (json.alsoPublishAs) {
              console.info(
                ` ${name}: Also publishing as ${json.alsoPublishAs.join(', ')}`
              )
              return [
                item,
                ...json.alsoPublishAs.map((name) => ({
                  ...item,
                  json: { ...json, name },
                  name,
                })),
              ]
            }

            return [item]
          })
      )
    )
      .flat()
      .filter((x) => !x.json['skipPublish'])

    const packageJsons = allPackageJsons
      .filter((x) => {
        return !x.json.private
      })
      // slow things last
      .sort((a, b) => {
        if (a.name.includes('font-') || a.name.includes('-icons')) {
          return 1
        }
        return -1
      })

    if (!shouldFinish) {
      console.info(
        `Publishing in order:\n\n${packageJsons.map((x) => x.name).join('\n')}`
      )
    }

    async function checkDistDirs() {
      await Promise.all(
        packageJsons.map(async ({ cwd, json }) => {
          const distDir = join(cwd, 'dist')
          if (!json.scripts || !json.scripts.build || json.scripts.build === 'true') {
            return
          }
          if (!(await fs.pathExists(distDir))) {
            console.warn('no dist dir!', distDir)
            process.exit(1)
          }
        })
      )
    }

    // ensure right user
    if (tamaguiGitUser) {
      await spawnify(`git config --global user.name 'Tamagui'`)
      await spawnify(`git config --global user.email 'tamagui@users.noreply.github.com`)
    }

    // get version
    if (!shouldFinish) {
      let answer: { version: string }

      if (isCI || skipVersion) {
        if (!nextVersion) {
          throw new Error(
            `Cannot compute a ${requestedChannel} version from a stable base (${curVersion}) non-interactively.\n` +
              `Run without --ci to pick the base, or bump to a canary/${requestedChannel} version first.`
          )
        }
        answer = { version: nextVersion }
      } else if (requestedChannel && currentChannel !== requestedChannel) {
        // Starting a new prerelease channel - prompt for which base version to use
        const baseVersion = curVersion.replace(/-.*$/, '') // strip any existing prerelease
        const [major, minor, patch] = baseVersion.split('.').map(Number)

        // check if current version is a canary (has prerelease suffix like -1234567)
        const isCanaryOfCurrent = /-\d+$/.test(curVersion)

        const channelChoices =
          isCanaryOfCurrent || currentChannel
            ? [
                // canary/other-channel of X.Y.Z -> offer X.Y.Z-<channel>.0
                {
                  title: `${major}.${minor}.${patch}-${requestedChannel}.0`,
                  value: `${major}.${minor}.${patch}-${requestedChannel}.0`,
                },
              ]
            : [
                {
                  title: `${major}.${minor + 1}.0-${requestedChannel}.0 (next minor)`,
                  value: `${major}.${minor + 1}.0-${requestedChannel}.0`,
                },
                {
                  title: `${major}.${minor}.${patch + 1}-${requestedChannel}.0 (next patch)`,
                  value: `${major}.${minor}.${patch + 1}-${requestedChannel}.0`,
                },
                {
                  title: `${major + 1}.0.0-${requestedChannel}.0 (next major)`,
                  value: `${major + 1}.0.0-${requestedChannel}.0`,
                },
              ]

        const channelAnswer = await prompts({
          type: 'select',
          name: 'version',
          message: `Which version to release as ${requestedChannel}?`,
          choices: channelChoices,
        })

        answer = channelAnswer
      } else {
        answer = await prompts({
          type: 'text',
          name: 'version',
          message: 'Version?',
          initial: nextVersion,
        })
      }

      version = answer.version
      console.info('Next:', version, '\n')
    }

    // resolve + validate the npm dist-tag up front, so a prerelease can never
    // slip onto `latest`, and so --dry-run can print the exact publish plan.
    // throws loudly for an unrecognized prerelease instead of defaulting to latest.
    const publishTag = computePublishTag(version, { canary, explicitTag })
    console.info(`Publishing to npm dist-tag: ${publishTag}\n`)

    // safety check for major version bumps going to `latest` - require interactive
    // confirmation. a prerelease of a new major (e.g. 3.0.0-beta.0 -> `beta`) can't
    // clobber the stable line, so it skips this gate.
    const curMajor = Number.parseInt(curVersion.split('.')[0], 10)
    const nextMajor = Number.parseInt(version.split('.')[0], 10)
    if (nextMajor > curMajor && publishTag === 'latest') {
      console.info(`\n⚠️  MAJOR VERSION BUMP: ${curVersion} → ${version}\n`)

      for (let i = 1; i <= 3; i++) {
        const { confirmed } = await prompts({
          type: 'confirm',
          name: 'confirmed',
          message: `Confirm major version bump (${i}/3)?`,
        })
        if (!confirmed) {
          console.info('Major version bump cancelled.')
          process.exit(0)
        }
      }
    }

    // dry run only previews the publish plan, so skip the heavy install/build/test
    if (!dryRun) {
      console.info('install and build')
    }

    if (!rePublish && !shouldFinish && !dryRun) {
      await spawnify(`bun install`)
    }

    // build from fresh
    if (!skipBuild && !shouldFinish && !dryRun) {
      // lets do a full clean and build:force, to ensure we dont have weird cached or leftover files
      if (buildFast) {
        await spawnify(`bun run build`)
      } else {
        await spawnify(`bun run build:force`)
      }
      await checkDistDirs()
    }

    // run checks
    if (!shouldFinish && !dryRun) {
      if (!skipChecks) {
        console.info('run checks')
        await Promise.all([
          spawnify(`chmod ug+x ./node_modules/.bin/tamagui`),
          spawnify(`bun run check`),
          spawnify(`bun run lint`),
        ])
        await spawnify(`bun run typecheck`)
      }
      if (!skipTest) {
        console.info('run tests')
        await spawnify(`bun run test`, {
          env: {
            ...process.env,
            ...(isCI ? { CI: 'true' } : {}),
            ...(skipNativeTests ? { SKIP_NATIVE_TESTS: 'true' } : {}),
          },
        })
      }
    }

    // check clean git
    if (!dirty && !dryRun && !rePublish) {
      const out = await exec(`git status --porcelain`)
      if (out.stdout) {
        throw new Error(`Has unsaved git changes: ${out.stdout}`)
      }
    }

    // update version (never write files during a dry run - it's a read-only preview)
    if (!skipVersion && !shouldFinish && !dryRun) {
      await Promise.all(
        allPackageJsons.map(async ({ json, path }) => {
          const next = { ...json }
          next.version = version
          await writeJSON(path, next, { spaces: 2 })
        })
      )
    }

    // packages with "skipPublishIfUnchanged": true in package.json can be
    // skipped when their source hasn't changed since the last release.
    function isSkippablePackage(pkg: (typeof packageJsons)[0]) {
      return !!pkg.json.skipPublishIfUnchanged
    }

    const lastTag = await getLastReleaseRef()
    const skippedPackages: typeof packageJsons = []
    let packagesToPublish = packageJsons

    if (lastTag && !forcePublishAll) {
      const lastTagVersion = lastTag.replace(/^v/, '')
      const lastMajor = Number.parseInt(lastTagVersion.split('.')[0], 10)
      const nextMajor = Number.parseInt(version.split('.')[0], 10)
      const isMajorBump = nextMajor > lastMajor

      if (!isMajorBump) {
        const changed: typeof packageJsons = []
        const unchanged: typeof packageJsons = []

        for (const pkg of packageJsons) {
          if (!isSkippablePackage(pkg)) {
            changed.push(pkg)
            continue
          }
          const hasChanges = await hasSourceChanges(pkg.directory, lastTag)
          if (hasChanges) {
            changed.push(pkg)
          } else {
            unchanged.push(pkg)
          }
        }

        if (unchanged.length > 0) {
          console.info(
            `\nSkipping ${unchanged.length} unchanged packages:\n${unchanged.map((p) => `  - ${p.name}`).join('\n')}\n`
          )
          skippedPackages.push(...unchanged)
          packagesToPublish = changed
        }
      } else {
        console.info(`Major version bump detected, publishing all packages`)
      }
    } else if (forcePublishAll) {
      console.info(`--force-publish-all: publishing all packages`)
    }

    // for skipped packages, resolve their last published version so deps point
    // to a version that actually exists on the registry
    const skippedVersions = new Map<string, string>()

    if (skippedPackages.length > 0) {
      // resolve against the same dist-tag we're publishing to, so a beta release
      // points beta deps at the last beta, a stable at the last stable, etc.
      const distTag = publishTag
      console.info(
        `Resolving last published versions for skipped packages (tag: ${distTag})...`
      )
      await pMap(
        skippedPackages,
        async ({ name }) => {
          try {
            const { stdout } = await exec(`npm view ${name} dist-tags.${distTag}`)
            const lastVersion = stdout.trim()
            if (lastVersion) {
              skippedVersions.set(name, lastVersion)
              console.info(`  ${name}: ${lastVersion}`)
            } else {
              // no published version, will use new version (force publish)
              skippedVersions.set(name, version)
            }
          } catch {
            // never published, use new version
            skippedVersions.set(name, version)
          }
        },
        { concurrency: 10 }
      )
    }

    if (!shouldFinish && dryRun) {
      console.info(`\n── dry run: publish plan ──`)
      console.info(`version:      ${version}`)
      console.info(`npm dist-tag: ${publishTag}`)
      console.info(`\npublishing ${packagesToPublish.length} packages:\n`)
      for (const { name } of packagesToPublish) {
        const accessOption = name.startsWith('@') ? ' --access public' : ''
        console.info(
          `  npm publish ${name}@${version} --tag ${publishTag}${accessOption}`
        )
      }
      if (skippedPackages.length > 0) {
        console.info(
          `\nskipped (unchanged), dist-tag "${publishTag}" will point at last published:`
        )
        for (const { name } of skippedPackages) {
          console.info(`  ${name}@${skippedVersions.get(name) ?? '(unpublished)'}`)
        }
      }
      console.info(`\nDry run, exiting before publish`)
      return
    }

    if (!shouldFinish && !rePublish) {
      await spawnify(`git diff`)
    }

    if (!isCI) {
      const { confirmed } = await prompts({
        type: 'confirm',
        name: 'confirmed',
        message: 'Ready to publish?',
      })

      if (!confirmed) {
        process.exit(0)
      }
    }

    if (!shouldFinish && !skipPublish) {
      const tmpDir = `/tmp/tamagui-publish`
      await ensureDir(tmpDir)

      // publishTag was resolved + validated up front (single source of truth)
      const publishOptions = `--tag ${publishTag}`

      // shared OTP state — set once on first EOTP, then threaded through every
      // subsequent npm publish. single-flight so parallel failures don't
      // stack prompts; re-prompt if the code expires mid-batch.
      let cachedOtp: string | undefined
      let otpPromptInFlight: Promise<string> | undefined
      const getOtp = (reason: string, optional = false): Promise<string> => {
        if (otpPromptInFlight) return otpPromptInFlight
        otpPromptInFlight = (async () => {
          console.info(`\n${reason}`)
          const { code } = await prompts({
            type: 'text',
            name: 'code',
            message: optional
              ? 'npm 2FA code (6 digits, empty to skip)'
              : 'npm 2FA code (6 digits)',
            validate: (v: string) =>
              (optional && !(v ?? '').trim()) ||
              /^\d{6}$/.test((v ?? '').trim()) ||
              'Enter a 6-digit code',
          })
          if (!code) {
            if (optional) return ''
            throw new Error('No OTP provided, aborting publish')
          }
          cachedOtp = String(code).trim()
          return cachedOtp
        })().finally(() => {
          otpPromptInFlight = undefined
        })
        return otpPromptInFlight
      }

      const failedPublishes: string[] = []

      try {
        await spawnify(`npm whoami`, { cwd: tmpDir })
      } catch (err) {
        throw new Error(
          `npm is not authenticated for publishing. Run \`npm login\` and then re-run the release.\n\n${err}`
        )
      }

      if (
        !process.env.npm_config_otp &&
        !process.env.NPM_CONFIG_OTP &&
        canPromptForNpmOtp
      ) {
        await getOtp(
          'Most Tamagui npm publishes require 2FA. Provide the current code now so every package publish uses it.',
          true
        )
      } else {
        cachedOtp = process.env.npm_config_otp || process.env.NPM_CONFIG_OTP
      }

      const publishOne = async ({ name, cwd }: { name: string; cwd: string }) => {
        // Copy to temp directory and replace workspace:* with versions
        const tmpPackageDir = join(tmpDir, name.replace('/', '_'))
        await fs.copy(cwd, tmpPackageDir, {
          filter: (src) => {
            // exclude node_modules to avoid symlink issues
            return !src.includes('node_modules')
          },
        })

        // replace workspace:* with version in temp copy
        const pkgJsonPath = join(tmpPackageDir, 'package.json')
        const pkgJson = await fs.readJSON(pkgJsonPath)
        for (const field of [
          'dependencies',
          'devDependencies',
          'optionalDependencies',
          'peerDependencies',
        ]) {
          if (!pkgJson[field]) continue
          for (const depName in pkgJson[field]) {
            if (pkgJson[field][depName].startsWith('workspace:')) {
              // use the skipped package's last published version if it won't be published
              pkgJson[field][depName] = skippedVersions.get(depName) || version
            }
          }
        }
        await writeJSON(pkgJsonPath, pkgJson, { spaces: 2 })

        const filename = `${name.replace('/', '_')}-package.tmp.tgz`
        const absolutePath = `${tmpDir}/${filename}`
        await spawnify(`npm pack --pack-destination ${tmpDir}`, {
          cwd: tmpPackageDir,
          avoidLog: true,
        })

        // npm pack creates a file with the package name, rename it to our expected name
        const npmFilename = `${name.replace('@', '').replace('/', '-')}-${version}.tgz`
        await fs.rename(join(tmpDir, npmFilename), absolutePath)

        const accessOption = name.startsWith('@') ? '--access public' : ''
        const buildPublishCommand = () =>
          ['npm publish', absolutePath, publishOptions, accessOption]
            .filter(Boolean)
            .join(' ')

        console.info(
          `Publishing ${name}: ${redactNpmOtp(
            [buildPublishCommand(), cachedOtp && '--otp=******'].filter(Boolean).join(' ')
          )}`
        )

        let attempt = 0
        let otp = cachedOtp
        while (true) {
          attempt++
          try {
            await spawnify(buildPublishCommand(), {
              cwd: tmpDir,
              env: otp
                ? {
                    ...process.env,
                    npm_config_otp: otp,
                  }
                : process.env,
            })
            return
          } catch (err) {
            const msg = String(err)
            const needsOtp = isPublishAuthOrOtpError(msg)
            if (needsOtp && attempt < 3) {
              // the otp we used is stale; force a fresh prompt
              if (otp && cachedOtp === otp) cachedOtp = undefined
              otp = await getOtp(
                attempt === 1
                  ? `npm requires a 2FA code to publish ${name}`
                  : `npm 2FA code expired, need a fresh one for ${name}`
              )
              continue
            }
            if (rePublish) {
              console.warn(
                `⚠️  ${name}: publish failed (likely already published), continuing`
              )
              return
            }
            console.error(`Failed to publish ${name}:`, err)
            failedPublishes.push(name)
            return
          }
        }
      }

      // probe with the first package serially so EOTP triggers exactly one
      // prompt before we fan out the rest in parallel
      const [firstPkg, ...restPkgs] = packagesToPublish
      if (firstPkg) {
        await publishOne(firstPkg)
      }
      await pMap(restPkgs, publishOne, { concurrency: 15 })

      if (failedPublishes.length > 0) {
        throw new Error(
          `Failed to publish ${failedPublishes.length} packages:\n${failedPublishes.join('\n')}\n\nRe-run with --republish to retry.`
        )
      }

      console.info(`✅ Published\n`)

      // for a non-latest channel (canary/beta/rc/…), point that dist-tag at the
      // latest published version of each skipped package so e.g.
      // `npm install @tamagui/lucide-icons-2@beta` still resolves
      if (publishTag !== 'latest' && skippedPackages.length > 0) {
        console.info(
          `Updating ${publishTag} dist-tags for ${skippedPackages.length} skipped packages...`
        )
        await pMap(
          skippedPackages,
          async ({ name }) => {
            try {
              const { stdout } = await exec(`npm view ${name} dist-tags.latest`)
              const latestVersion = stdout.trim()
              if (latestVersion) {
                await spawnify(
                  `npm dist-tag add ${name}@${latestVersion} ${publishTag}`,
                  {
                    avoidLog: true,
                  }
                )
                console.info(`  ✓ ${name}@${latestVersion} tagged as ${publishTag}`)
              }
            } catch (err) {
              console.warn(`  ✗ ${name}: could not update ${publishTag} tag`, err)
            }
          },
          { concurrency: 10 }
        )
      }

      // restore package.json files for undocumented releases
      if (undocumented) {
        console.info('Restoring package.json files...')
        await spawnify(`git checkout -- **/package.json`)
        console.info(`✅ Restored package.json files (undocumented release)\n`)
      }
    }

    if (!skipFinish) {
      // then git tag, commit, push
      if (!shouldFinish) {
        await spawnify(`bun install`)
      }

      const tagPrefix = canary ? 'canary' : 'v'
      const gitTag = `${tagPrefix}${version}`

      if (!shouldFinish) {
        // longer sleep since npm was missing some deps
        await sleep(10 * 1000)
      }

      // shell issues
      // if (!canary && !skipStarters) {
      //   const starterFreeDir = join(process.cwd(), '../starter-free')
      //   if (!dirty) {
      //     await spawnify(`git pull --rebase origin HEAD`, { cwd: starterFreeDir })
      //   }

      //   await spawnify(`bun run upgrade:starters`)

      //   if (!shouldFinish) {
      //     // Run bun test in starter-free directory
      //     await spawnify(`bun run test`, { cwd: starterFreeDir })
      //     await finishAndCommit(starterFreeDir)
      //   }
      // }

      await finishAndCommit()

      async function finishAndCommit(cwd = process.cwd()) {
        if (!rePublish || reRun || shouldFinish) {
          await spawnify(`git add -A`, { cwd })

          // check if there are staged changes before committing
          const hasChanges = await exec(`git diff --cached --quiet`, { cwd }).then(
            () => false,
            () => true
          )

          if (!hasChanges) {
            console.info(`No changes to commit in ${cwd}, skipping`)
            return
          }

          await spawnify(`git commit -m ${gitTag}`, { cwd })
          if (!canary) {
            await spawnify(`git tag ${gitTag}`, { cwd })
          }

          if (!dirty) {
            // pull once more before pushing so if there was a push in interim we get it
            const currentBranch = (
              await exec(`git rev-parse --abbrev-ref HEAD`, { cwd })
            ).stdout.trim()
            await spawnify(`git pull --rebase origin ${currentBranch}`, { cwd })
          }

          await spawnify(`git push origin head`, { cwd })
          if (!canary) {
            await spawnify(`git push origin ${gitTag}`, { cwd })
          }

          console.info(`✅ Pushed and versioned\n`)
        }
      }

      // console.info(`All done, cleanup up in...`)
      // await sleep(2 * 1000)
      // // then remove old prepub tag
      // await pMap(
      //   packageJsons,
      //   async ({ name, cwd }) => {
      //     await spawnify(`npm dist-tag remove ${name}@${version} prepub`, {
      //       cwd,
      //     }).catch((err) => console.error(err))
      //   },
      //   {
      //     concurrency: 20,
      //   }
      // )
    }

    console.info(`✅ Done\n`)
  } catch (err) {
    console.info('\nError:\n', err)
    process.exit(1)
  }
}

// --into <dir>: quick local release, packs each package and unpacks into target node_modules
const intoIdx = process.argv.indexOf('--into')
if (intoIdx !== -1) {
  const targetArg = process.argv[intoIdx + 1]
  if (!targetArg) {
    console.error('Missing directory argument for --into')
    process.exit(1)
  }
  const targetDir = path.resolve(targetArg.replace(/^~/, process.env.HOME!))

  ;(async () => {
    const packages = await getWorkspacePackages()
    const tmpDir = `/tmp/tamagui-release-into`
    await ensureDir(tmpDir)

    let released = 0

    await pMap(
      packages,
      async ({ name, location }) => {
        const destDir = join(targetDir, 'node_modules', name)
        if (!(await fs.pathExists(destDir))) return

        const cwd = path.resolve(location)

        try {
          await spawnify(`npm pack --pack-destination ${tmpDir}`, {
            cwd,
            avoidLog: true,
          })

          // npm pack names files based on version in package.json, find the actual file
          const files = await fs.readdir(tmpDir)
          const prefix = name.replace('@', '').replace('/', '-')
          const packed = files.find((f) => f.startsWith(prefix) && f.endsWith('.tgz'))

          if (!packed) {
            console.warn(`  skip ${name}: pack produced no tgz`)
            return
          }

          const actualTgz = join(tmpDir, packed)

          // clear destination and extract
          await spawnify(`tar -xzf ${actualTgz} -C ${destDir} --strip-components=1`, {
            avoidLog: true,
          })

          await fs.remove(actualTgz)
          released++
          console.info(`  ✓ ${name}`)
        } catch (err) {
          console.warn(`  ✗ ${name}: ${err}`)
        }
      },
      { concurrency: 10 }
    )

    console.info(`\n✅ Released ${released} packages into ${targetDir}`)
    process.exit(0)
  })()
} else {
  run()
}
