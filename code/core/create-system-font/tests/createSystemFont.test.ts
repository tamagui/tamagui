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
  it('uses web defaults from the package', async () => {
    const { createSystemFont, systemFontFamily } = await loadPackage('web')
    const font = createSystemFont()

    expect(font.family).toBe(systemFontFamily.web)
    expect(font.size[4]).toBe(14)
    expect(font.lineHeight[4]).toBe(22)
    expect(font.weight[4]).toBe('400')
  })

  it('uses native defaults when targeting native', async () => {
    const { createSystemFont } = await loadPackage('native')
    const font = createSystemFont()

    expect(font.family).toBe('System')
    expect(font.size[4]).toBe(17)
    expect(font.lineHeight[4]).toBe(24)
  })

  // the hand written tables these replaced stepped 30 -> 40 from 9 to 10 on web,
  // a 33% jump between two 15% ones, and 12 -> 15 from 2 to 3 on native
  it.each(['web', 'native'] as const)('steps %s sizes evenly', async (target) => {
    const { createSystemFont } = await loadPackage(target)
    const { size } = createSystemFont()
    const steps = Array.from({ length: 15 }, (_, i) => size[i + 2] / size[i + 1])

    expect(Math.max(...steps)).toBeLessThan(1.21)
    // monotonic, and no step more than half again the one before it
    steps.forEach((step, i) => {
      expect(step).toBeGreaterThan(1)
      if (i > 0) expect(step / steps[i - 1]).toBeLessThan(1.5)
    })
  })

  it('keeps the v5 scales pinned so a v5 app does not resize', async () => {
    const { v5SystemFontSizes, v5SystemFontLineHeight } = await loadPackage('web')

    expect(v5SystemFontSizes[4]).toBe(15)
    expect(v5SystemFontSizes[10]).toBe(40)
    expect(v5SystemFontLineHeight(15)).toBe(23)
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
