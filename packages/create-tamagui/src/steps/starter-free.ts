import chalk from 'chalk'

import type { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ isFullClone, projectName }) => {
  console.info(`Note: you need yarn for this repo.`)

  if (isFullClone) {
    console.info(`${chalk.green.bold(
      'Done!'
    )} created a new project under ./${projectName}

visit your project:
  ${chalk.green('cd')} ${projectName}
`)
  }
  console.info(`
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

  Be sure to replace yourprojectsname in app.json with the uid you'd like for your app.
`)
}

export default main
