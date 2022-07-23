const util = require('node:util')
const spawn = require('node:child_process').spawn
const exec = util.promisify(require('node:child_process').exec)
const prompts = require('prompts')
const fs = require('fs-extra')
const curVersion = fs.readJSONSync('./packages/tamagui/package.json').version
const _ = require('lodash')
const path = require('path')
const nextVersion = `1.0.1-beta.${+curVersion.split('.')[3] + 1}`

const skipVersion = process.argv.includes('--skip-version')
const skipPublish = process.argv.includes('--skip-publish')
const isCI = process.argv.includes('--ci')

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

      console.log('Run build & fix')

      await Promise.all([
        //
        spawnify(`yarn install`),
        exec(`yarn build`),
        exec(`yarn fix`),
      ])

      console.log('checking no git changes...')
      const out = await exec(`git status --porcelain`)
      if (out.stdout) {
        throw new Error(`Has unsaved git changes: ${out.stdout}`)
      }

      await spawnify(
        `yarn lerna version ${version} --ignore-changes --ignore-scripts --yes --force-publish --no-push`
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
      ).filter((x) => !x.json.private)

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
      for (const chunk of _.chunk(packageJsons, 8)) {
        await Promise.all(
          chunk.map(async ({ name, cwd }) => {
            console.log(`Release ${name}`)
            await spawnify(`npm dist-tag remove ${name}@${version} prepub`, {
              cwd,
            })
            await spawnify(`npm dist-tag add ${name}@${version} latest`, {
              cwd,
            })
          })
        )
      }
      console.log(`✅ Published\n`)

      // then push git
      await spawnify(`git add -A`)
      await spawnify(`git commit --amend --no-edit`)
      await spawnify(`git push origin v${version}`)
      await spawnify(`git push origin head`)
      console.log(`✅ Pushed and versioned\n`)
    }
  } catch (err) {
    console.log('\nError:\n', err)
    process.exit(1)
  }
}

run()
