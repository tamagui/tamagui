#!/usr/bin/env node
/**
 * CLI for @tamagui/native-ci
 *
 * Provides commands for:
 * - Running native tests (Detox, Maestro)
 * - Fingerprint generation and caching
 * - Dependency management
 */

import { generateFingerprint, generatePreFingerprintHash } from './fingerprint'
import { createCacheKey, saveFingerprintToKV, getFingerprintFromKV, saveCache, loadCache } from './cache'
import { setGitHubOutput, isGitHubActions, isCI } from './runner'
import { checkDeps, ensureIosDeps, ensureAndroidDeps, ensureMaestro, printDepsStatus } from './deps'
import { withMetro } from './metro'
import { parseDetoxArgs, runDetoxTests } from './detox'
import { ensureIOSFolder } from './ios'
import { setupAndroidDevice, ensureAndroidFolder } from './android'
import type { Platform } from './constants'

const HELP = `
native-ci - Native CI/CD helpers for Expo apps

COMMANDS:

  Test Commands:
    test ios [options]         Run iOS Detox tests
    test android [options]     Run Android Detox tests
    test maestro [flow]        Run Maestro tests
    test all                   Run all tests (iOS + Android)

  Dependency Commands:
    deps                       Show dependency status
    deps install               Install missing dependencies
    deps install-ios           Install iOS dependencies (macOS only)
    deps install-android       Install Android dependencies
    deps install-maestro       Install Maestro

  Fingerprint Commands:
    fingerprint <platform>     Generate native build fingerprint
    fingerprint-test           Test fingerprint caching locally
    pre-hash <files...>        Generate quick pre-fingerprint hash
    cache-key <platform> <fp>  Generate cache key from fingerprint

  KV Store Commands:
    kv-get <key>               Get value from KV store
    kv-set <key> <value>       Set value in KV store

OPTIONS:
  --project-root <path>      Project root directory (default: cwd)
  --config <name>            Detox configuration name
  --record-logs <mode>       Record logs: none, failing, all (default: all)
  --retries <n>              Number of retries for flaky tests (default: 0)
  --headless                 Run in headless mode (Android only)
  --prefix <prefix>          Cache key prefix (default: native-build)
  --github-output            Output results for GitHub Actions
  --json                     Output as JSON
  --help                     Show this help message

ENVIRONMENT:
  KV_STORE_REDIS_REST_URL    Redis REST API URL for fingerprint caching
  KV_STORE_REDIS_REST_TOKEN  Redis REST API token

EXAMPLES:
  native-ci test ios
  native-ci test android --headless
  native-ci test maestro
  native-ci deps
  native-ci deps install
  native-ci fingerprint ios
  native-ci fingerprint-test
`

