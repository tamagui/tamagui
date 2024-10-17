const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')

module.exports = {
  name: 'enforce-version',
  factory: () => ({
    hooks: {
      validateProject: async (project, report) => {
        console.info('Validating project')
        await checkYarnVersion()
      },
    },
  }),
}

// Function to check Yarn version
async function checkYarnVersion() {
  // Resolve path to the package.json
  const packageJsonPath = resolve('package.json')

  // Read and parse package.json
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  // Extract the required Yarn version from the packageManager field
  const packageManager = packageJson.packageManager || ''
  const requiredYarnVersion = packageManager.match(/yarn@([\d.]+)/)?.[1]
  console.info('\x1b[33m%s\x1b[0m', `\nRequired Yarn version: ${requiredYarnVersion}`)

  // If no required Yarn version is found in packageManager
  if (!requiredYarnVersion) {
    console.error(
      'Error: No Yarn version specified in the packageManager field of package.json.'
    )
    process.exit(1)
  }

  // Get the current Yarn version by spawning 'yarn -v'
  const { execSync } = require('node:child_process')
  let currentYarnVersion
  try {
    currentYarnVersion = execSync('yarn -v', { encoding: 'utf-8' }).trim()
  } catch (error) {
    console.error('Error executing yarn -v:', error.message)
    currentYarnVersion = 'unknown'
  }

  // If current Yarn version is not detected
  if (!currentYarnVersion || currentYarnVersion === 'unknown') {
    console.error('Error: Unable to detect the current Yarn version.')
    process.exit(1)
  }

  // Compare the required and current Yarn versions
  if (currentYarnVersion !== requiredYarnVersion) {
    console.error(
      `\nError: You are using Yarn version ${currentYarnVersion}, but version ${requiredYarnVersion} is required.`
    )
    console.info(
      '\nYarn install with the incorrect version can result in mutable installs, which are not allowed in CI.'
    )
    console.info(
      '\x1b[32m%s\x1b[0m',
      `\nRun "yarn set version ${requiredYarnVersion}" to fix.`
    )
    process.exit(1) // Exit the process if the version is incorrect
  }

  // If versions match, allow installation to proceed
  console.info(`Yarn version check passed: using Yarn ${currentYarnVersion}`)
}
