import { join } from 'path'

import fs from 'fs-extra'

const PACKAGES_ROOT = join(__dirname, '..', 'packages')

export async function copyTamaguiPackages(dir: string) {
  const modulesDir = join(dir, 'node_modules')
  const tamaguiModulesDir = join(modulesDir, '@tamagui')
  await fs.remove(tamaguiModulesDir)

  // rome-ignore lint/nursery/noConsoleLog: ok
  console.log(
    `Copying in tamagui local modules from ${PACKAGES_ROOT} to ${tamaguiModulesDir}`
  )
  await fs.copy(PACKAGES_ROOT, tamaguiModulesDir)

  // rome-ignore lint/nursery/noConsoleLog: ok
  console.log(`Copying extra "support" packages`)
  await fs.copy(modulesDir, tamaguiModulesDir, {
    errorOnExist: false,
    overwrite: true,
    // filter: (file) => {
    //   return file.includes('/starters/')
    // }
  })
}
