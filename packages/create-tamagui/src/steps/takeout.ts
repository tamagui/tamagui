import { execSync } from 'child_process'

import chalk from 'chalk'
import prompts from 'prompts'

import { takeoutAsciiArt, tamaguiRainbowAsciiArt } from '../helpers/asciiArts'
import { ExtraSteps } from './types'

const packageManager = 'yarn'
const useYarn = packageManager === 'yarn'

const runCommand = (scriptName: string) =>
  `${packageManager} ${useYarn ? '' : 'run '}${scriptName}`

const main: ExtraSteps = async ({ projectName }) => {
  console.log(`
${tamaguiRainbowAsciiArt
  .split('\n')
  .map((line) => `                ${line}`)
  .join('\n')}
${takeoutAsciiArt}

`)

  console.log()
  const { setupSupabase } = await prompts({
    name: 'setupSupabase',
    message: 'Set up Supabase?',
    type: 'confirm',
    initial: true,
  })

  if (setupSupabase) {
    console.log()
    const { startLocalSupabase } = await prompts({
      name: 'startLocalSupabase',
      type: 'confirm',
      message: 'Start local Supabase instance for you? (Requires Docker)',
      initial: true,
    })

    if (startLocalSupabase) {
      execSync(`yarn workspace @my/supabase start`, { stdio: 'inherit' })
      console.log("Don't forget to create storage bucket with the name `avatars`.")
    }

    console.log()
    const { setupRemoteSupabase } = await prompts({
      name: 'setupRemoteSupabase',
      type: 'confirm',
      message:
        'Link remote Supabase instance for you? (Create a project on https://app.supabase.com/projects first)',
      initial: true,
    })

    if (setupRemoteSupabase) {
      execSync(`npx supabase login`, { stdio: 'inherit' })
      console.log()
      const { supabaseRefId } = await prompts({
        name: 'supabaseRefId',
        type: 'text',
        message: "Enter your supabase project's ID (e.g. abcdefghijklmnopqrst)",
        initial: true,
      })

      execSync(`yarn workspace @my/supabase link-project ${supabaseRefId.trim()}`, {
        stdio: 'inherit',
      })

      // console.log()
      // const { runSupabaseMigrations } = await prompts({ name: 'runSupabaseMigrations', type: 'confirm', message: 'Run Supabase migrations on your remote Supabase instance?' })

      // if (runSupabaseMigrations) {
      //     execSync(`yarn workspace @my/supabase migrate`, { stdio: 'inherit' })
      // }
    }
  }

  console.log(`
${chalk.green.bold('Done!')} created a new project under ./${projectName}

cd into the project using:
  ${chalk.green('  cd')} ${projectName}
  
Inside that directory, you can run several commands:
  
  To start the Next.js development server, run:
    ${chalk.green(runCommand('web'))}
    
  To start developing for iOS, run:
    ${chalk.green(runCommand('ios'))}

  To start developing for Android, run:
    ${chalk.green(runCommand('android'))}

  To run Supabase scripts, cd into the supabase package:
    ${chalk.green('cd supabase')}
  
    ${chalk.green('yarn reset')} - Resets local database
    ${chalk.green('yarn generate')} - Generates new types

    Find info on the rest of the scripts in ${chalk.cyan(`supabase/README.md`)}
  `)
}
export default main
