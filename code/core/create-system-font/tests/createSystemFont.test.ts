import { afterEach, describe, expect, it, vi } from 'vitest'

const loadPackage = async (target: 'web' | 'native') => {
  vi.resetModules()
  process.env.TAMAGUI_TARGET = target
  return await import('../src')
}

afterEach(() => {
  delete process.env.TAMAGUI_TARGET
})

describe('createSystemFont', () => {
  it('uses v5 web defaults from the package', async () => {
    const { createSystemFont, systemFontFamily } = await loadPackage('web')
    const font = createSystemFont()

    expect(font.family).toBe(systemFontFamily.web)
    expect(font.size[4]).toBe(15)
    expect(font.lineHeight[4]).toBe(23)
    expect(font.weight[4]).toBe('400')
  })

  it('uses native defaults when targeting native', async () => {
    const { createSystemFont } = await loadPackage('native')
    const font = createSystemFont()

    expect(font.family).toBe('System')
    expect(font.size[4]).toBe(17)
    expect(font.lineHeight[4]).toBe(22)
  })

  it('allows config versions to pass their own defaults', async () => {
    const { createSystemFont } = await loadPackage('web')
    const font = createSystemFont({
      sizes: {
        1: 11,
        4: 14,
        true: 14,
      },
      sizeLineHeight: (size) => size + 10,
      sizeSize: (size) => size,
      weight: {
        4: '300',
      },
    })

    expect(font.size[4]).toBe(14)
    expect(font.lineHeight[4]).toBe(24)
    expect(font.weight[4]).toBe('300')
  })
})
