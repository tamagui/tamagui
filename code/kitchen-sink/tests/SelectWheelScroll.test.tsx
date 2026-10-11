import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// the open list scrolls natively under a wheel and keeps its size and place.
// the old macOS-style grow path intercepted each wheel event, grew the list
// instead of scrolling it, and flushSync'd a render of the whole select per event
test('wheel scrolls the open list natively', async ({ page }) => {
  // short enough that the list opens with hidden items above and below
  await page.setViewportSize({ width: 1280, height: 700 })
  await setupPage(page, { name: 'Select', type: 'demo' })

  await page.locator('#select-demo-1').click()
  const viewport = page.locator('[data-select-viewport][role=listbox]')
  await viewport.waitFor()
  await page.waitForTimeout(400)

  const read = () =>
    viewport.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return {
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        scrollTop: el.scrollTop,
        maxScroll: el.scrollHeight - el.clientHeight,
      }
    })

  const start = await read()
  expect(start.maxScroll).toBeGreaterThan(200)

  const box = (await viewport.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(100)

  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 40)
    await page.waitForTimeout(16)
  }
  await page.waitForTimeout(200)

  const scrolled = await read()
  expect(scrolled.scrollTop).toBeGreaterThanOrEqual(200)
  expect(scrolled.top).toBe(start.top)
  expect(scrolled.height).toBe(start.height)
})
