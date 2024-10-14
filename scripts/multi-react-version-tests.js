const { readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

// Read the desired React version from an environment variable
const reactVersion = process.env.REACT_VERSION

// If REACT_VERSION is not set, exit early
if (!reactVersion) {
  console.info('REACT_VERSION is not set. Exiting without making changes.')
  process.exit(0)
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

// Path to your root package.json
const packageJsonPath = join(__dirname, '../', 'package.json')

// Read the package.json file
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

// Update the resolutions field
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

console.info(
  `Updated package.json with React version ${reactVersion} and React Native version ${reactNativeVersion}`
)
