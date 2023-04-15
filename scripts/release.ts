/* eslint-disable no-console */
import * as proc from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import path from 'path'

import fs, { readJSON, writeJSON } from 'fs-extra'
import _ from 'lodash'
import prompts from 'prompts'

import { spawnify } from './spawnify'

// avoid emitter error
process.setMaxListeners(0)

// --resume would be cool here where it stores the last failed step somewhere and tries resuming

const exec = promisify(proc.exec)
export const spawn = proc.spawn

// for failed publishes that need to re-run
const rePublish = process.argv.includes('--republish')

const skipVersion = rePublish || process.argv.includes('--skip-version')
const patch = process.argv.includes('--patch')
const dirty = process.argv.includes('--dirty')
const skipPublish = process.argv.includes('--skip-publish')
const skipTest =
  process.argv.includes('--skip-test') || process.argv.includes('--skip-tests')
const skipBuild = process.argv.includes('--skip-build')
const dryRun = process.argv.includes('--dry-run')
const tamaguiGitUser = process.argv.includes('--tamagui-git-user')
const isCI = process.argv.includes('--ci')

const curVersion = fs.readJSONSync('./packages/tamagui/package.json').version
const plusVersion = skipVersion ? 0 : 1
const curPatch = +curVersion.split('.')[2] || 0
const patchVersion = patch ? curPatch + plusVersion : 0
const curMinor = +curVersion.split('.')[1] || 0
const minorVersion = curMinor + (!patch ? plusVersion : 0)
const nextVersion = `1.${minorVersion}.${patchVersion}`

if (!skipVersion) {
  console.log('Publishing version:', nextVersion, '\n')
} else {
  console.log(`Re-publishing ${curVersion}`)
}

