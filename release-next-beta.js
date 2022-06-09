const util = require('node:util')
const spawn = require('node:child_process').spawn
const exec = util.promisify(require('node:child_process').exec)
const prompts = require('prompts')
const fs = require('fs-extra')
const curVersion = fs.readJSONSync('./packages/tamagui/package.json').version
const path = require('path')
const nextVersion = `1.0.1-beta.${+curVersion.split('.')[3] + 1}`

const skipVersion = process.argv.includes('--skip-version')
const skipPublish = process.argv.includes('--skip-publish')

const spawnify = async (cmd, opts) => {
  console.log('>', cmd)
  const [head, ...rest] = cmd.split(' ')
  return new Promise((res, rej) => {
    const child = spawn(head, rest, { stdio: ['inherit', 'pipe', 'pipe'], ...opts })
    let outStr = []
    let errStr = []
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
      const answer = await prompts({
        type: 'text',
        name: 'version',
        message: 'Version?',
        initial: nextVersion,
      })

      version = answer.version

      await exec(`yarn build`)

      console.log('checking no git changes...')
      const out = await exec(`git status --porcelain`)
      if (out.stdout) {
        throw new Error(`Has unsaved git changes: ${out.stdout}`)
      }

      await spawnify(
        `yarn lerna version ${version} --ignore-changes --ignore-scripts --yes --force-publish --no-push`
      )

      // lerna messes up yarn.lock and always needs a second yarn install + add + push
      await spawnify(`yarn install`)
      await spawnify(`git add -A`)
      await spawnify(`git commit --amend --no-edit`)

      // then push tag
      await spawnify(`git push origin v${version}`)
    }

    console.log((await exec(`git diff`)).stdout)

    const { confirmed } = await prompts({
      type: 'confirm',
      name: 'confirmed',
      message: 'Ready to publish?',
    })

    if (!confirmed) {
      process.exit(0)
    }

    if (!skipPublish) {
      const packages = (await exec(`yarn workspaces list --json`)).stdout

      for (const pkjson of packages.split('\n')) {
        if (!pkjson) continue
        const { location, name } = JSON.parse(pkjson)
        if (location === '.') {
          continue
        }
        console.log(`\nPublishing ${name}...`)
        const cwd = path.join(__dirname, location)
        const pkg = await fs.readJSON(path.join(cwd, 'package.json'))
        if (pkg.private) {
          console.log('Private, skipping', name)
          continue
        }
        try {
          await spawnify(`npm publish`, {
            cwd,
          })
        } catch (err) {
          if (err.includes(`403`)) {
            console.log('Already published, skipping')
          } else {
            console.log('err', err)
            process.exit(0)
          }
        }
      }

      console.log(`✅ Published`)
    }
  } catch (err) {
    console.log('\nError:\n', err)
  }
}

run()
