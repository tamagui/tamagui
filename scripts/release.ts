import fs, { ensureDir, writeJSON } from 'fs-extra'
import * as proc from 'node:child_process'
import path, { join } from 'node:path'
import { promisify } from 'node:util'
import pMap from 'p-map'
import prompts from 'prompts'

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

const canary = process.argv.includes('--canary')
const isRC = process.argv.includes('--rc')
const skipStarters = canary || process.argv.includes('--skip-starters')
const skipVersion = shouldFinish || rePublish || process.argv.includes('--skip-version')
const shouldPatch = process.argv.includes('--patch')
const dirty = shouldFinish || rePublish || process.argv.includes('--dirty')
const skipPublish = process.argv.includes('--skip-publish')
const skipTest =
  shouldFinish ||
  rePublish ||
  process.argv.includes('--skip-test') ||
  process.argv.includes('--skip-tests')
const skipNativeTests =
  process.argv.includes('--skip-native-test') ||
  process.argv.includes('--skip-native-tests')
const skipChecks = rePublish || process.argv.includes('--skip-checks')
const skipBuild = shouldFinish || rePublish || process.argv.includes('--skip-build')
const buildFast = process.argv.includes('--build-fast')
const dryRun = process.argv.includes('--dry-run')
const tamaguiGitUser = process.argv.includes('--tamagui-git-user')
const isCI = shouldFinish || rePublish || process.argv.includes('--ci')
const skipFinish = rePublish || process.argv.includes('--skip-finish')

const curVersion = fs.readJSONSync('./code/ui/tamagui/package.json').version

// Check if current version is an RC (e.g., 1.143.0-rc.1)
const rcMatch = curVersion.match(/^(\d+\.\d+\.\d+)-rc\.(\d+)$/)
const isCurrentRC = !!rcMatch
const currentRCBase = rcMatch ? rcMatch[1] : null
const currentRCNumber = rcMatch ? Number.parseInt(rcMatch[2], 10) : 0

