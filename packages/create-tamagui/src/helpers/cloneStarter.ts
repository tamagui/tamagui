import { execSync } from 'child_process'
import { homedir } from 'os'
import { join } from 'path'

import chalk from 'chalk'
import { copy, ensureDir, pathExists, remove } from 'fs-extra'
import { $, cd } from 'zx'

import { IS_TEST } from '../constants'
import { templates } from '../templates'

const home = homedir()
const tamaguiDir = join(home, '.tamagui')
let targetGitDir = ''

async function setupTamaguiDotDir(template: (typeof templates)[number], isRetry = false) {
  const repoRoot = join(__dirname, '..', '..', '..')

  console.log(`Setting up ${chalk.blueBright(tamaguiDir)}...`)

  cd(repoRoot)

  if (process.env.GITHUB_HEAD_REF) {
    try {
      await $`git switch -c ${process.env.GITHUB_HEAD_REF}`
    } catch {
      // re-tries branch already exists
    }
  }

  const branch =
    IS_TEST && template.type === 'included-in-monorepo'
      ? // use current branch
        (await $`git rev-parse --abbrev-ref HEAD`).stdout.trim()
      : template.repo.branch

  // setup tests for CI
  if (IS_TEST) {
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

    const sourceGitRepo = template.repo.url

    const cmd = `git clone --branch ${branch} ${
      isInSubDir ? '--depth 1 --sparse --filter=blob:none ' : ''
    }${sourceGitRepo} ${targetGitDir}`
    console.log(`$ ${cmd}`)
    execSync(cmd)
  } else {
    if (!(await pathExists(join(targetGitDir, '.git')))) {
      console.error(`Corrupt Tamagui directory, please delete ${targetGitDir} and re-run`)
      process.exit(1)
    }
  }

  console.log(`Updating tamagui starters repo`)
  if (isInSubDir) {
    const cmd = `git sparse-checkout set ${template.repo.dir[0] ?? '.'}`
    execSync(cmd, { cwd: targetGitDir })
    console.log(`$ ${cmd}`)
  }
  try {
    const cmd2 = `git pull --rebase --allow-unrelated-histories --depth 1 origin ${branch}`
    execSync(cmd2, {
      cwd: targetGitDir,
    })
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

export const cloneStarter = async (
  template: (typeof templates)[number],
  resolvedProjectPath: string,
  projectName: string
) => {
  targetGitDir = IS_TEST
    ? join(tamaguiDir, 'tamagui-test', template.repo.url.split('/').at(-1)!)
    : join(tamaguiDir, 'tamagui', template.repo.url.split('/').at(-1)!)

  await setupTamaguiDotDir(template)
  const starterDir = join(targetGitDir, ...template.repo.dir)

  console.log(
    `Copying starter from ${starterDir} into ${chalk.blueBright(projectName)}...`
  )
  // if (!(await pathExists(starterDir))) {
  //   console.error(`Missing template for ${template.value} in ${starterDir}`)
  //   process.exit(1)
  // }
  await copy(starterDir, resolvedProjectPath)

  console.log(chalk.green(`${projectName} created!`))
}
