import { expect, test } from '@playwright/test'

type ThemeValues = {
  background: string
  color: string
}

type Receipt = {
  inputThemeNameCount: number
  inputThemeValueCount: number
  rebuiltThemeNameCount: number
  rebuilt: { light: ThemeValues; dark: ThemeValues }
  artifact: { light: ThemeValues; dark: ThemeValues }
}

const asColor = async (page: import('@playwright/test').Page, value: string) =>
  page.evaluate((color) => {
    const probe = document.createElement('span')
    probe.style.color = color
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).color
    probe.remove()
    return computed
  }, value)

test('empty client themes hydrate their values from the outputCSS artifact', async ({
  page,
}) => {
  await page.goto('/global-hydration.html')
  await page.waitForFunction(() => Boolean((window as any).__globalHydration))
  const receipt: Receipt = await page.evaluate(() => (window as any).__globalHydration)

  // the browser config received no theme names or values from JavaScript
  expect(receipt.inputThemeNameCount).toBe(0)
  expect(receipt.inputThemeValueCount).toBe(0)

  expect(receipt.rebuiltThemeNameCount).toBeGreaterThan(0)
  expect(Object.values(receipt.rebuilt.light).every(Boolean)).toBe(true)
  expect(Object.values(receipt.rebuilt.dark).every(Boolean)).toBe(true)

  const expected = {
    light: { background: '#123456', color: '#abcdef' },
    dark: { background: '#654321', color: '#fedcba' },
  }

  for (const themeName of ['light', 'dark'] as const) {
    for (const key of ['background', 'color'] as const) {
      const expectedColor = await asColor(page, expected[themeName][key])
      expect(await asColor(page, receipt.artifact[themeName][key])).toBe(expectedColor)
      expect(await asColor(page, receipt.rebuilt[themeName][key])).toBe(expectedColor)
    }
  }
})
