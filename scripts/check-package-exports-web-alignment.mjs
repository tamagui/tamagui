#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build'])
const RUNTIME_KEYS = ['react-native', 'browser', 'module', 'import', 'require', 'default']
const REQUIRED_KEYS = ['react-native', 'browser', 'default']
const MAX_REPORT = Number(process.env.EXPORTS_CHECK_MAX_REPORT || 200)
const SHOULD_FIX = process.argv.includes('--fix')
const EXCLUDED_PACKAGES = new Set(['@tamagui/vite-plugin-internal'])

function walkPackageJsonFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue

    const nextPath = `${dir}/${entry.name}`

    if (entry.isDirectory()) {
      walkPackageJsonFiles(nextPath, out)
      continue
    }

    if (entry.isFile() && entry.name === 'package.json') {
      out.push(nextPath)
    }
  }

  return out
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function hasAnyRuntimeKey(value) {
  return RUNTIME_KEYS.some((key) => key in value)
}

function pickWebTarget(exportValue) {
  return (
    exportValue.browser ||
    exportValue.import ||
    exportValue.module ||
    exportValue.default ||
    exportValue.require
  )
}

function pickReactNativeTarget(exportValue) {
  return (
    exportValue['react-native'] ||
    exportValue.import ||
    exportValue.module ||
    exportValue.default ||
    exportValue.require
  )
}

function checkAndMaybeFixExports(file, pkg) {
  const issues = []
  const exportsField = pkg.exports

  if (EXCLUDED_PACKAGES.has(pkg.name)) {
    return { issues, fixed: false }
  }

  if (!isObject(exportsField)) {
    return { issues, fixed: false }
  }

  const rootExport = exportsField['.']
  if (!isObject(rootExport)) {
    return { issues, fixed: false }
  }

  const packageSupportsWeb =
    'browser' in rootExport || 'module' in rootExport || 'import' in rootExport
  const packageSupportsReactNative = 'react-native' in rootExport

  if (!packageSupportsWeb || !packageSupportsReactNative) {
    return { issues, fixed: false }
  }

  let fixed = false

  for (const [exportPath, exportValue] of Object.entries(exportsField)) {
    if (exportPath === './package.json') continue
    if (!isObject(exportValue)) continue
    if (!hasAnyRuntimeKey(exportValue)) continue

    if (!('browser' in exportValue)) {
      const browserTarget = pickWebTarget(exportValue)
      if (SHOULD_FIX && browserTarget) {
        exportValue.browser = browserTarget
        fixed = true
      }
    }

    if (!('default' in exportValue)) {
      const defaultTarget = pickWebTarget(exportValue) || exportValue.require
      if (SHOULD_FIX && defaultTarget) {
        exportValue.default = defaultTarget
        fixed = true
      }
    }

    if (!('react-native' in exportValue)) {
      const rnTarget = pickReactNativeTarget(exportValue)
      if (SHOULD_FIX && rnTarget) {
        exportValue['react-native'] = rnTarget
        fixed = true
      }
    }

    const missing = REQUIRED_KEYS.filter((key) => !(key in exportValue))
    if (missing.length > 0) {
      issues.push({ file, exportPath, missing })
    }
  }

  return { issues, fixed }
}

function main() {
  const files = walkPackageJsonFiles('code')
  const allIssues = []
  const fixedFiles = []

  for (const file of files) {
    let pkg
    try {
      pkg = JSON.parse(readFileSync(file, 'utf8'))
    } catch (error) {
      allIssues.push({
        file,
        exportPath: '.',
        missing: [
          `invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        ],
      })
      continue
    }

    const { issues, fixed } = checkAndMaybeFixExports(file, pkg)
    allIssues.push(...issues)

    if (SHOULD_FIX && fixed) {
      writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
      fixedFiles.push(file)
    }
  }

  if (fixedFiles.length > 0) {
    console.info(
      `check-package-exports-web-alignment: fixed ${fixedFiles.length} file(s)`
    )
  }

  if (allIssues.length === 0) {
    console.info('check-package-exports-web-alignment: OK')
    process.exit(0)
  }

  console.error(`check-package-exports-web-alignment: found ${allIssues.length} issue(s)`)
  const report = allIssues.slice(0, MAX_REPORT)
  for (const issue of report) {
    console.error(
      `- ${issue.file} ${issue.exportPath} missing: ${issue.missing.join(', ')}`
    )
  }
  if (allIssues.length > report.length) {
    console.error(`... ${allIssues.length - report.length} more issue(s) not shown`)
    console.error('Set EXPORTS_CHECK_MAX_REPORT to increase output.')
  }

  process.exit(1)
}

main()
