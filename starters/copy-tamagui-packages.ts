import { join } from 'path'

import fs from 'fs-extra'

const PACKAGES_ROOT = join(__dirname, '..', 'packages')

export async function copyTamaguiPackages(dir: string) {
  const modulesDir = join(dir, 'node_modules')
  const tamaguiModulesDir = join(modulesDir, '@tamagui')
  await fs.remove(tamaguiModulesDir)

  // eslint-disable-next-line no-console
  console.log(`Copying in tamagui local modules from ${PACKAGES_ROOT} to ${tamaguiModulesDir}`)
  await fs.copy(PACKAGES_ROOT, tamaguiModulesDir)

  // eslint-disable-next-line no-console
  console.log(`Copying extra "support" packages`)
  await fs.copy(modulesDir, tamaguiModulesDir, {
    errorOnExist: false,
    overwrite: true,
  })
}
