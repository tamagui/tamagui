import { execSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join } from 'node:path'
import chalk from 'chalk'
import { copy, ensureDir, pathExists, remove } from 'fs-extra'
import { rimraf } from 'rimraf'
import { $, cd } from 'zx'
import type { templates } from '../templates'

const open = require('opener')

const exec = (cmd: string, options?: Parameters<typeof execSync>[1]) => {
  return execSync(cmd, {
    stdio: process.env.DEBUG ? 'inherit' : 'ignore',
    ...options,
  })
}

const tamaguiDir = join(homedir(), '.tamagui-repo-cache')
let targetGitDir = ''

export const cloneStarter = async (
  template: (typeof templates)[number],
  resolvedProjectPath: string,
  projectName: string
) => {
  targetGitDir = join(tamaguiDir, 'tamagui', template.repo.url.split('/').at(-1)!)

  console.info()
  await setupTamaguiDotDir(template)
  const starterDir = join(targetGitDir, ...template.repo.dir)
  console.info()
  console.info(
    `Copying starter from ${starterDir} into ${chalk.blueBright(projectName)}...`
  )
  console.info()

  // if (!(await pathExists(starterDir))) {
  //   console.error(`Missing template for ${template.value} in ${starterDir}`)
  //   process.exit(1)
  // }
  await copy(starterDir, resolvedProjectPath)
  await rimraf(`${resolvedProjectPath}/.git`)

  console.info(chalk.green(`${projectName} created!`))
  console.info()
}

async function setupTamaguiDotDir(template: (typeof templates)[number], isRetry = false) {
  console.info(`Setting up ${chalk.blueBright(targetGitDir)}...`)

  if (process.env.GITHUB_HEAD_REF) {
    try {
      await $`cd ${targetGitDir} && git switch -c ${process.env.GITHUB_HEAD_REF}`
    } catch {
      // re-tries branch already exists
    }
  }

  const branch = template.repo.branch

  await ensureDir(tamaguiDir)
  cd(tamaguiDir)

  const isInSubDir = template.repo.dir.length > 0
  const sourceGitRepo = template.repo.url
  const sourceGitRepoSshFallback = template.repo.sshFallback

  if (isRetry) {
    if (!(await pathExists(targetGitDir))) {
      exec(`git clone --branch ${branch} ${sourceGitRepo} "${targetGitDir}"`)
    }
  } else {
    if (!(await pathExists(targetGitDir))) {
      console.info(`Cloning tamagui base directory`)
      console.info()

      const cmd = `git clone --branch ${branch} ${
        isInSubDir ? '--depth 1 --sparse --filter=blob:none ' : ''
      }${sourceGitRepo} "${targetGitDir}"`

      try {
        try {
          console.info(`$ ${cmd}`)
          console.info()
          exec(cmd)
        } catch (error) {
          if (cmd.includes('https://')) {
            console.info(`https failed - trying with ssh now...`)
            const sshCmd = cmd.replace(sourceGitRepo, sourceGitRepoSshFallback)
            console.info(`$ ${sshCmd}`)
            console.info()
            exec(sshCmd)
          } else {
            throw error
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          if (template.value === 'takeout-starter') {
            if ((error as any)?.stderr?.includes('Repository not found')) {
              console.info(
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
        console.error(
          `Corrupt Tamagui directory, please delete ${targetGitDir} and re-run`
        )
        process.exit(1)
      }
    }

    if (isInSubDir) {
      const cmd = `git sparse-checkout set code/starters`
      exec(cmd, { cwd: targetGitDir })
      console.info()
    }
  }

  try {
    const remoteName = getDefaultRemoteName()
    if (await pathExists(join(targetGitDir, '.git'))) {
      const cmd2 = `git pull --rebase --allow-unrelated-histories --depth 1 ${remoteName} ${branch}`

      // this can fail with "could not parse commit" but if you re-run it generally works
      try {
        exec(cmd2, {
          cwd: targetGitDir,
        })
      } catch {
        // so lets just retry on first failure at least
        exec(cmd2, {
          cwd: targetGitDir,
        })
      }
      console.info()
    } else {
      console.warn(
        `Warning: ${targetGitDir} is not a git repository. Skipping pull operation.`
      )
    }
  } catch (err: any) {
    console.info(
      `Error updating: ${err.message} ${err.stack}  ${isRetry ? '' : '\n\nretrying...'}`
    )
    if (isRetry) {
      console.info(
        `Please file an issue: https://github.com/tamagui/tamagui/issues/new?assignees=&labels=&template=bug_report.md&title=`
      )
      process.exit(1)
    }
    await remove(targetGitDir)
    await setupTamaguiDotDir(template, true)
  }
}

// Get the default remote name
const getDefaultRemoteName = () => {
  try {
    if (!pathExists(join(targetGitDir, '.git'))) {
      console.warn(
        'Warning: Not in a git repository. Using default remote name "origin".'
      )
      return 'origin'
    }
    const remotes = execSync('git remote', { cwd: targetGitDir })
      .toString()
      .trim()
      .split('\n')
    return remotes[0] || 'origin'
  } catch (error) {
    console.warn('Error getting default remote name:', error)
    console.warn('Using default remote name "origin".')
    return 'origin'
  }
}
