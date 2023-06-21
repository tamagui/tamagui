import { execSync } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'

import chalk from 'chalk'
import { copy, ensureDir, pathExists, remove } from 'fs-extra'
import { $, cd } from 'zx'

import { IS_TEST } from '../constants'
import { templates } from '../templates'

const open = require('opn')

const home = homedir()
const tamaguiDir = join(home, '.tamagui')
let targetGitDir = ''

export const cloneStarter = async (
  template: (typeof templates)[number],
  resolvedProjectPath: string,
  projectName: string
) => {
  targetGitDir = IS_TEST
    ? join(tamaguiDir, 'tamagui-test', template.repo.url.split('/').at(-1)!)
    : join(tamaguiDir, 'tamagui', template.repo.url.split('/').at(-1)!)

  console.log()
  await setupTamaguiDotDir(template)
  const starterDir = join(targetGitDir, ...template.repo.dir)
  console.log()
  console.log(
    `Copying starter from ${starterDir} into ${chalk.blueBright(projectName)}...`
  )
  console.log()

  // if (!(await pathExists(starterDir))) {
  //   console.error(`Missing template for ${template.value} in ${starterDir}`)
  //   process.exit(1)
  // }
  await copy(starterDir, resolvedProjectPath)
  execSync(`rm -rf ${resolvedProjectPath}/.git`)

  console.log(chalk.green(`${projectName} created!`))
  console.log()
}

async function setupTamaguiDotDir(template: (typeof templates)[number], isRetry = false) {
  const repoRoot = join(__dirname, '..', '..', '..')

  console.log(`Setting up ${chalk.blueBright(targetGitDir)}...`)

  cd(repoRoot)

  if (process.env.GITHUB_HEAD_REF) {
    try {
      await $`git switch -c ${process.env.GITHUB_HEAD_REF}`
    } catch {
      // re-tries branch already exists
    }
  }

  const branch = IS_TEST
    ? // use current branch
      (await $`git rev-parse --abbrev-ref HEAD`).stdout.trim()
    : template.repo.branch

  // setup tests for CI
  if (IS_TEST) {
    console.log(`Test mode: cleaning old tamagui git dir`)
    // always clean for test
    await remove(targetGitDir)
    if (!(await pathExists(join(repoRoot, '.git')))) {
      throw new Error(`Not in a git folder`)
    }
  }

  await ensureDir(tamaguiDir)
  cd(tamaguiDir)

  const isInSubDir = template.repo.dir.length > 0

  if (!(await pathExists(targetGitDir))) {
    console.log(`Cloning tamagui base directory`)
    console.log()

    const sourceGitRepo = template.repo.url

    const cmd = `git clone --branch ${branch} ${
      isInSubDir ? '--depth 1 --sparse --filter=blob:none ' : ''
    }${sourceGitRepo} ${targetGitDir}`
    console.log(`$ ${cmd}`)
    console.log()

    try {
      execSync(cmd)
    } catch (error) {
      if (error instanceof Error) {
        if (template.value === 'takeout-starter') {
          if ((error as any)?.stderr.includes('Repository not found')) {
            console.log(
              chalk.yellow(
                `You don't have access to this starter. Check 🥡 Tamagui Takeout (https://tamagui.dev/takeout) for more info.`
              )
            )
            open('https://tamagui.dev/takeout')
            process.exit(0)
          }
        }
      }
      throw error
    }
  } else {
    if (!(await pathExists(join(targetGitDir, '.git')))) {
      console.error(`Corrupt Tamagui directory, please delete ${targetGitDir} and re-run`)
      process.exit(1)
    }
  }
  console.log()
  console.log(`Updating tamagui starters repo`)
  console.log()

  if (isInSubDir) {
    const cmd = `git sparse-checkout set ${template.repo.dir[0] ?? '.'}`
    execSync(cmd, { cwd: targetGitDir })
    console.log()
    console.log(`$ ${cmd}`)
  }
  try {
    const cmd2 = `git pull --rebase --allow-unrelated-histories --depth 1 origin ${branch}`
    execSync(cmd2, {
      cwd: targetGitDir,
    })
    console.log()
    console.log(`$ ${cmd2}`)
  } catch (err: any) {
    console.log(
      `Error updating: ${err.message} ${
        isRetry ? `failing.\n${err.stack}` : 'trying from fresh.'
      }`
    )
    if (isRetry) {
      console.log(
        `Please file an issue: https://github.com/tamagui/tamagui/issues/new?assignees=&labels=&template=bug_report.md&title=`
      )
      process.exit(1)
    }
    await remove(targetGitDir)
    await setupTamaguiDotDir(template, true)
  }
}
