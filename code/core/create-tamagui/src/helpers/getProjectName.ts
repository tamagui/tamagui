import path from 'node:path'

import chalk from 'chalk'
import prompts from 'prompts'

import packageJson from '../../package.json'
import { validateNpmName } from './validateNpmPackage'

export const getProjectName = async (projectPath?: string) => {
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
    console.info()
    console.info('Please specify the project directory:')
    console.info(
      `  ${chalk.cyan(packageJson.name)} ${chalk.green('<project-directory>')}`
    )
    console.info()
    console.info('For example:')
    console.info(`  ${chalk.cyan(packageJson.name)} ${chalk.green('my-tamagui-app')}`)
    console.info()
    console.info(`Run ${chalk.cyan(`${packageJson.name} --help`)} to see all options.`)
    process.exit(1)
  }
  return projectPath
}
