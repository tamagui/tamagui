import prompts from 'prompts'

import { IS_TEST } from '../create-tamagui-constants'

export const getShouldUseGit = async () => {
  return (
    IS_TEST ||
    Boolean(
      (
        await prompts({
          type: 'confirm',
          name: 'gitInit',
          message: 'Do you want to use git?',
          initial: true,
        })
      ).gitInit
    )
  )
}
