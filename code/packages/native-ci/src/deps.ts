/**
 * Dependency management utilities for native testing
 *
 * Handles auto-installation of required tools for iOS and Android testing.
 */

import { execSync, spawnSync } from 'node:child_process'
import { platform } from 'node:os'

export interface DepsCheckResult {
  bun: boolean
  detoxCli: boolean
  applesimutils: boolean
  maestro: boolean
}

/**
 * Check which dependencies are installed
 */
export function checkDeps(): DepsCheckResult {
  return {
    bun: commandExists('bun'),
    detoxCli: commandExists('detox'),
    applesimutils: commandExists('applesimutils'),
    maestro: commandExists('maestro'),
  }
}

function commandExists(cmd: string): boolean {
  const result = spawnSync('which', [cmd], { encoding: 'utf-8' })
  return result.status === 0
}

/**
 * Install missing dependencies for iOS testing (macOS only)
 */
export async function ensureIosDeps(): Promise<void> {
  if (platform() !== 'darwin') {
    console.info('iOS testing requires macOS')
    return
  }

  const deps = checkDeps()

  if (!deps.bun) {
    console.info('Installing Bun...')
    execSync('curl -fsSL https://bun.sh/install | bash', { stdio: 'inherit' })
  }

  if (!deps.detoxCli) {
    console.info('Installing Detox CLI...')
    execSync('npm install -g detox-cli', { stdio: 'inherit' })
  }

  if (!deps.applesimutils) {
    console.info('Installing applesimutils...')
    execSync('brew tap wix/brew && brew install applesimutils', { stdio: 'inherit' })
  }

  console.info('All iOS dependencies installed')
}

/**
 * Install missing dependencies for Android testing
 */
export async function ensureAndroidDeps(): Promise<void> {
  const deps = checkDeps()

  if (!deps.bun) {
    console.info('Installing Bun...')
    execSync('curl -fsSL https://bun.sh/install | bash', { stdio: 'inherit' })
  }

  if (!deps.detoxCli) {
    console.info('Installing Detox CLI...')
    execSync('npm install -g detox-cli', { stdio: 'inherit' })
  }

  console.info('All Android dependencies installed')
}

/**
 * Install Maestro if not present (macOS only for now)
 */
export async function ensureMaestro(): Promise<void> {
  const deps = checkDeps()

  if (deps.maestro) {
    console.info('Maestro is already installed')
    return
  }

  console.info('Installing Maestro...')
  execSync('curl -Ls "https://get.maestro.mobile.dev" | bash', { stdio: 'inherit' })
}

/**
 * Print dependency status
 */
export function printDepsStatus(): void {
  const deps = checkDeps()
  const check = (ok: boolean) => (ok ? '✓' : '✗')

  console.info('Dependency Status:')
  console.info(`  ${check(deps.bun)} Bun`)
  console.info(`  ${check(deps.detoxCli)} Detox CLI`)
  console.info(`  ${check(deps.applesimutils)} applesimutils (macOS)`)
  console.info(`  ${check(deps.maestro)} Maestro`)
}
