const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('node:fs')
const { join } = require('node:path')

// Path to your root package.json
const packageJsonPath = join(__dirname, '../', 'package.json')
const cacheFilePath = join(__dirname, '../', '.package-json-cache')

process.on('beforeExit', () => {
  resetPackageJson()
})

// Function to reset package.json
function resetPackageJson() {
  if (existsSync(cacheFilePath)) {
    const originalPackageJson = readFileSync(cacheFilePath, 'utf8')
    writeFileSync(packageJsonPath, originalPackageJson)
    console.info('package.json has been reset to its original state.')
    // remove the cache file
    unlinkSync(cacheFilePath)
  } else {
    console.warn('Cache file not found. Unable to reset package.json.')
  }
}

// Check if RESET_PACKAGE_JSON is set
if (process.env.RESET_PACKAGE_JSON === 'true') {
  resetPackageJson()
  process.exit(0)
}

// Read the desired React version from an environment variable
const reactVersion = process.env.REACT_VERSION

// If REACT_VERSION is not set, provide instructions and exit
if (!reactVersion) {
  console.warn('REACT_VERSION is not set. Please set it before running this script.')
  console.info('Usage: REACT_VERSION=18.2.0 yarn run reset-package-json')
  console.info('Available React versions: 18.2.x, 18.3.x')
  process.exit(1)
}

// Determine the corresponding react-native version
let reactNativeVersion
if (reactVersion.startsWith('18.2')) {
  reactNativeVersion = '0.74.6'
} else if (reactVersion.startsWith('18.3')) {
  reactNativeVersion = '0.75.4'
} else {
  // Handle other versions or default
  reactNativeVersion = '0.74.6'
}

// Read the package.json file
const originalPackageJson = readFileSync(packageJsonPath, 'utf8')

// Update the resolutions field
const packageJson = JSON.parse(originalPackageJson)
packageJson.resolutions = {
  ...packageJson.resolutions,
  react: reactVersion,
  'react-dom': reactVersion,
  'react-native': reactNativeVersion,
  'react-test-renderer': reactVersion,
}

// // Optionally, update the dependencies field as well
// packageJson.dependencies = {
//   ...packageJson.dependencies,
//   react: reactVersion,
//   'react-dom': reactVersion,
//   'react-native': reactNativeVersion,
//   'react-test-renderer': reactVersion,
// }

// Write the updated package.json back to the file system
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

// Cache the original package.json content
console.info('Caching original package.json state...')
writeFileSync(cacheFilePath, originalPackageJson)

console.info(
  `Updated package.json with React version ${reactVersion} and React Native version ${reactNativeVersion}`
)
console.info('Original package.json state cached.')

// Export the functions
module.exports = {
  resetPackageJson,
  updatePackageJson: () => {
    // Move the main update logic here
  },
}
