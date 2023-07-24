import chalk from 'chalk'

import { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName }) => {
  if (isFullClone) {
    console.log(`${chalk.green.bold('Done!')} created a new project under ./${projectName}

cd into the project using:
  ${chalk.green('cd')} ${projectName}
`)
  }
  // rome-ignore lint/nursery/noConsoleLog: <explanation>
  console.log(`
  To start the Next.js development server, run:
    ${chalk.green(runCommand('web'))}
    
  To start Expo Go for mobile development, run:
    ${chalk.green(runCommand('native'))}

  You can also create Expo development builds by doing:
    ${chalk.green(`cd apps/expo`)} 
    then:
    ${chalk.green(runCommand('ios'))} 
    or...
    ${chalk.green(runCommand('android'))}
`)
}

export default main
