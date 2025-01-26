import * as proc from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import path from 'node:path'
import fs, { writeJSON, ensureDir } from 'fs-extra'
import pMap from 'p-map'
import prompts from 'prompts'

import { spawnify } from './spawnify'

// avoid emitter error
process.setMaxListeners(0)

// --resume would be cool here where it stores the last failed step somewhere and tries resuming

const exec = promisify(proc.exec)
export const spawn = proc.spawn

// for failed publishes that need to re-run
const confirmFinalPublish = process.argv.includes('--confirm-final-publish')
const reRun = process.argv.includes('--rerun')
const rePublish = reRun || process.argv.includes('--republish')
const finish = process.argv.includes('--finish')
const skipFinish = process.argv.includes('--skip-finish')

const skipStarters = process.argv.includes('--skip-starters')
const canary = process.argv.includes('--canary')
const skipVersion = finish || rePublish || process.argv.includes('--skip-version')
const shouldPatch = process.argv.includes('--patch')
const dirty = finish || process.argv.includes('--dirty')
const skipPublish = process.argv.includes('--skip-publish')
const skipTest =
  finish ||
  rePublish ||
  process.argv.includes('--skip-test') ||
  process.argv.includes('--skip-tests')
const skipBuild = finish || rePublish || process.argv.includes('--skip-build')
const dryRun = process.argv.includes('--dry-run')
const tamaguiGitUser = process.argv.includes('--tamagui-git-user')
const isCI = finish || process.argv.includes('--ci')

const curVersion = fs.readJSONSync('./code/ui/tamagui/package.json').version

const nextVersion = (() => {
  if (canary) {
    return `${curVersion.replace(/(-\d+)+$/, '')}-${Date.now()}`
  }

  if (rePublish) {
    return curVersion
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
  console.info(`Re-publishing ${curVersion}`)
}

async function run() {
  try {
    let version = curVersion

    // ensure we are up to date
    // ensure we are on main
    if (!canary) {
      if ((await exec(`git rev-parse --abbrev-ref HEAD`)).stdout.trim() !== 'main') {
        throw new Error(`Not on main`)
      }
      if (!dirty && !rePublish && !finish) {
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

    if (!finish) {
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
    if (tamaguiGitUser) {
      await spawnify(`git config --global user.name 'Tamagui'`)
      await spawnify(`git config --global user.email 'tamagui@users.noreply.github.com`)
    }

    if (!finish) {
      const answer =
        isCI || skipVersion
          ? { version: nextVersion }
          : await prompts({
              type: 'text',
              name: 'version',
              message: 'Version?',
              initial: nextVersion,
            })

      version = answer.version
      console.info('Next:', version, '\n')
    }

    console.info('install and build')

    if (!rePublish && !finish) {
      await spawnify(`yarn install`)
    }

    if (!skipBuild && !finish) {
      // lets do a full clean and build:force, to ensure we dont have weird cached or leftover files
      await spawnify(`yarn build:force`)
      await checkDistDirs()
    }

    if (!finish) {
      console.info('run checks')
      if (!skipTest) {
        await spawnify(`yarn test`)
      }
    }

    if (!dirty && !dryRun && !rePublish) {
      const out = await exec(`git status --porcelain`)
      if (out.stdout) {
        throw new Error(`Has unsaved git changes: ${out.stdout}`)
      }
    }

    if (!skipVersion && !finish) {
      await Promise.all(
        allPackageJsons.map(async ({ json, path }) => {
          const next = { ...json }

          next.version = version

          for (const field of [
            'dependencies',
            'devDependencies',
            'optionalDependencies',
            'peerDependencies',
          ]) {
            const nextDeps = next[field]
            if (!nextDeps) continue
            for (const depName in nextDeps) {
              if (allPackageJsons.some((p) => p.name === depName)) {
                nextDeps[depName] = version
              }
            }
          }

          await writeJSON(path, next, { spaces: 2 })
        })
      )
    }

    if (!finish && dryRun) {
      console.info(`Dry run, exiting before publish`)
      return
    }

    if (!finish && !rePublish) {
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

    if (!finish && !skipPublish) {
      const tmpDir = `/tmp/tamagui-publish`
      await ensureDir(tmpDir)

      // if all successful, re-tag as latest
      await pMap(
        packageJsons,
        async ({ name, cwd }) => {
          const publishOptions = [canary && `--tag canary`].filter(Boolean).join(' ')

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
          }).catch((err) => console.error(err))
        },
        {
          concurrency: 15,
        }
      )

      console.info(`✅ Published\n`)
    }

    if (!skipFinish) {
      // then git tag, commit, push
      if (!finish) {
        await spawnify(`yarn install`)
      }

      const tagPrefix = canary ? 'canary' : 'v'
      const gitTag = `${tagPrefix}${version}`

      if (!finish) {
        // longer sleep since npm was missing some deps
        await sleep(10 * 1000)
      }

      if (!canary && !skipStarters) {
        await spawnify(`yarn upgrade:starters`)
        const starterFreeDir = join(process.cwd(), '../starter-free')
        // Run yarn test in starter-free directory
        await spawnify(`yarn test`, { cwd: starterFreeDir })
        await finishAndCommit(starterFreeDir)
      }

      await finishAndCommit()

      async function finishAndCommit(cwd = process.cwd()) {
        if (!rePublish || reRun || finish) {
          await spawnify(`git add -A`, { cwd })
          await spawnify(`git commit -m ${gitTag}`, { cwd })
          if (!canary) {
            await spawnify(`git tag ${gitTag}`, { cwd })
          }

          if (!dirty) {
            // pull once more before pushing so if there was a push in interim we get it
            await spawnify(`git pull --rebase origin HEAD`, { cwd })
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
