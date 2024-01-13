import chalk from 'chalk'

import { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName }) => {
  if (isFullClone) {
    console.info(`
  ${chalk.green.bold('Done!')} created a new project under ./${projectName}

cd into the project using:
  ${chalk.green('cd')} ${projectName}
`)
  }
}

export default main
