import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test('probe listitem bg', async ({ page }) => {
  await setupPage(page, { name: 'ThemedListItem', type: 'useCase' })
  const info = await page.evaluate(() => {
    const e = document.querySelector('#themed-list-item-default') as HTMLElement
    if (!e) return null
    const cls = e.className
    const bgClasses = cls.split(' ').filter((c) => c.startsWith('_bg') || c.startsWith('_bc'))
    const rules: string[] = []
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          const text = (rule as CSSStyleRule).cssText || ''
          for (const bc of bgClasses) {
            if (text.includes(bc)) rules.push(text.slice(0, 120))
          }
        }
      } catch {}
    }
    return {
      cls,
      inline: e.getAttribute('style'),
      bg: getComputedStyle(e).backgroundColor,
      bgClasses,
      matchingRules: rules,
    }
  })
  console.log('PROBE', JSON.stringify(info, null, 1))
  expect(info).toBeTruthy()
})
