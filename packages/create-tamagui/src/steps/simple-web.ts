import chalk from 'chalk'

import type { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName }) => {
  if (isFullClone) {
    console.info(`
  ${chalk.green.bold('Done!')} created a new project under ./${projectName}

visit your project:
  ${chalk.green('cd')} ${projectName}
`)
  }
  console.info(`
  To start the Next.js development server, run:
    ${chalk.green(runCommand('web'))}
`)
}

export default main
