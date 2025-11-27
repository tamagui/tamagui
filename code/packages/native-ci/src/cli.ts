#!/usr/bin/env node

import { generateFingerprint, generatePreFingerprintHash } from './fingerprint'
import {
  createCacheKey,
  saveFingerprintToKV,
  getFingerprintFromKV,
  extendKVTTL,
} from './cache'
import { setGitHubOutput, isGitHubActions } from './runner'

const HELP = `
native-ci - Native CI/CD helpers for Expo apps

Commands:
  fingerprint <platform>     Generate native build fingerprint
  pre-hash <files...>        Generate quick pre-fingerprint hash
  cache-key <platform> <fp>  Generate cache key from fingerprint

Options:
  --project-root <path>      Project root directory (default: cwd)
  --prefix <prefix>          Cache key prefix (default: native-build)
  --github-output            Output results for GitHub Actions
  --json                     Output as JSON
  --help                     Show this help message

Environment:
  KV_STORE_REDIS_REST_URL    Redis REST API URL for fingerprint caching
  KV_STORE_REDIS_REST_TOKEN  Redis REST API token

Examples:
  native-ci fingerprint ios
  native-ci fingerprint android --github-output
  native-ci pre-hash yarn.lock app.json
  native-ci cache-key ios abc123def456
`

interface ParsedArgs {
  command: string
  args: string[]
  options: {
    projectRoot: string
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
    args: args.slice(1),
    options,
  }
}

async function main(): Promise<void> {
  const { command, args, options } = parseArgs(process.argv.slice(2))

  if (options.help || !command) {
    console.info(HELP)
    process.exit(options.help ? 0 : 1)
  }

  try {
    switch (command) {
      case 'fingerprint': {
        const platform = args[0] as 'ios' | 'android'
        if (!platform || !['ios', 'android'].includes(platform)) {
          console.error('Error: platform must be "ios" or "android"')
          process.exit(1)
        }

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

      case 'pre-hash': {
        if (args.length === 0) {
          console.error('Error: at least one file required')
          process.exit(1)
        }

        const hash = generatePreFingerprintHash(args, options.projectRoot)

        if (options.githubOutput || isGitHubActions()) {
          setGitHubOutput('pre-fingerprint-hash', hash)
        }

        if (options.json) {
          console.info(JSON.stringify({ hash, files: args }, null, 2))
        } else {
          console.info(hash)
        }
        break
      }

      case 'cache-key': {
        const platform = args[0] as 'ios' | 'android'
        const fingerprint = args[1]

        if (!platform || !['ios', 'android'].includes(platform)) {
          console.error('Error: platform must be "ios" or "android"')
          process.exit(1)
        }

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

      case 'kv-get': {
        const key = args[0]
        if (!key) {
          console.error('Error: key is required')
          process.exit(1)
        }

        const url = process.env.KV_STORE_REDIS_REST_URL
        const token = process.env.KV_STORE_REDIS_REST_TOKEN

        if (!url || !token) {
          console.error(
            'Error: KV_STORE_REDIS_REST_URL and KV_STORE_REDIS_REST_TOKEN required'
          )
          process.exit(1)
        }

        const value = await getFingerprintFromKV({ url, token }, key)

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
        const key = args[0]
        const value = args[1]

        if (!key || !value) {
          console.error('Error: key and value are required')
          process.exit(1)
        }

        const url = process.env.KV_STORE_REDIS_REST_URL
        const token = process.env.KV_STORE_REDIS_REST_TOKEN

        if (!url || !token) {
          console.error(
            'Error: KV_STORE_REDIS_REST_URL and KV_STORE_REDIS_REST_TOKEN required'
          )
          process.exit(1)
        }

        await saveFingerprintToKV({ url, token }, key, value)
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
}

main()
