#!/usr/bin/env node
/* eslint-disable no-console */

import { execSync } from 'child_process'
import fs from 'fs'
import { homedir } from 'os'
import path, { join } from 'path'
import { Stream } from 'stream'
import { promisify } from 'util'

// inspired by https://github.com/vercel/next.js/blob/0355e5f63f87db489f36db8d814958cb4c2b828b/packages/create-next-app/helpers/examples.ts#L71
import * as PackageManager from '@expo/package-manager'
import chalk from 'chalk'
import Commander from 'commander'
import { copy, ensureDir, pathExists, remove } from 'fs-extra'
import got from 'got'
import prompts from 'prompts'
import tar from 'tar'
import validateProjectName from 'validate-npm-package-name'
import { $, cd } from 'zx'

import packageJson from '../package.json'

const pipeline = promisify(Stream.pipeline)

let projectPath = ''

const IS_TEST = process.env.NODE_ENV === 'test'
if (IS_TEST) {
  console.log(`🧐 Running create-tamagui in test mode 🧐`)
}

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .action((name) => {
    projectPath = name
  })
  .option('--use-npm', `Explicitly tell the CLI to bootstrap the app using npm`)
  .option('--use-pnpm', `Explicitly tell the CLI to bootstrap the app using pnpm`)
  .option(
    `--template <template>, -t <template>`,
    'Currently, the only option is `next-expo-solito`, which is set by default.',
    'next-expo-solito'
  )
  .allowUnknownOption()
  .usage(
    `${chalk.green('<project-directory>')} [options]
  
Example usage:

${chalk.blueBright(`npx ${packageJson.name} next-expo`)}`
  )
  .parse(process.argv)

if (process.argv.includes('--version')) {
  console.log(packageJson.version)
  process.exit(0)
}

const packageManager = program.useNpm ? 'npm' : program.usePnpm ? 'pnpm' : 'yarn'
const DOWNLOAD_URL = 'https://codeload.github.com/tamagui/starters/tar.gz/main'

export function downloadAndExtractExample(
  root: string,
  name: string
): Promise<void | unknown> {
  if (name === '__internal-testing-retry') {
    throw new Error('This is an internal example for testing the CLI.')
  }
  return pipeline(
    got.stream(DOWNLOAD_URL),
    tar.extract({ cwd: root, strip: 2 }, [`starters-main/${name}`])
  )
}

async function run() {
  console.log(chalk.bold('Creating tamagui app...'))

  const gitVersionString = parseFloat(
    execSync(`git --version`).toString().replace(`git version `, '').trim()
  )
  if (gitVersionString < 2.27) {
    console.error(`\n\n ⚠️ Tamagui can't install: Git version must be >= 2.27\n\n`)
    process.exit(1)
  }

  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'Project name:',
      initial: 'myapp',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return 'Invalid project name: ' + validation.problems![0]
      },
    })

    if (typeof res.path === 'string') {
      projectPath = res.path.trim()
    }
  }

  if (!projectPath) {
    console.log()
    console.log('Please specify the project directory:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`)
    console.log()
    console.log('For example:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-tamagui-app')}`)
    console.log()
    console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`)
    process.exit(1)
  }

  const resolvedProjectPath = path.resolve(process.cwd(), projectPath)
  const projectName = path.basename(resolvedProjectPath)

  const { valid, problems } = validateNpmName(projectName)
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    )

    problems!.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`))
    process.exit(1)
  }

  if (fs.existsSync(resolvedProjectPath)) {
    console.log()
    console.log(
      chalk.red('🚨 [tamagui] error'),
      `You tried to make a project called ${chalk.underline(
        chalk.blueBright(projectName)
      )}, but a folder with that name already exists: ${chalk.blueBright(
        resolvedProjectPath
      )}

