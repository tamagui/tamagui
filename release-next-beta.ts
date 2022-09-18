/* eslint-disable no-console */
import * as proc from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import path from 'path'

import fs from 'fs-extra'
import _ from 'lodash'
import prompts from 'prompts'

const exec = promisify(proc.exec)
const spawn = proc.spawn

const curVersion = fs.readJSONSync('./packages/tamagui/package.json').version
const nextVersion = `1.0.1-beta.${+curVersion.split('.')[3] + 1}`

const skipVersion = process.argv.includes('--skip-version')
const skipPublish = process.argv.includes('--skip-publish')
const isCI = process.argv.includes('--ci')

// could add only if changed checks: git diff --quiet HEAD HEAD~3 -- ./packages/core
// but at that point would be nicer to get a whole setup for this.. lerna or whatever

const spawnify = async (cmd: string, opts?: any) => {
  console.log('>', cmd)
  const [head, ...rest] = cmd.split(' ')
  return new Promise((res, rej) => {
    const child = spawn(head, rest, { stdio: ['inherit', 'pipe', 'pipe'], ...opts })
    const outStr = []
    const errStr = []
    child.stdout.on('data', (data) => {
      outStr.push(data.toString())
    })
    child.stderr.on('data', (data) => {
      errStr.push(data.toString())
    })
    child.on('error', (err) => {
      rej(err)
    })
    child.on('close', (code) => {
      if (code === 0) {
        res(outStr.join('\n'))
      } else {
        rej(errStr.join('\n'))
      }
    })
  })
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
          const cwd = path.join(__dirname, location)
          return {
            name,
            cwd,
            json: await fs.readJSON(path.join(cwd, 'package.json')),
          }
        })
    )
  ).filter((x) => {
    return !x.json.private
  })

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
    let version = curVersion

    if (!skipVersion) {
      const answer = isCI
        ? { version: nextVersion }
        : await prompts({
            type: 'text',
            name: 'version',
            message: 'Version?',
            initial: nextVersion,
          })

      version = answer.version

      console.log('running checks')

      await Promise.all([
        //
        spawnify(`yarn install`),
        checkDistDirs(),
        spawnify(`yarn build`),
        spawnify(`yarn lint`),
        spawnify(`yarn fix`),
      ])

      if (!process.env.SKIP_GIT_CLEAN_CHECK) {
        console.log('checking no git changes...')
        const out = await exec(`git status --porcelain`)
        if (out.stdout) {
          throw new Error(`Has unsaved git changes: ${out.stdout}`)
        }
      }

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

    if (!skipPublish) {
      // publish with tag
      for (const chunk of _.chunk(packageJsons, 6)) {
        await Promise.all(
          chunk.map(async ({ cwd, name }) => {
            console.log(`Publish ${name}`)
            try {
              await spawnify(`npm publish --tag prepub`, {
                cwd,
              })
            } catch (err) {
              // @ts-ignore
              if (err.includes(`403`)) {
                console.log('Already published, skipping')
                return
              }
              throw err
            }
          })
        )
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
      await spawnify(`git add -A`)
      await spawnify(`git commit -m v${version}`)
      await spawnify(`git tag v${version}`)
      await spawnify(`git push origin head`)
      await spawnify(`git push origin v${version}`)
      console.log(`✅ Pushed and versioned\n`)

      console.log(`Update starters to v${version}...`)
      await spawnify(`yarn upgrade starters`)
      await spawnify(`git commit -am "Update starters to v${version}"`)
      await spawnify(`git push origin head`)
    }
  } catch (err) {
    console.log('\nError:\n', err)
    process.exit(1)
  }
}

run()
