import { vi } from 'vitest'

export const NativeModules = {
  TamaguiStyleRegistry: {
    register: vi.fn(),
    unregister: vi.fn(),
    setTheme: vi.fn(),
    setThemeForScope: vi.fn(),
    createScope: vi.fn().mockReturnValue('mock_scope_1'),
    getStats: vi.fn().mockReturnValue({ viewCount: 0, scopeCount: 1, currentTheme: 'light' }),
  },
}

export const Platform = {
  OS: 'ios',
}