${chalk.bold(chalk.red(`Please pick a different project name 🥸`))}`
    )
    console.log()
    console.log()
    process.exit(1)
  }
  console.log()
  console.log(`Creating a new tamagui app ${chalk.blueBright(resolvedProjectPath)}...`)
  fs.mkdirSync(resolvedProjectPath)
  console.log(chalk.green(`${projectName} folder created.`))

  try {
    const home = homedir()
    const tamaguiDir = join(home, '.tamagui')
    const repoRoot = join(__dirname, '..', '..', '..')
    const targetGitDir = IS_TEST
      ? join(tamaguiDir, 'tamagui-test')
      : join(tamaguiDir, 'tamagui')

    async function setupTamaguiDotDir(isRetry = false) {
      console.log(`Setting up ${chalk.blueBright(tamaguiDir)}...`)

      cd(repoRoot)

      const branch =
        process.env.GITHUB_BASE_REF ??
        (IS_TEST
          ? // use current branch
            (await $`git rev-parse --abbrev-ref HEAD`).stdout.trim()
          : `master`)

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

      if (!(await pathExists(targetGitDir))) {
        console.log(`Cloning tamagui base directory`)

        const sourceGitRepo = IS_TEST
          ? `file://${repoRoot}`
          : `https://github.com/tamagui/tamagui.git`

        const cmd = `git clone --branch ${branch} --depth 1 --filter=blob:none --sparse ${sourceGitRepo} ${targetGitDir}`
        console.log(`$ ${cmd}`)
        execSync(cmd)
      } else {
        if (!(await pathExists(join(targetGitDir, '.git')))) {
          console.error(
            `Corrupt Tamagui directory, please delete ${targetGitDir} and re-run`
          )
          process.exit(1)
        }
      }

      console.log(`Updating tamagui starters repo`)
      const cmd = `git sparse-checkout set starters`
      execSync(cmd, { cwd: targetGitDir })
      console.log(`$ ${cmd}`)
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
        await setupTamaguiDotDir(true)
      }
    }

    await setupTamaguiDotDir()

    const starterDir = join(targetGitDir, 'starters', program.template)
    if (!(await pathExists(starterDir))) {
      console.error(`Missing template for ${program.template} in ${starterDir}`)
      process.exit(1)
    }

    console.log(
      `Copying starter from ${starterDir} into ${chalk.blueBright(projectName)}...`
    )
    await copy(starterDir, resolvedProjectPath)

    console.log(chalk.green(`${projectName} created!`))

    cd(resolvedProjectPath)

    function gitInit() {
      return $`git init`
    }

    if (IS_TEST) {
      await gitInit()
    } else {
      const res2 = await prompts({
        type: 'confirm',
        name: 'gitInit',
        message: 'Do you want to use git?',
        initial: true,
      })
      if (res2.gitInit) {
        await gitInit()
      }
    }
  } catch (e) {
    console.error(`[tamagui] Failed to copy example into ${resolvedProjectPath}\n\n`, e)
    process.exit(1)
  }

  console.log('Installing packages. This might take a couple of minutes.')
  console.log()
  const useYarn = packageManager === 'yarn'
  try {
    await installDependenciesAsync(resolvedProjectPath, packageManager)
  } catch (e: any) {
    console.error('[tamagui] error installing with ' + packageManager + '\n', e?.message)
    process.exit(1)
  }

  console.log(`${chalk.green('Success!')} Created ${projectName} at ${projectPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}web`))
  console.log('    Starts the development server for the Next.js site.')
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}native`))
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), projectName)
  console.log(`  ${chalk.cyan(`${packageManager} ${useYarn ? '' : 'run '}web`)}`)
  console.log()
}

run()

function validateNpmName(name: string): {
  valid: boolean
  problems?: string[]
} {
  const nameValidation = validateProjectName(name)
  if (nameValidation.validForNewPackages) {
    return { valid: true }
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  }
}

export async function installDependenciesAsync(
  projectRoot: string,
  packageManager: 'yarn' | 'npm' | 'pnpm'
) {
  const options = { cwd: projectRoot }
  if (packageManager === 'yarn') {
    const yarn = new PackageManager.YarnPackageManager(options)
    await yarn.installAsync()
  } else {
    await new PackageManager.NpmPackageManager(options).installAsync()
  }
}
