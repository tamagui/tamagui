import { Locator } from '@playwright/test'

export async function getStyles(locator: Locator) {
  return await locator.evaluate((el) => {
    return window.getComputedStyle(el)
  })
}

export async function whilePressed(locator: Locator, cb: () => Promise<void>) {
  const promise = locator.click({
    delay: 1000,
    force: true,
  })
  await new Promise((res) => setTimeout(res, 300))
  await cb()
  await promise
}
