import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src/TestComponent.tsx')
const CSS = join(ROOT, 'src/_TestComponent.css')
const OUTPUT_CSS = join(ROOT, 'public/tamagui.generated.css')
const TAMAGUI = 'node ../../core/cli/dist/index.cjs'

const ORIGINAL_CONTENT = `import { View, Text, styled } from '@tamagui/core'
import { useState } from 'react'

const YStack = styled(View, { flexDirection: 'column' })
const Button = styled(View, {
  render: 'button',
  padding: '$3',
  backgroundColor: '$blue10',
  borderRadius: '$4',
  cursor: 'pointer',
  pressStyle: { opacity: 0.8 },
})

export function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$4"
      padding="$4"
      backgroundColor="$background"
    >
      <Text color="$color12" fontSize="$8" fontWeight="bold">
        Tamagui + Turbopack
      </Text>
      <Text color="$color10">Count: {count}</Text>
      <Button onPress={() => setCount((c) => c + 1)}>
        <Text color="white">Increment</Text>
      </Button>
      <YStack
        padding="$4"
        backgroundColor="$blue5"
        borderRadius="$4"
        $sm={{ backgroundColor: '$red5' }}
      >
        <Text>Media query test (blue on lg, red on sm)</Text>
      </YStack>
    </YStack>
  )
}
`

function reset() {
  writeFileSync(SRC, ORIGINAL_CONTENT)
  if (existsSync(CSS)) unlinkSync(CSS)
}

describe('Turbopack + Tamagui CLI optimization', () => {
  beforeEach(() => reset())
  afterEach(() => reset())
  afterAll(() => reset())

  it('CLI optimization flattens Text to span with className', () => {
    execSync(`${TAMAGUI} build --target web ./src/TestComponent.tsx`, {
      cwd: ROOT,
      stdio: 'pipe',
    })

    const optimized = readFileSync(SRC, 'utf-8')

    // CSS import at top
    expect(optimized.split('\n')[0]).toBe('import "./_TestComponent.css"')

    // static text is flattened with the shared compiler's direct class string.
    expect(optimized).toContain('<span className="')
    expect(optimized).not.toContain('_cn')

    // Tamagui press events retain the runtime component so onPress is mapped
    // to the correct platform event rather than leaking onto a DOM element.
    expect(optimized).toContain('<Button onPress=')

    // Original <Text ...> JSX should be replaced
    expect(optimized).not.toMatch(/<Text color=/)
  }, 30000)

  it('CLI generates atomic CSS file', () => {
    execSync(`${TAMAGUI} build --target web ./src/TestComponent.tsx`, {
      cwd: ROOT,
      stdio: 'pipe',
    })

    expect(existsSync(CSS)).toBe(true)
    const css = readFileSync(CSS, 'utf-8')

    // Atomic class rules
    expect(css).toMatch(/\._[\w-]+\s*\{/)

    // Contains expected style properties
    expect(css).toContain('color:')
    expect(css).toContain('font-size:')
    expect(css).toContain('font-weight:')
  }, 30000)

  it('prod build optimizes for Turbopack and restores source', () => {
    const outputCSSBefore = readFileSync(OUTPUT_CSS, 'utf-8')
    const result = execSync(`bun run build:turbopack`, {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    expect(result).toContain('Generating static pages')
    expect(readFileSync(SRC, 'utf-8')).toBe(ORIGINAL_CONTENT)
    expect(readFileSync(OUTPUT_CSS, 'utf-8')).toBe(outputCSSBefore)
    expect(existsSync(CSS)).toBe(false)
  }, 120000)

  it('restores source when the wrapped command fails', () => {
    const outputCSSBefore = readFileSync(OUTPUT_CSS, 'utf-8')
    expect(() =>
      execSync(`${TAMAGUI} build --target web ./src/TestComponent.tsx -- sh -c false`, {
        cwd: ROOT,
        stdio: 'pipe',
      })
    ).toThrow()
    expect(readFileSync(SRC, 'utf-8')).toBe(ORIGINAL_CONTENT)
    expect(readFileSync(OUTPUT_CSS, 'utf-8')).toBe(outputCSSBefore)
    expect(existsSync(CSS)).toBe(false)
  }, 30000)

  it('restores source when compiler acceptance fails before the command', () => {
    const outputCSSBefore = readFileSync(OUTPUT_CSS, 'utf-8')
    expect(() =>
      execSync(
        `${TAMAGUI} build --target web --expect-optimizations 999 ./src/TestComponent.tsx -- sh -c true`,
        { cwd: ROOT, stdio: 'pipe' }
      )
    ).toThrow()
    expect(readFileSync(SRC, 'utf-8')).toBe(ORIGINAL_CONTENT)
    expect(readFileSync(OUTPUT_CSS, 'utf-8')).toBe(outputCSSBefore)
    expect(existsSync(CSS)).toBe(false)
  }, 30000)

  it('restores source before exiting on a termination signal', async () => {
    const outputCSSBefore = readFileSync(OUTPUT_CSS, 'utf-8')
    const child = spawn(
      'node',
      [
        '../../core/cli/dist/index.cjs',
        'build',
        '--target',
        'web',
        './src/TestComponent.tsx',
        '--',
        'sleep',
        '30',
      ],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
    )
    await new Promise<void>((resolveRunning, rejectRunning) => {
      let output = ''
      const onData = (chunk: Buffer) => {
        output += chunk.toString()
        if (output.includes('Running:')) resolveRunning()
      }
      child.stdout.on('data', onData)
      child.stderr.on('data', onData)
      child.once('error', rejectRunning)
      child.once('exit', (code, signal) => {
        rejectRunning(
          new Error(`CLI exited before the wrapped command ran: ${code ?? signal}`)
        )
      })
    })

    const exit = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
      (resolveExit) => {
        child.once('exit', (code, signal) => resolveExit({ code, signal }))
      }
    )
    child.kill('SIGTERM')
    const status = await exit

    expect(status.signal === 'SIGTERM' || status.code === 143).toBe(true)
    expect(readFileSync(SRC, 'utf-8')).toBe(ORIGINAL_CONTENT)
    expect(readFileSync(OUTPUT_CSS, 'utf-8')).toBe(outputCSSBefore)
    expect(existsSync(CSS)).toBe(false)
  }, 30000)

  it('reset properly restores original file', () => {
    // Optimize
    execSync(`${TAMAGUI} build --target web ./src/TestComponent.tsx`, {
      cwd: ROOT,
      stdio: 'pipe',
    })
    expect(existsSync(CSS)).toBe(true)
    expect(readFileSync(SRC, 'utf-8')).toContain('.css')

    // Reset
    reset()

    // Verify clean state
    expect(existsSync(CSS)).toBe(false)
    expect(readFileSync(SRC, 'utf-8')).toBe(ORIGINAL_CONTENT)
  }, 30000)
})
