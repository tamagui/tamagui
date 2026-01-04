import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src/TestComponent.tsx')
const CSS = join(ROOT, 'src/_TestComponent.css')

const ORIGINAL_CONTENT = `import { Stack, Text, styled } from '@tamagui/core'
import { useState } from 'react'

const YStack = styled(Stack, { flexDirection: 'column' })
const Button = styled(Stack, {
  tag: 'button',
  padding: '$3',
  backgroundColor: '$blue10',
  borderRadius: '$4',
  cursor: 'pointer',
  pressStyle: { opacity: 0.8 },
})

export function TestComponent() {
  const [count, setCount] = useState(0)

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$4" padding="$4" backgroundColor="$background">
      <Text color="$color12" fontSize="$8" fontWeight="bold">Tamagui + Turbopack</Text>
      <Text color="$color10">Count: {count}</Text>
      <Button onPress={() => setCount(c => c + 1)}>
        <Text color="white">Increment</Text>
      </Button>
      <YStack padding="$4" backgroundColor="$blue5" borderRadius="$4" $sm={{ backgroundColor: '$red5' }}>
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
    execSync(`npx tamagui build --target web ./src`, { cwd: ROOT, stdio: 'pipe' })

    const optimized = readFileSync(SRC, 'utf-8')

    // CSS import at top
    expect(optimized.split('\n')[0]).toBe('import "./_TestComponent.css"')

    // Text components flattened to <span className={...}>
    expect(optimized).toContain('<span className={')
    expect(optimized).toContain('_cn')

    // Original <Text ...> JSX should be replaced
    expect(optimized).not.toMatch(/<Text color=/)
  })

  it('CLI generates atomic CSS file', () => {
    execSync(`npx tamagui build --target web ./src`, { cwd: ROOT, stdio: 'pipe' })

    expect(existsSync(CSS)).toBe(true)
    const css = readFileSync(CSS, 'utf-8')

    // Atomic class rules
    expect(css).toMatch(/\._[\w-]+\s*\{/)

    // Contains expected style properties
    expect(css).toContain('color:')
    expect(css).toContain('font-size:')
    expect(css).toContain('font-weight:')
  })

  it('prod build works after CLI optimization', () => {
    execSync(`npx tamagui build --target web ./src`, { cwd: ROOT, stdio: 'pipe' })
    const result = execSync(`yarn next-build`, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' })
    expect(result).toContain('Generating static pages')
  }, 120000)

  it('reset properly restores original file', () => {
    // Optimize
    execSync(`npx tamagui build --target web ./src`, { cwd: ROOT, stdio: 'pipe' })
    expect(existsSync(CSS)).toBe(true)
    expect(readFileSync(SRC, 'utf-8')).toContain('.css')

    // Reset
    reset()

    // Verify clean state
    expect(existsSync(CSS)).toBe(false)
    expect(readFileSync(SRC, 'utf-8')).toBe(ORIGINAL_CONTENT)
  })
})
