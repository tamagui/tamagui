import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useBashCommand } from '../useBashCommand'
import { useLocalStorageWatcher } from '../useLocalStorageWatcher'
import { stringIsExecCommand, stringIsCreateCommand } from '../useBashCommand'

// Mock useLocalStorageWatcher
vi.mock('../useLocalStorageWatcher', () => ({
  useLocalStorageWatcher: vi.fn(),
}))

describe('useBashCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Set default mock for useLocalStorageWatcher
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('converts install commands', async () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand(
        'npm install @tamagui/core @tamagui/animations-react-native',
        'language-bash'
      )
    )

    await waitFor(() => {
      expect(result.current.isInstallCommand).toBe(true)
      expect(result.current.transformedCommand).toBe(
        'yarn add @tamagui/core @tamagui/animations-react-native'
      )
    })
  })

  it('converts create commands', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'pnpm',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand(
        'npm create tamagui@latest --template remix-starter',
        'language-bash'
      )
    )

    expect(result.current.isCreateCommand).toBe(true)
    expect(result.current.transformedCommand).toBe(
      'pnpm create tamagui@latest --template remix-starter'
    )
  })

  it('converts from alias run command to sub-command format', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('npx create-expo-app MyApp', 'language-bash')
    )

    expect(result.current.isExecCommand).toBe(true)
    expect(result.current.transformedCommand).toBe('yarn dlx create-expo-app MyApp')
  })

  it('converts from sub-command run command to alias run command', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'bun',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('pnpm dlx create-next-app my-app', 'language-bash')
    )

    expect(result.current.isExecCommand).toBe(true)
    expect(result.current.transformedCommand).toBe('bunx create-next-app my-app')
  })

  it('recognises terminal commands', () => {
    const { result } = renderHook(() =>
      useBashCommand('cd project && ls -la && touch file.txt', 'language-bash')
    )

    expect(result.current.isTerminalCommand).toBe(true)
    expect(result.current.transformedCommand).toBe(
      'cd project && ls -la && touch file.txt'
    )
  })

  it('handles non-bash commands', () => {
    const { result } = renderHook(() =>
      useBashCommand('console.log("Hello, world!")', 'language-javascript')
    )

    expect(result.current.isTerminalCommand).toBe(false)
    expect(result.current.showTabs).toBe(false)
    expect(result.current.transformedCommand).toBe('console.log("Hello, world!")')
  })

  describe('stringIsExecCommand', () => {
    it('recognizes npm exec commands', () => {
      expect(stringIsExecCommand('npx create-react-app my-app')).toBe(true)
      expect(stringIsExecCommand('npx -p @angular/cli ng new my-angular-app')).toBe(true)
      expect(stringIsExecCommand('npx create-expo-app MyApp')).toBe(true)
    })

    it('recognizes yarn exec commands', () => {
      expect(stringIsExecCommand('yarn dlx create-next-app my-next-app')).toBe(true)
      expect(stringIsExecCommand('yarn dlx -p typescript tsc')).toBe(true)
    })

    it('recognizes pnpm exec commands', () => {
      expect(stringIsExecCommand('pnpm dlx create-vite my-vite-app')).toBe(true)
      expect(stringIsExecCommand('pnpm dlx --package=typescript tsc')).toBe(true)
    })

    it('recognizes bun exec commands', () => {
      expect(stringIsExecCommand('bunx create-react-app my-react-app')).toBe(true)
      expect(stringIsExecCommand('bunx --bun vite')).toBe(true)
    })

    it('returns false for non-exec commands', () => {
      expect(stringIsExecCommand('npm install react')).toBe(false)
      expect(stringIsExecCommand('yarn add lodash')).toBe(false)
      expect(stringIsExecCommand('pnpm run build')).toBe(false)
      expect(stringIsExecCommand('bun run test')).toBe(false)
    })

    it('returns false for terminal commands', () => {
      expect(stringIsExecCommand('cd my-project')).toBe(false)
      expect(stringIsExecCommand('ls -la')).toBe(false)
      expect(stringIsExecCommand('echo "Hello, World!"')).toBe(false)
    })
  })

  describe('stringIsCreateCommand', () => {
    it('recognizes npm create commands', () => {
      expect(stringIsCreateCommand('npm create vite@latest my-vite-app')).toBe(true)
      expect(stringIsCreateCommand('npm create react-app my-react-app')).toBe(true)
    })

    it('recognizes yarn create commands', () => {
      expect(stringIsCreateCommand('yarn create next-app my-next-app')).toBe(true)
      expect(
        stringIsCreateCommand('yarn create tamagui@latest --template expo-starter')
      ).toBe(true)
    })

    it('recognizes pnpm create commands', () => {
      expect(stringIsCreateCommand('pnpm create vite my-vite-app')).toBe(true)
      expect(stringIsCreateCommand('pnpm create react-app my-react-app')).toBe(true)
    })

    it('recognizes bun create commands', () => {
      expect(stringIsCreateCommand('bun create vite my-vite-app')).toBe(true)
      expect(stringIsCreateCommand('bun create next-app my-next-app')).toBe(true)
    })

    it('returns false for non-create commands', () => {
      expect(stringIsCreateCommand('npm install react')).toBe(false)
      expect(stringIsCreateCommand('yarn add lodash')).toBe(false)
      expect(stringIsCreateCommand('pnpm run build')).toBe(false)
      expect(stringIsCreateCommand('bun run test')).toBe(false)
    })

    it('returns false for exec commands', () => {
      expect(stringIsCreateCommand('npx create-expo-app MyApp')).toBe(false)
      expect(stringIsCreateCommand('yarn dlx create-next-app my-app')).toBe(false)
      expect(stringIsCreateCommand('pnpm dlx create-vite my-app')).toBe(false)
      expect(stringIsCreateCommand('bunx create-react-app my-app')).toBe(false)
    })

    it('returns false for terminal commands', () => {
      expect(stringIsCreateCommand('cd my-project')).toBe(false)
      expect(stringIsCreateCommand('ls -la')).toBe(false)
      expect(stringIsCreateCommand('echo "Hello, World!"')).toBe(false)
    })
  })
})
