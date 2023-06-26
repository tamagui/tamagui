#!/usr/bin/env node
/* eslint-disable no-console */
// inspired by https://github.com/vercel/next.js/blob/0355e5f63f87db489f36db8d814958cb4c2b828b/packages/create-next-app/helpers/examples.ts#L71

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { cwd } from 'process'

import chalk from 'chalk'
import Commander from 'commander'
import { $, cd } from 'zx'

import packageJson from '../package.json'
import { IS_TEST } from './constants'
import { tamaguiDuckAsciiArt, tamaguiRainbowAsciiArt } from './helpers/asciiArts'
import { cloneStarter } from './helpers/cloneStarter'
import { getProjectName } from './helpers/getProjectName'
import { getShouldUseGit } from './helpers/getShouldUseGit'
import { getTemplateInfo } from './helpers/getTemplateInfo'
import { installDependencies } from './helpers/installDependencies'
import { validateNpmName } from './helpers/validateNpmPackage'

let projectPath = ''

if (IS_TEST) {
  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log(`🧐 Running create-tamagui in test mode 🧐`)
}

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .action((name) => {
    projectPath = name
  })
  .option(
    `--skip-cloning`,
    'Skips the cloning and basic setup and goes directly to the setup specific to the starter. Use if you already have the starter wanna run the setup or see the instructions again.'
  )
  .option(
    `--template <template>, -t <template>`,
    'Choose between next-expo-solito, a more full featured template with Expo and Next.js, a simple client-only web starter that includes a nice simple example configuration to understand the basics more easily, or the premium Takeout 🥡 starter.',
    ''
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
const skipCloning = !!program.skipCloning

const packageManager = 'yarn'

async function run() {
  if (!skipCloning) {
    console.log() // this newline prevents the ascii art from breaking
    console.log(tamaguiRainbowAsciiArt)
    console.log(chalk.bold('Creating tamagui app...'))

    const gitVersionString = parseFloat(
      execSync(`git --version`).toString().replace(`git version `, '').trim()
    )
    if (gitVersionString < 2.27) {
      console.error(`\n\n ⚠️ Tamagui can't install: Git version must be >= 2.27\n\n`)
      process.exit(1)
    }
  }

  projectPath = skipCloning ? cwd() : await getProjectName(projectPath)

  let template = await getTemplateInfo(program.template)
  if (!skipCloning) {
    // space
    console.log()

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
    const shouldGitInit = await getShouldUseGit()

    try {
      await cloneStarter(template, resolvedProjectPath, projectName)
      cd(resolvedProjectPath)

      // space
      console.log()

      if (shouldGitInit) {
        await $`git init`
      }
    } catch (e) {
      console.error(`[tamagui] Failed to copy example into ${resolvedProjectPath}\n\n`, e)
      process.exit(1)
    }

    console.log('Installing packages. This might take a couple of minutes.')
    console.log()

    try {
      await installDependencies(resolvedProjectPath, packageManager)
    } catch (e: any) {
      console.error(
        '[tamagui] error installing with ' + packageManager + '\n',
        e?.message
      )
      process.exit(1)
    }

    if (shouldGitInit) {
      try {
        execSync('git checkout -b main', { stdio: 'ignore' })
        execSync('git add -A', { stdio: 'ignore' })
        execSync('git commit -m "Initial commit from create-tamagui"', {
          stdio: 'ignore',
        })
      } catch (e: any) {
        console.error('[tamagui] Failed to create initial commit.\n\n', e.message)
      }
    }
    await template.extraSteps({ isFullClone: true, projectName, projectPath })
  } else {
    await template.extraSteps({
      isFullClone: false,
      projectName: path.basename(cwd()),
      projectPath: cwd(),
    })
  }

  console.log()
  console.log(chalk.gray(tamaguiDuckAsciiArt))
}

run()
