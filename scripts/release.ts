/* eslint-disable no-console */
import * as proc from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import path from 'path'

import fs from 'fs-extra'
import _ from 'lodash'
import prompts from 'prompts'

import { spawnify } from './spawnify'

// --resume would be cool here where it stores the last failed step somewhere and tries resuming

const exec = promisify(proc.exec)
export const spawn = proc.spawn
const skipVersion = process.argv.includes('--skip-version')
const patch = process.argv.includes('--patch')
const dirty = process.argv.includes('--dirty')
const skipPublish = process.argv.includes('--skip-publish')
const skipTest = process.argv.includes('--skip-test')
const tamaguiGitUser = process.argv.includes('--tamagui-git-user')
const isCI = process.argv.includes('--ci')

const curVersion = fs.readJSONSync('./packages/tamagui/package.json').version
const plusVersion = skipVersion ? 0 : 1
const curPatch = +curVersion.split('.')[4] || 0
const patchVersion = patch ? `.${curPatch + plusVersion}` : ''
const curRC = +curVersion.split('.')[3] || 0
const rcVersion = curRC + (!patch ? plusVersion : 0)
const nextVersionPostfix = `rc.${rcVersion}${patchVersion}`
const nextVersion = `1.0.1-${nextVersionPostfix}`

if (!skipVersion) {
  console.log('Publishing version:', nextVersion, '\n')
}

async function run() {
  const workspaces = (await exec(`yarn workspaces list --json`)).stdout.trim().split('\n')
  const packagePaths = workspaces.map((p) => JSON.parse(p)) as {
    name: string
    location: string
  }[]

  const packageJsons = (
    await Promise.all(
      packagePaths
        .filter((i) => i.location !== '.' && !i.name.startsWith('@takeout'))
        .map(async ({ name, location }) => {
          const cwd = path.join(process.cwd(), location)
          return {
            name,
            cwd,
            json: await fs.readJSON(path.join(cwd, 'package.json')),
          }
        })
    )
  )
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

    await Promise.all([
      //
      spawnify(`yarn install`),
      checkDistDirs(),
      spawnify(`yarn build`),
    ])

    console.log('run checks')

    if (!skipTest) {
      await spawnify(`yarn fix`)
      await spawnify(`yarn lint`)
      await spawnify(`yarn check`)
      await spawnify(`yarn test`)
    }

    if (!dirty) {
      const out = await exec(`git status --porcelain`)
      if (out.stdout) {
        throw new Error(`Has unsaved git changes: ${out.stdout}`)
      }
    }

    if (!skipVersion) {
      await spawnify(
        `yarn lerna version ${version} --ignore-changes --ignore-scripts --yes --no-push --no-git-tag-version`
      )
    }

    console.log((await exec(`git diff`)).stdout)

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

    const erroredPackages: { name: string }[] = []

    if (!skipPublish) {
      // publish with tag
      for (const chunk of _.chunk(packageJsons, 4)) {
        await Promise.all(
          chunk.map(async (pkg) => {
            const { cwd, name } = pkg
            console.log(`Publish ${name}`)

            // check if already published first as its way faster for re-runs
            try {
              const out = await spawnify(`npm view ${name} versions --json`, {
                avoidLog: true,
              })
              const allVersions = JSON.parse(out.trim())
              const latest = allVersions[allVersions.length - 1]

              if (latest === nextVersion) {
                console.log(`Already published, skipping`)
                return
              }
            } catch (err) {
              if (`${err}`.includes(`404`)) {
                // fails if never published before, ok
              } else {
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
              console.log(`Error publishing!`, `${err.message}`)
              erroredPackages.push(pkg)
            }
          })
        )
      }

      if (erroredPackages.length) {
        console.warn(
          `❌ Error pre-publishing packages:\n`,
          erroredPackages.map((x) => x.name).join('\n')
        )
        return
      }

      console.log(`✅ Published under dist-tag "prepub"\n`)

      // if all successful, re-tag as latest
      for (const chunk of _.chunk(packageJsons, 20)) {
        await Promise.all(
          chunk.map(async ({ name, cwd }) => {
            console.log(`Release ${name}`)
            try {
              await spawnify(`npm dist-tag remove ${name}@${version} prepub`, {
                cwd,
              })
              await spawnify(`npm dist-tag add ${name}@${version} latest`, {
                cwd,
              })
            } catch (err) {
              // @ts-ignore
              console.error(`Package ${name} failed with error:`, err.message, err.stack)
            }
          })
        )
      }

      console.log(`✅ Published\n`)

      // then git tag, commit, push
      await spawnify(`yarn install`)
      await spawnify(`yarn fix`)
      await spawnify(`git add -A`)
      await spawnify(`git commit -m v${version}`)
      await spawnify(`git tag v${version}`)
      await spawnify(`git push origin head`)
      await spawnify(`git push origin v${version}`)
      console.log(`✅ Pushed and versioned\n`)

      const seconds = 5
      console.log(
        `Update starters to v${version} in (${seconds}) seconds (give time to propogate)...`
      )
      await new Promise((res) => setTimeout(res, 5 * 1000))
      await spawnify(`yarn upgrade:starters`)
      await spawnify(`yarn fix`)
      await spawnify(`git commit -am update-starters-v${version}`)
      await spawnify(`git push origin head`)
    } else {
      console.log(`Skipped publish`)
    }
  } catch (err) {
    console.log('\nError:\n', err)
    process.exit(1)
  }
}

run()