interface ParsedArgs {
  command: string
  subcommand: string
  args: string[]
  options: {
    projectRoot: string
    config: string
    recordLogs: string
    retries: number
    headless: boolean
    prefix: string
    githubOutput: boolean
    json: boolean
    help: boolean
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: string[] = []
  const options = {
    projectRoot: process.cwd(),
    config: '',
    recordLogs: 'all',
    retries: 0,
    headless: false,
    prefix: 'native-build',
    githubOutput: false,
    json: false,
    help: false,
  }

  let i = 0
  while (i < argv.length) {
    const arg = argv[i]

    if (arg === '--project-root' && argv[i + 1]) {
      options.projectRoot = argv[++i]
    } else if (arg === '--config' && argv[i + 1]) {
      options.config = argv[++i]
    } else if (arg === '--record-logs' && argv[i + 1]) {
      options.recordLogs = argv[++i]
    } else if (arg === '--retries' && argv[i + 1]) {
      const val = Number.parseInt(argv[++i], 10)
      if (!Number.isNaN(val) && val >= 0) {
        options.retries = val
      }
    } else if (arg === '--prefix' && argv[i + 1]) {
      options.prefix = argv[++i]
    } else if (arg === '--github-output') {
      options.githubOutput = true
    } else if (arg === '--json') {
      options.json = true
    } else if (arg === '--help' || arg === '-h') {
      options.help = true
    } else if (!arg.startsWith('-')) {
      args.push(arg)
    }

    i++
  }

  return {
    command: args[0] || '',
    subcommand: args[1] || '',
    args: args.slice(2),
    options,
  }
}

function validatePlatform(value: string): Platform {
  if (value !== 'ios' && value !== 'android') {
    console.error('Error: platform must be "ios" or "android"')
    process.exit(1)
  }
  return value
}

function getKVCredentials(): { url: string; token: string } {
  const url = process.env.KV_STORE_REDIS_REST_URL
  const token = process.env.KV_STORE_REDIS_REST_TOKEN

  if (!url || !token) {
    console.error('Error: KV_STORE_REDIS_REST_URL and KV_STORE_REDIS_REST_TOKEN required')
    process.exit(1)
  }

  return { url, token }
}

// Parse arguments
const { command, subcommand, args, options } = parseArgs(process.argv.slice(2))

if (options.help || !command) {
  console.info(HELP)
  process.exit(options.help ? 0 : 1)
}

try {
  switch (command) {
    // ========================================
    // Test Commands
    // ========================================
    case 'test': {
      // Skip in CI - native tests are run by separate workflows
      if (isCI() && !process.env.NATIVE_CI_FORCE_RUN) {
        console.info('Skipping native tests in CI (handled by separate workflow)')
        console.info('Set NATIVE_CI_FORCE_RUN=1 to force run')
        process.exit(0)
      }

      const platform = subcommand || 'ios'

      if (platform === 'ios') {
        // Ensure iOS dependencies
        await ensureIosDeps()

        const config = options.config || 'ios.sim.debug'
        console.info('=== iOS Detox Test Runner ===')
        console.info(`Config: ${config}`)
        console.info(`Project root: ${options.projectRoot}`)

        process.chdir(options.projectRoot)
        await ensureIOSFolder()

        const exitCode = await withMetro('ios', async () => {
          return runDetoxTests({
            config,
            projectRoot: options.projectRoot,
            recordLogs: options.recordLogs,
            retries: options.retries,
          })
        })
        process.exit(exitCode)
      } else if (platform === 'android') {
        // Ensure Android dependencies
        await ensureAndroidDeps()

        const config = options.config || 'android.emu.debug'
        console.info('=== Android Detox Test Runner ===')
        console.info(`Config: ${config}`)
        console.info(`Project root: ${options.projectRoot}`)
        console.info(`Headless: ${options.headless}`)

        process.chdir(options.projectRoot)
        await ensureAndroidFolder()

        // Setup Android device (wait for emulator, ADB reverse)
        await setupAndroidDevice()

        const exitCode = await withMetro('android', async () => {
          return runDetoxTests({
            config,
            projectRoot: options.projectRoot,
            recordLogs: options.recordLogs,
            retries: options.retries,
            headless: options.headless,
          })
        })
        process.exit(exitCode)
      } else if (platform === 'maestro') {
        // Ensure Maestro is installed
        await ensureMaestro()

        const flow = args[0] || ''
        console.info('=== Maestro Test Runner ===')
        console.info(`Flow: ${flow || 'all'}`)
        console.info(`Project root: ${options.projectRoot}`)

        process.chdir(options.projectRoot)

        // Run Maestro with Metro for development builds
        const exitCode = await withMetro('ios', async () => {
          const { $ } = await import('bun')
          // Flows are at ./flows/ in kitchen-sink, not .maestro/flows/
          const flowArg = flow ? `./flows/${flow}` : './flows'
          const result = await $`maestro test ${flowArg} --exclude-tags=util --no-ansi`.nothrow()
          return result.exitCode
        })
        process.exit(exitCode)
      } else if (platform === 'all') {
        console.info('=== Running All Native Tests ===\n')

        // Run iOS tests
        await ensureIosDeps()
        console.info('\n--- iOS Tests ---\n')
        process.chdir(options.projectRoot)
        await ensureIOSFolder()

        let iosExit = 0
        try {
          iosExit = await withMetro('ios', async () => {
            return runDetoxTests({
              config: options.config || 'ios.sim.debug',
              projectRoot: options.projectRoot,
              recordLogs: options.recordLogs,
              retries: options.retries,
            })
          })
        } catch (err) {
          console.error('iOS tests failed:', err)
          iosExit = 1
        }

        // Run Android tests
        await ensureAndroidDeps()
        console.info('\n--- Android Tests ---\n')
        await ensureAndroidFolder()
        await setupAndroidDevice()

        let androidExit = 0
        try {
          androidExit = await withMetro('android', async () => {
            return runDetoxTests({
              config: options.config || 'android.emu.debug',
              projectRoot: options.projectRoot,
              recordLogs: options.recordLogs,
              retries: options.retries,
              headless: options.headless,
            })
          })
        } catch (err) {
          console.error('Android tests failed:', err)
          androidExit = 1
        }

        const success = iosExit === 0 && androidExit === 0
        console.info(`\n=== Test Results ===`)
        console.info(`iOS: ${iosExit === 0 ? 'PASSED' : 'FAILED'}`)
        console.info(`Android: ${androidExit === 0 ? 'PASSED' : 'FAILED'}`)
        process.exit(success ? 0 : 1)
      } else {
        console.error(`Unknown test platform: ${platform}`)
        console.info('Usage: native-ci test [ios|android|maestro|all]')
        process.exit(1)
      }
      break
    }

    // ========================================
    // Dependency Commands
    // ========================================
    case 'deps': {
      if (!subcommand || subcommand === 'status') {
        printDepsStatus()
      } else if (subcommand === 'install') {
        console.info('Installing all dependencies...\n')
        await ensureIosDeps()
        await ensureMaestro()
        console.info('\nAll dependencies installed!')
      } else if (subcommand === 'install-ios') {
        await ensureIosDeps()
      } else if (subcommand === 'install-android') {
        await ensureAndroidDeps()
      } else if (subcommand === 'install-maestro') {
        await ensureMaestro()
      } else {
        console.error(`Unknown deps subcommand: ${subcommand}`)
        process.exit(1)
      }
      break
    }

    // ========================================
    // Fingerprint Commands
    // ========================================
    case 'fingerprint': {
      const platform = validatePlatform(subcommand)

      const result = await generateFingerprint({
        platform,
        projectRoot: options.projectRoot,
      })

      if (options.githubOutput || isGitHubActions()) {
        setGitHubOutput('fingerprint', result.hash)
        setGitHubOutput(
          'cache-key',
          createCacheKey({
            platform,
            fingerprint: result.hash,
            prefix: options.prefix,
          })
        )
      }

      if (options.json) {
        console.info(JSON.stringify(result, null, 2))
      } else {
        console.info(result.hash)
      }
      break
    }

    case 'fingerprint-test': {
      const CACHE_FILE = '.fingerprint-cache.json'

      console.info('Generating fingerprints...\n')

      const iosResult = await generateFingerprint({ platform: 'ios', projectRoot: options.projectRoot })
      const androidResult = await generateFingerprint({ platform: 'android', projectRoot: options.projectRoot })

      const iosFingerprint = iosResult.hash
      const androidFingerprint = androidResult.hash

      console.info('Current fingerprints:')
      console.info(`  iOS:     ${iosFingerprint}`)
      console.info(`  Android: ${androidFingerprint}`)
      console.info('')

      const cache = loadCache(CACHE_FILE)

      if (cache?.ios && cache?.android) {
        console.info('Previous fingerprints (from cache):')
        console.info(`  iOS:     ${cache.ios}`)
        console.info(`  Android: ${cache.android}`)
        console.info('')

        const iosChanged = cache.ios !== iosFingerprint
        const androidChanged = cache.android !== androidFingerprint

        if (iosChanged || androidChanged) {
          console.info('Fingerprints changed!')
          if (iosChanged) console.info('   - iOS fingerprint changed (would trigger iOS rebuild)')
          if (androidChanged) console.info('   - Android fingerprint changed (would trigger Android rebuild)')
        } else {
          console.info('Fingerprints match - no rebuild needed')
        }
      } else {
        console.info('No previous fingerprints cached.')
      }

      // Save current fingerprints
      saveCache(CACHE_FILE, { ios: iosFingerprint, android: androidFingerprint, timestamp: new Date().toISOString() })
      console.info(`\nSaved fingerprints to ${CACHE_FILE}`)

      console.info(`
To test cache invalidation:
  1. Add a native dependency:    yarn add react-native-mmkv
  2. Run this script again:      native-ci fingerprint-test
  3. Fingerprints should change!
  4. Remove the dependency:      yarn remove react-native-mmkv
  5. Run this script again - fingerprints should match original
`)
      break
    }

    case 'pre-hash': {
      const files = [subcommand, ...args].filter(Boolean)
      if (files.length === 0) {
        console.error('Error: at least one file required')
        process.exit(1)
      }

      const hash = generatePreFingerprintHash(files, options.projectRoot)

      if (options.githubOutput || isGitHubActions()) {
        setGitHubOutput('pre-fingerprint-hash', hash)
      }

      if (options.json) {
        console.info(JSON.stringify({ hash, files }, null, 2))
      } else {
        console.info(hash)
      }
      break
    }

    case 'cache-key': {
      const platform = validatePlatform(subcommand)
      const fingerprint = args[0]

      if (!fingerprint) {
        console.error('Error: fingerprint is required')
        process.exit(1)
      }

      const cacheKey = createCacheKey({
        platform,
        fingerprint,
        prefix: options.prefix,
      })

      if (options.githubOutput || isGitHubActions()) {
        setGitHubOutput('cache-key', cacheKey)
      }

      console.info(cacheKey)
      break
    }

    // ========================================
    // KV Store Commands
    // ========================================
    case 'kv-get': {
      const key = subcommand
      if (!key) {
        console.error('Error: key is required')
        process.exit(1)
      }

      const kv = getKVCredentials()
      const value = await getFingerprintFromKV(kv, key)

      if (options.githubOutput || isGitHubActions()) {
        setGitHubOutput('value', value || '')
        setGitHubOutput('found', value ? 'true' : 'false')
      }

      if (value) {
        console.info(value)
      } else {
        process.exit(1)
      }
      break
    }

    case 'kv-set': {
      const key = subcommand
      const value = args[0]

      if (!key || !value) {
        console.error('Error: key and value are required')
        process.exit(1)
      }

      const kv = getKVCredentials()
      await saveFingerprintToKV(kv, key, value)
      console.info('OK')
      break
    }

    default:
      console.error(`Unknown command: ${command}`)
      console.info(HELP)
      process.exit(1)
  }
} catch (error) {
  console.error('Error:', (error as Error).message)
  process.exit(1)
}
