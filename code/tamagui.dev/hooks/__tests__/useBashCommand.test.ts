import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useBashCommand } from '../useBashCommand'
import { renderHook } from '@testing-library/react-hooks'
import { useLocalStorageWatcher } from '../useLocalStorageWatcher'

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

  it('handles npm install command with default yarn', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('npm install @tamagui/select', 'language-bash')
    )

    expect(result.current.isInstall).toBe(true)
    expect(result.current.command).toBe('yarn add @tamagui/select')
    expect(result.current.getCode('npm install @tamagui/select')).toBe(
      'yarn add @tamagui/select'
    )
  })

  it('handles npm install command with npm selected', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'npm',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('npm install @tamagui/select', 'language-bash')
    )

    expect(result.current.isInstall).toBe(true)
    expect(result.current.command).toBe('npm install @tamagui/select')
    expect(result.current.getCode('npm install @tamagui/select')).toBe(
      'npm install @tamagui/select'
    )
  })

  it('converts npm install to yarn add with yarn selected', () => {
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

    expect(result.current.isInstall).toBe(true)
    expect(result.current.command).toBe(
      'yarn add @tamagui/core @tamagui/animations-react-native'
    )
    expect(
      result.current.getCode('npm install @tamagui/core @tamagui/animations-react-native')
    ).toBe('yarn add @tamagui/core @tamagui/animations-react-native')
  })

  it('handles yarn dlx create command', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('yarn dlx create-expo app -t basic', 'language-bash')
    )

    expect(result.current.isRun).toBe(true)
    expect(result.current.command).toBe('yarn dlx create-expo app -t basic')
    expect(result.current.getCode('yarn dlx create-expo app -t basic')).toBe(
      'yarn dlx create-expo app -t basic'
    )
  })

  it('handles yarn add command', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('yarn add tamagui', 'language-bash')
    )

    expect(result.current.isInstall).toBe(true)
    expect(result.current.command).toBe('yarn add tamagui')
    expect(result.current.getCode('yarn add tamagui')).toBe('yarn add tamagui')
  })

  it('handles pnpm create command with default yarn', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'yarn',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand(
        'pnpm create tamagui@latest --template remix-starter',
        'language-bash'
      )
    )

    expect(result.current.isCreate).toBe(true)
    expect(result.current.command).toBe(
      'yarn create tamagui@latest --template remix-starter'
    )
    expect(
      result.current.getCode('pnpm create tamagui@latest --template remix-starter')
    ).toBe('yarn create tamagui@latest --template remix-starter')
  })

  it('handles pnpm create command with pnpm selected', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'pnpm',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand(
        'pnpm create tamagui@latest --template remix-starter',
        'language-bash'
      )
    )

    expect(result.current.isCreate).toBe(true)
    expect(result.current.command).toBe(
      'pnpm create tamagui@latest --template remix-starter'
    )
    expect(
      result.current.getCode('pnpm create tamagui@latest --template remix-starter')
    ).toBe('pnpm create tamagui@latest --template remix-starter')
  })

  it('handles non-bash commands', () => {
    const { result } = renderHook(() =>
      useBashCommand('console.log("Hello, World!")', 'language-javascript')
    )

    expect(result.current.isTerminal).toBe(false)
    expect(result.current.command).toBe('console.log("Hello, World!")')
    expect(result.current.getCode('console.log("Hello, World!")')).toBe(
      'console.log("Hello, World!")'
    )
  })

  it('handles terminal commands', () => {
    const { result } = renderHook(() => useBashCommand('ls -la', 'language-bash'))

    expect(result.current.isTerminal).toBe(true)
    expect(result.current.command).toBe('ls -la')
    expect(result.current.getCode('ls -la')).toBe('ls -la')
  })

  it('does not treat non-install commands as install commands', () => {
    const { result } = renderHook(() => useBashCommand('npm run start', 'language-bash'))

    expect(result.current.isInstall).toBe(false)
    expect(result.current.isRun).toBe(false)
    expect(result.current.isTerminal).toBe(true)
  })

  it('does not treat non-run commands as run commands', () => {
    const { result } = renderHook(() =>
      useBashCommand('npm install package', 'language-bash')
    )

    expect(result.current.isRun).toBe(false)
    expect(result.current.isInstall).toBe(true)
  })

  it('does not treat non-create commands as create commands', () => {
    const { result } = renderHook(() =>
      useBashCommand('npm install create-react-app', 'language-bash')
    )

    expect(result.current.isCreate).toBe(false)
    expect(result.current.isInstall).toBe(true)
  })

  it('handles bun commands correctly', () => {
    vi.mocked(useLocalStorageWatcher).mockReturnValue({
      storageItem: 'bun',
      setItem: vi.fn(),
    })

    const { result } = renderHook(() =>
      useBashCommand('bun add package', 'language-bash')
    )

    expect(result.current.isInstall).toBe(true)
    expect(result.current.command).toBe('bun add package')
  })

  it('sets showTabs correctly for bash and non-bash commands', () => {
    const { result: bashResult } = renderHook(() =>
      useBashCommand('npm install package', 'language-bash')
    )
    expect(bashResult.current.showTabs).toBe(true)

    const { result: nonBashResult } = renderHook(() =>
      useBashCommand('console.log("Hello")', 'language-javascript')
    )
    expect(nonBashResult.current.showTabs).toBe(false)
  })

  it('handles multiple terminal commands', () => {
    const { result } = renderHook(() =>
      useBashCommand('cd project-name && touch yarn.lock', 'language-bash')
    )

    expect(result.current.isTerminal).toBe(true)
    expect(result.current.isInstall).toBe(false)
    expect(result.current.isRun).toBe(false)
    expect(result.current.isCreate).toBe(false)
    expect(result.current.command).toBe('cd project-name && touch yarn.lock')
    expect(result.current.getCode('cd project-name && touch yarn.lock')).toBe(
      'cd project-name && touch yarn.lock'
    )
  })

  it('correctly handles complex terminal commands with create and add keywords', () => {
    const { result } = renderHook(() =>
      useBashCommand(
        'npx create-expo-app MyApp && cd MyApp && yarn add expo-router && touch app/index.js',
        'language-bash'
      )
    )

    expect(result.current.isTerminal).toBe(true)
    expect(result.current.isInstall).toBe(false)
    expect(result.current.isRun).toBe(false)
    expect(result.current.isCreate).toBe(false)
    expect(result.current.command).toBe(
      'npx create-expo-app MyApp && cd MyApp && yarn add expo-router && touch app/index.js'
    )
    expect(
      result.current.getCode(
        'npx create-expo-app MyApp && cd MyApp && yarn add expo-router && touch app/index.js'
      )
    ).toBe(
      'npx create-expo-app MyApp && cd MyApp && yarn add expo-router && touch app/index.js'
    )
  })
})
