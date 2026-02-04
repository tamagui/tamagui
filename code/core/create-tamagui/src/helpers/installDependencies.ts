import * as PackageManager from '@expo/package-manager'

export async function installDependencies(
  projectRoot: string,
  packageManager: 'yarn' | 'npm' | 'pnpm' | 'bun'
) {
  // Check if Vitest 2 is running
  if (process.env.VITEST) {
    console.warn('Skipping dependency installation because Vitest 2 is running.')
    return
  }

  const options = { cwd: projectRoot }
  if (packageManager === 'yarn') {
    await new PackageManager.YarnPackageManager(options).installAsync()
  } else if (packageManager === 'pnpm') {
    await new PackageManager.PnpmPackageManager(options).installAsync()
  } else if (packageManager === 'bun') {
    await new PackageManager.BunPackageManager(options).installAsync()
  } else {
    await new PackageManager.NpmPackageManager(options).installAsync()
  }
}
