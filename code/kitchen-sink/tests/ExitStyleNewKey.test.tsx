import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// a style key first introduced by exitStyle (borderWidth / y here, no base
// value) must animate over the exit duration and gate exit completion. the
// regression unmounted the element in the same cycle because such keys were
// emitted as plain values and excluded from the pending exit key set.
test('exitStyle-introduced keys animate and hold unmount for the exit duration', async ({
  page,
}) => {
  await setupPage(page, {
    name: 'ExitStyleNewKeyCase',
    type: 'useCase',
    searchParams: { animationDriver: 'reanimated' },
  })

  const target = page.locator('#exit-new-key-target')
  await expect(target).toBeVisible()

  const result = await page.evaluate(async () => {
    const hide = document.querySelector<HTMLElement>('[data-testid="exit-new-key-hide"]')!
    hide.click()
    const samples: Array<{ t: number; borderWidth: number; y: number }> = []
    const startedAt = performance.now()
    let mountedAt150 = false
    do {
      await new Promise(requestAnimationFrame)
      const el = document.getElementById('exit-new-key-target')
      const elapsed = performance.now() - startedAt
      if (el) {
        if (elapsed >= 120) mountedAt150 = true
        const cs = getComputedStyle(el)
        const matrix = cs.transform !== 'none' ? new DOMMatrix(cs.transform) : null
        samples.push({
          t: Math.round(elapsed),
          borderWidth: Number.parseFloat(cs.borderTopWidth) || 0,
          y: matrix ? matrix.m42 : 0,
        })
      }
    } while (performance.now() - startedAt < 1500)
    const el = document.getElementById('exit-new-key-target')
    return { samples, mountedAt150, mountedAtEnd: !!el }
  })

  // the exit duration (300ms) must be respected: still mounted mid-exit,
  // unmounted once complete
  expect(result.mountedAt150).toBe(true)
  expect(result.mountedAtEnd).toBe(false)

  // the exitStyle-introduced keys must actually animate: intermediate values
  // strictly between the implicit start (0) and the exit target
  expect(
    result.samples.some(({ borderWidth }) => borderWidth > 0.5 && borderWidth < 9.5),
    JSON.stringify(result.samples.slice(0, 25))
  ).toBe(true)
  expect(result.samples.some(({ y }) => y > 2 && y < 38)).toBe(true)
})
