// Resolves the platform binary that npm installed.
//
// This is the esbuild / swc / biome / oxlint model: the umbrella package lists
// every platform package in `optionalDependencies`, each leaf carries `os` and
// `cpu` (and `libc` on linux), and npm installs exactly the one that matches.
// So there is no download step, no postinstall, and no network access at
// install time beyond the registry itself.

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** platform key -> the package that carries its binary */
const PACKAGES = {
  'darwin arm64': '@tamagui/lsp-darwin-arm64',
  'darwin x64': '@tamagui/lsp-darwin-x64',
  'linux arm64 glibc': '@tamagui/lsp-linux-arm64-gnu',
  'linux arm64 musl': '@tamagui/lsp-linux-arm64-musl',
  'linux x64 glibc': '@tamagui/lsp-linux-x64-gnu',
  'linux x64 musl': '@tamagui/lsp-linux-x64-musl',
  'win32 arm64': '@tamagui/lsp-win32-arm64',
  'win32 x64': '@tamagui/lsp-win32-x64',
}

/**
 * glibc vs musl, which npm's `libc` field distinguishes and `process.platform`
 * does not. `process.report` is the only stdlib way to tell them apart.
 */
function libc() {
  if (process.platform !== 'linux') return ''
  try {
    const report = process.report?.getReport()
    const header = typeof report === 'string' ? JSON.parse(report).header : report?.header
    // glibc builds report a glibc version; musl builds do not
    return header?.glibcVersionRuntime ? ' glibc' : ' musl'
  } catch {
    return ' glibc'
  }
}

export function platformKey() {
  return `${process.platform} ${process.arch}${libc()}`
}

/**
 * Absolute path to the `tamagui-lsp` executable for this platform.
 *
 * Throws with an actionable message rather than returning undefined: a missing
 * binary is almost always `--omit=optional` or an unsupported platform, and
 * both need the user to do something.
 */
export function binaryPath() {
  const key = platformKey()
  const pkg = PACKAGES[key]
  if (!pkg) {
    throw new Error(
      `@tamagui/lsp has no prebuilt binary for ${key}.\n` +
        `Supported: ${Object.keys(PACKAGES).join(', ')}.\n` +
        `Build from source with: cargo build --release -p tamagui-lsp`
    )
  }
  const exe = process.platform === 'win32' ? 'tamagui-lsp.exe' : 'tamagui-lsp'
  try {
    return require.resolve(`${pkg}/${exe}`)
  } catch {
    throw new Error(
      `@tamagui/lsp: ${pkg} is not installed.\n` +
        `It is an optional dependency, so this usually means the install ran with ` +
        `--omit=optional or --no-optional.\n` +
        `Reinstall without that flag, or add ${pkg} directly.`
    )
  }
}
