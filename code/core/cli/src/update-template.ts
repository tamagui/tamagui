import chalk from 'chalk'
import { execSync } from 'child_process'

export function updateTemplate(templateUrl: string, ignoredPatterns: string[] = []) {
  const templateName = templateUrl.split('/').pop()?.split('.')[0] || 'template'
  const remoteName = `${templateName}-template`
  const addRemoteCommand = `git remote add ${remoteName} ${templateUrl}`
  const rmRemoteCommand = `git remote remove ${remoteName}`
  try {
    execSync(addRemoteCommand)
  } catch (error) {
    if (error instanceof Error && error.toString().includes('already exists')) {
      execSync(rmRemoteCommand)
      execSync(addRemoteCommand)
    } else {
      throw error
    }
  }
  execSync(`git fetch --all`)
  try {
    execSync(`git merge takeout-template/main --allow-unrelated-histories`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('unresolved conflict')) {
      console.info(
        tamaguiLog(
          "We've merged the latest changes. Please resolve the conflicts and commit the merge."
        )
      )
    } else {
      throw error
    }
  }
  execSync(`git reset HEAD ${ignoredPatterns.join(' ')}`)
}

function tamaguiLog(message) {
  return `${chalk.green('[Tamagui]')} ${message}`
}
