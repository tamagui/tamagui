import prompts from 'prompts'

import { IS_TEST } from '../constants'

export const getShouldInstallDependencies = async () => {
  return (
    IS_TEST ||
    Boolean(
      (
        await prompts({
          type: 'confirm',
          name: 'installDependencies',
          message: 'Do you want us to install dependencies?',
          initial: true,
        })
      ).installDependencies
    )
  )
}
