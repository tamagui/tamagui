#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { Stream } from 'stream'
import { promisify } from 'util'

// inspired by https://github.com/vercel/next.js/blob/0355e5f63f87db489f36db8d814958cb4c2b828b/packages/create-next-app/helpers/examples.ts#L71
import * as PackageManager from '@expo/package-manager'
import chalk from 'chalk'
import Commander from 'commander'
import got from 'got'
import prompts from 'prompts'
import tar from 'tar'
import validateProjectName from 'validate-npm-package-name'

import packageJson from '../package.json'

const pipeline = promisify(Stream.pipeline)

let projectPath = ''

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

export function downloadAndExtractExample(root: string, name: string): Promise<void | unknown> {
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
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }
  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
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
      // prettier-ignore
      `You tried to make a project called ${chalk.underline(chalk.blueBright(projectName))}, but a folder with that name already exists: ${chalk.blueBright(resolvedProjectPath)}

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
    console.log(`Copying template into ${chalk.blueBright(projectName)}...`)
    await downloadAndExtractExample(resolvedProjectPath, program.template)
    console.log(chalk.green(`${projectName} created!`))
  } catch (e) {
    console.error(
      `[tamagui] Failed to download/extract example\n from: ${DOWNLOAD_URL}\n into: ${resolvedProjectPath}\n\n`,
      e
    )
    process.exit(1)
  }

  console.log('Installing packages. This might take a couple of minutes.')
  console.log()
  const useYarn = packageManager === 'yarn'
  try {
    await installDependenciesAsync(resolvedProjectPath, packageManager)
  } catch (e: any) {
    console.error(
      '[tamagui] error installing node_modules with ' + packageManager + '\n',
      e?.message
    )
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
