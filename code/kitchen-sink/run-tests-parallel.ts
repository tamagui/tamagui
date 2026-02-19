#!/usr/bin/env bun
import { spawn } from 'bun'

const DRIVERS = ['css', 'native', 'reanimated', 'motion'] as const
const COLORS = {
  css: '\x1b[36m', // cyan
  native: '\x1b[33m', // yellow
  reanimated: '\x1b[35m', // magenta
  motion: '\x1b[32m', // green
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  dim: '\x1b[2m',
}

async function runPlaywright(args: string[], env?: Record<string, string>) {
  const proc = spawn({
    cmd: [
      'node',
      '-r',
      'esbuild-register',
      '../../node_modules/.bin/playwright',
      'test',
      ...args,
    ],
    cwd: import.meta.dir,
    env: { ...process.env, NODE_ENV: 'test', ...env },
    stdout: 'inherit',
    stderr: 'inherit',
  })
  return proc.exited
}

async function runDriver(
  driver: string
): Promise<{ driver: string; code: number; output: string[] }> {
  const output: string[] = []
  const color = COLORS[driver as keyof typeof COLORS] || ''

  const proc = spawn({
    cmd: [
      'node',
      '-r',
      'esbuild-register',
      '../../node_modules/.bin/playwright',
      'test',
      `--project=animated-${driver}`,
    ],
    cwd: import.meta.dir,
    env: { ...process.env, NODE_ENV: 'test', TAMAGUI_TEST_ANIMATION_DRIVER: driver },
    stdout: 'pipe',
    stderr: 'pipe',
  })

  // stream stdout with prefix
  const streamWithPrefix = async (
    stream: ReadableStream<Uint8Array>,
    isError = false
  ) => {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          const prefixed = isError
            ? `${color}[${driver}]${COLORS.reset} ${COLORS.red}${line}${COLORS.reset}`
            : `${color}[${driver}]${COLORS.reset} ${line}`
          console.log(prefixed)
          output.push(line)
        }
      }
    }

    // flush remaining buffer
    if (buffer.trim()) {
      output.push(buffer)
      console.log(`${color}[${driver}]${COLORS.reset} ${buffer}`)
    }
  }

  const stdoutDone = streamWithPrefix(proc.stdout)
  const stderrDone = streamWithPrefix(proc.stderr, true)

  const [code] = await Promise.all([proc.exited, stdoutDone, stderrDone])
  return { driver, code, output }
}

async function main() {
  console.log(`${COLORS.dim}Running default + webkit tests...${COLORS.reset}\n`)

  // run default and webkit first
  const defaultCode = await runPlaywright(['--project=default', '--project=webkit'])
  if (defaultCode !== 0) {
    console.error(`\n${COLORS.red}Default/webkit tests failed${COLORS.reset}`)
    process.exit(1)
  }

  console.log(
    `\n${COLORS.dim}Running animated tests in parallel (${DRIVERS.join(', ')})...${COLORS.reset}\n`
  )

  // run all animated drivers in parallel
  const results = await Promise.all(DRIVERS.map(runDriver))

  // summary
  console.log(`\n${COLORS.dim}${'─'.repeat(60)}${COLORS.reset}`)
  console.log('Summary:')

  let failed = false
  for (const { driver, code } of results) {
    const color = COLORS[driver as keyof typeof COLORS] || ''
    const status =
      code === 0
        ? `${COLORS.green}✓ passed${COLORS.reset}`
        : `${COLORS.red}✗ failed (exit ${code})${COLORS.reset}`
    console.log(`  ${color}${driver}${COLORS.reset}: ${status}`)
    if (code !== 0) failed = true
  }

  if (failed) {
    console.error(`\n${COLORS.red}Some tests failed${COLORS.reset}`)
    process.exit(1)
  }

  console.log(`\n${COLORS.green}All tests passed${COLORS.reset}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
