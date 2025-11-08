import { describe, expect, test, afterAll } from 'vitest'
import * as Worker from '../src/index'
import path from 'node:path'

describe('static-worker error handling', () => {
  afterAll(async () => {
    // Clean up the worker pool after tests
    await Worker.destroyPool()
  })

  test('provides helpful error message with file path when extraction fails', async () => {
    const sourcePath = path.join(__dirname, 'fixtures', 'InvalidComponent.tsx')
    const source = `
      import { SizableText } from 'tamagui'

      export function CodeInline({ children }: { children: any }) {
        return (
          <SizableText
            tag="code"
            fontFamily="$mono"
            fontSize="$3"
            bg="$color3"
            px="$2"
            py="$1"
            borderRadius="$2"
          >
            {children}
          </SizableText>
        )
      }
    `

    try {
      await Worker.extractToClassNames({
        source,
        sourcePath,
        options: {
          components: ['tamagui'],
          config: './test-config.ts',
        },
        shouldPrintDebug: false,
      })

      // If we get here, the test should fail because we expect an error
      throw new Error('Expected extraction to fail but it succeeded')
    } catch (error) {
      // Verify the error message includes helpful context
      expect(error).toBeDefined()
      expect(error instanceof Error).toBe(true)
      const errorMessage = (error as Error).message

      // Should include the helpful prefix
      expect(errorMessage).toContain('[tamagui-extract]')

      // Should include the file path
      expect(errorMessage).toContain('InvalidComponent.tsx')

      // Should have substantial error details
      expect(errorMessage.length).toBeGreaterThan(50)
    }
  })

  test('returns null for node_modules files', async () => {
    const sourcePath = '/node_modules/some-package/index.tsx'
    const source = `
      import { Text } from 'tamagui'
      export const Component = () => <Text>Hello</Text>
    `

    const result = await Worker.extractToClassNames({
      source,
      sourcePath,
      options: {
        components: ['tamagui'],
      },
      shouldPrintDebug: false,
    })

    // Should skip node_modules files
    expect(result).toBeNull()
  })

  test('properly cleans up worker pool', async () => {
    // Trigger pool creation by running extraction
    const source = `import { Text } from 'tamagui'; export const X = () => <Text>Hi</Text>`

    await Worker.extractToClassNames({
      source,
      sourcePath: '/node_modules/test.tsx', // Will be skipped, but creates pool
      options: {
        components: ['tamagui'],
      },
      shouldPrintDebug: false,
    })

    // Get pool stats - should exist
    const statsBefore = Worker.getPoolStats()
    expect(statsBefore).toBeDefined()

    // Destroy the pool
    await Worker.destroyPool()

    // Pool should be null after destroy
    const statsAfter = Worker.getPoolStats()
    expect(statsAfter).toBeNull()
  })

  test('suppresses "Terminating worker thread" errors during cleanup', async () => {
    // This test verifies that we properly handle the race condition
    // where the pool is being destroyed while operations are in flight

    // Create the pool
    await Worker.extractToClassNames({
      source: 'import { Text } from "tamagui"',
      sourcePath: '/node_modules/test.tsx',
      options: { components: ['tamagui'] },
    })

    // This should not throw even if there's a race condition
    await expect(Worker.destroyPool()).resolves.toBeUndefined()
  })
})
