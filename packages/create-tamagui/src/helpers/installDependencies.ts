import * as PackageManager from '@expo/package-manager'

export async function installDependencies(
  projectRoot: string,
  packageManager: 'yarn' | 'npm' | 'pnpm' | 'bun'
) {
  const options = { cwd: projectRoot }
  if (packageManager === 'yarn') {
    const yarn = new PackageManager.YarnPackageManager(options)
    await yarn.installAsync()
  } else {
    await new PackageManager.NpmPackageManager(options).installAsync()
  }
}
