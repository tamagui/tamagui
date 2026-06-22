// vanilla Expo monorepo metro config (mirrors conformance/native) — resolves @tamagui/* from
// the workspace source. Mode is selected at deep-link time, not at build time, so a single
// bundle exercises both "compiled" (default) and "runtime" (EXTRACT=0) paths via deep-link.
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../../..')

const config = getDefaultConfig(projectRoot)

config.resolver.unstable_enablePackageExports =
  process.env.TAMAGUI_PACKAGE_EXPORTS !== 'false'

// @tamagui/web ships BOTH `.mjs` (web) and `.native.js` (native) for every file in
// dist/esm. metro's default sourceExts order puts `.mjs` BEFORE `.js`, so a relative
// import like `index.native.js` -> `export * from "./createComponent"` resolves to
// `createComponent.mjs` (WEB) before it ever tries `createComponent.native.js` — pulling
// the entire web build (WRONG CODE TO BENCHMARK, + a module-top `addEventListener` Hermes
// crash) into the native bundle. moving `mjs` last lets the `.native.js` variant win.
// NOTE: this is an upstream tamagui packaging bug — see docs/v2-perf-followups.md.
config.resolver.sourceExts = [
  ...config.resolver.sourceExts.filter((e) => e !== 'mjs'),
  'mjs',
]

config.resolver.blockList = [/code\/tamagui\.dev\//, /code\/.*\/__tests__\//]

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

module.exports = config