const nextVersion = (() => {
  if (rePublish) {
    return curVersion
  }

  if (canary) {
    return `${curVersion.replace(/(-\d+)+$/, '')}-${Date.now()}`
  }

  // RC mode: bump existing RC or will prompt for new RC version
  if (isRC) {
    if (isCurrentRC) {
      // Already an RC, bump the RC number
      return `${currentRCBase}-rc.${currentRCNumber + 1}`
    }
    // Not an RC yet, return null - will be set via prompt
    return null
  }

  let plusVersion = skipVersion ? 0 : 1
  const patchAndCanary = curVersion.split('.')[2]
  const [patch, lastCanary] = patchAndCanary.split('-')
  // if were publishing another canary no bump version
  if (lastCanary && canary) {
    plusVersion = 0
  }
  const patchVersion = shouldPatch ? +patch + plusVersion : 0
  const curMinor = +curVersion.split('.')[1] || 0
  const minorVersion = curMinor + (shouldPatch ? 0 : plusVersion)
  const next = `1.${minorVersion}.${patchVersion}`

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

const isMain = (await exec(`git rev-parse --abbrev-ref HEAD`)).stdout.trim() === 'main'

async function run() {
  try {
    let version = curVersion

    // ensure we are up to date
    // ensure we are on main (skip for canary and rc releases)
    if (!canary && !isRC && !rePublish) {
      if (!isMain) {
        throw new Error(`Not on main`)
      }
      if (!dirty && !rePublish && !shouldFinish) {
        await spawnify(`git pull --rebase origin main`)
      }
    }

    const workspaces = (await exec(`yarn workspaces list --json`)).stdout
      .trim()
      .split('\n')
    const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
      name: string
      location: string
    }[]

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
        answer = { version: nextVersion! }
      } else if (isRC && !isCurrentRC) {
        // New RC - prompt for which version to RC
        const baseVersion = curVersion.replace(/-.*$/, '') // strip any existing prerelease
        const [major, minor, patch] = baseVersion.split('.').map(Number)

        const rcChoices = [
          {
            title: `${major}.${minor + 1}.0-rc.1 (next minor)`,
            value: `${major}.${minor + 1}.0-rc.1`,
          },
          {
            title: `${major}.${minor}.${patch + 1}-rc.1 (next patch)`,
            value: `${major}.${minor}.${patch + 1}-rc.1`,
          },
          { title: `${major + 1}.0.0-rc.1 (next major)`, value: `${major + 1}.0.0-rc.1` },
        ]

        const rcAnswer = await prompts({
          type: 'select',
          name: 'version',
          message: 'Which version to release as RC?',
          choices: rcChoices,
        })

        answer = rcAnswer
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

    console.info('install and build')

    if (!rePublish && !shouldFinish) {
      await spawnify(`yarn install`)
    }

    // build from fresh
    if (!skipBuild && !shouldFinish) {
      // lets do a full clean and build:force, to ensure we dont have weird cached or leftover files
      if (buildFast) {
        await spawnify(`yarn build`)
      } else {
        await spawnify(`yarn build:force`)
      }
      await checkDistDirs()
    }

    // run checks
    if (!shouldFinish) {
      if (!skipChecks) {
        console.info('run checks')
        await Promise.all([
          spawnify(`chmod ug+x ./node_modules/.bin/tamagui`),
          spawnify(`yarn check`),
          spawnify(`yarn lint`),
        ])
        await spawnify(`yarn typecheck`)
      }
      if (!skipTest) {
        console.info('run tests')
        await spawnify(`yarn test`, {
          env: {
            ...process.env,
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

    // update version
    if (!skipVersion && !shouldFinish) {
      await Promise.all(
        allPackageJsons.map(async ({ json, path }) => {
          const next = { ...json }
          next.version = version
          await writeJSON(path, next, { spaces: 2 })
        })
      )
    }

    if (!shouldFinish && dryRun) {
      console.info(`Dry run, exiting before publish`)
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

      // pack and publish
      await pMap(
        packageJsons,
        async ({ name, cwd }) => {
          const isCanaryVersion = /^\d+\.\d+\.\d+-\d+$/.test(version)
          const publishTag =
            canary || isCanaryVersion
              ? 'canary'
              : version.includes('-rc.')
                ? 'rc'
                : undefined
          const publishOptions = [publishTag && `--tag ${publishTag}`]
            .filter(Boolean)
            .join(' ')

          const absolutePath = `${tmpDir}/${name.replace('/', '_')}-package.tmp.tgz`
          await spawnify(`yarn pack --out ${absolutePath}`, {
            cwd,
            avoidLog: true,
          })

          const publishCommand = [
            'npm publish',
            absolutePath, // produced by `yarn pack`
            publishOptions,
          ]
            .filter(Boolean)
            .join(' ')

          console.info(`Publishing ${name}: ${publishCommand}`)

          await spawnify(publishCommand, {
            cwd: tmpDir,
          }).catch((err) => {
            console.error(err)
            process.exit(1)
          })
        },
        {
          concurrency: 15,
        }
      )

      console.info(`✅ Published\n`)
    }

    if (!skipFinish) {
      // then git tag, commit, push
      if (!shouldFinish) {
        await spawnify(`yarn install`)
      }

      const tagPrefix = canary ? 'canary' : 'v'
      const gitTag = `${tagPrefix}${version}`

      if (!shouldFinish) {
        // longer sleep since npm was missing some deps
        await sleep(10 * 1000)
      }

      if (!canary && !skipStarters) {
        await spawnify(`yarn upgrade:starters`)
      }

      await finishAndCommit()

      async function finishAndCommit(cwd = process.cwd()) {
        if (!rePublish || reRun || shouldFinish) {
          await spawnify(`git add -A`, { cwd })
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

run()