async function run() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  const allPackageJsons = await Promise.all(
    packagePaths
      .filter((i) => i.location !== '.' && !i.name.startsWith('@takeout'))
      .map(async ({ name, location }) => {
        const cwd = path.join(process.cwd(), location)
        return {
          name,
          cwd,
          json: await fs.readJSON(path.join(cwd, 'package.json')),
          path: path.join(cwd, 'package.json'),
          directory: location,
        }
      })
  )

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

  console.log(`Publishing in order:\n\n${packageJsons.map((x) => x.name).join('\n')}`)

  async function checkDistDirs() {
    await Promise.all(
      packageJsons.map(async ({ cwd, json }) => {
        const distDir = join(cwd, 'dist')
        if (!json.scripts || json.scripts.build === 'true') {
          return
        }
        if (!(await fs.pathExists(distDir))) {
          console.warn('no dist dir!', distDir)
          process.exit(1)
        }
      })
    )
  }

  try {
    if (tamaguiGitUser) {
      await spawnify(`git config --global user.name 'Tamagui'`)
      await spawnify(`git config --global user.email 'tamagui@users.noreply.github.com`)
    }

    let version = curVersion

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

    console.log('install and build')

    await spawnify(`yarn install`)

    if (!skipBuild) {
      await spawnify(`yarn build`)
      await checkDistDirs()
    }

    console.log('run checks')

    if (!skipTest) {
      await spawnify(`yarn fix`)
      await spawnify(`yarn lint`)
      await spawnify(`yarn check`)
      await spawnify(`yarn test`)
    }

    if (!dirty && !dryRun) {
      const out = await exec(`git status --porcelain`)
      if (out.stdout) {
        throw new Error(`Has unsaved git changes: ${out.stdout}`)
      }
    }

    if (!skipVersion) {
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
              if (packageJsons.some((p) => p.name === depName)) {
                nextDeps[depName] = version
              }
            }
          }

          await writeJSON(path, next, { spaces: 2 })
        })
      )
    }

    if (dryRun) {
      console.log(`Dry run, exiting before publish`)
      return
    }

    await spawnify(`git diff`)

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

    if (!skipPublish && !rePublish) {
      const erroredPackages: { name: string }[] = []
      // publish with tag
      for (const chunk of _.chunk(packageJsons, 6)) {
        await Promise.all(
          chunk.map(async (pkg) => {
            const { cwd, name } = pkg
            console.log(`Publish ${name}`)

            // check if already published first as its way faster for re-runs
            let versionsOut = ''
            try {
              versionsOut = await spawnify(`npm view ${name} versions --json`, {
                avoidLog: true,
              })
              const allVersions = JSON.parse(versionsOut.trim().replaceAll(`\n`, ''))
              const latest = allVersions[allVersions.length - 1]

              if (latest === nextVersion) {
                console.log(`Already published, skipping`)
                return
              }
            } catch (err) {
              if (`${err}`.includes(`404`)) {
                // fails if never published before, ok
              } else {
                if (`${err}`.includes(`Unexpected token`)) {
                  console.log(`Bad JSON? ${versionsOut}`)
                }
                throw err
              }
            }

            try {
              await spawnify(`npm publish --tag prepub`, {
                cwd,
                avoidLog: true,
              })
              console.log(` 📢 pre-published ${name}`)
            } catch (err: any) {
              // @ts-ignore
              if (err.includes(`403`)) {
                console.log('Already published, skipping')
                return
              }
              console.log(`Error publishing!`, `${err}`)
              erroredPackages.push(pkg)
            }
          })
        )

        if (erroredPackages.length) {
          console.warn(
            `❌ Error pre-publishing packages:\n`,
            erroredPackages.map((x) => x.name).join('\n')
          )
          return
        }

        console.log(`✅ Published under dist-tag "prepub"\n`)
      }
    }

    await (async () => {
      const seconds = 10
      console.log(`Waiting ${seconds} seconds (npm giving us too many request errors)...`)
      await new Promise((res) => setTimeout(res, seconds * 1000))
    })()

    if (rePublish) {
      // if all successful, re-tag as latest
      for (const chunk of _.chunk(packageJsons, 5)) {
        await Promise.all(
          chunk.map(async ({ name, cwd }) => {
            console.log(`Release ${name}`)
            try {
              await spawnify(`npm publish`, {
                cwd,
              })
            } catch (err) {
              // @ts-ignore
              console.error(`Publish fail ${name}:`, err.message, err.stack)
            }
          })
        )
      }
    } else {
      // if all successful, re-tag as latest
      for (const chunk of _.chunk(packageJsons, 5)) {
        await Promise.all(
          chunk.map(async ({ name, cwd }) => {
            console.log(`Release ${name}`)
            try {
              await spawnify(`npm dist-tag remove ${name}@${version} prepub`, {
                cwd,
              })
            } catch (err) {
              // ok
              // @ts-ignore
              console.error(`Dist-tag prepub remove fail ${name}:`)
            }
            try {
              await spawnify(`npm dist-tag add ${name}@${version} latest`, {
                cwd,
              })
            } catch (err) {
              // @ts-ignore
              console.error(`Dist-tag latest fail ${name}:`, err.message, err.stack)
            }
          })
        )
      }

      // adding in a bit of delay to avoid too many requests errors
      await new Promise((res) => setTimeout(res, 2000))
    }

    console.log(`✅ Published\n`)

    // then git tag, commit, push
    await spawnify(`yarn fix`)
    await spawnify(`yarn install`)

    await (async () => {
      const seconds = 10
      console.log(
        `Update starters to v${version} in (${seconds}) seconds (give time to propogate)...`
      )
      await new Promise((res) => setTimeout(res, seconds * 1000))
    })()

    await spawnify(`yarn upgrade:starters`)
    await spawnify(`yarn fix`)
    await spawnify(`yarn fix`, {
      cwd: join(process.cwd(), 'starters/next-expo-solito'),
    })

    if (!rePublish) {
      await spawnify(`git add -A`)
      await spawnify(`git commit -m v${version}`)
      await spawnify(`git tag v${version}`)
      await spawnify(`git push origin head`)
      await spawnify(`git push origin v${version}`)
      console.log(`✅ Pushed and versioned\n`)
    }
  } catch (err) {
    console.log('\nError:\n', err)
    process.exit(1)
  }
}

run()
