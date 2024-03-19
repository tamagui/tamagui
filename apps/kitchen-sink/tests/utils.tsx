import type { Locator } from '@playwright/test'

export async function getStyles(locator: Locator) {
  return await locator.evaluate((el) => {
    return window.getComputedStyle(el)
  })
}

type InteractionOpts = {
  delay?: number
}

export async function whilePressed<A>(
  locator: Locator,
  cb: () => Promise<A>,
  opts?: InteractionOpts
) {
  const delay = opts?.delay ?? 1000
  const promise = locator.click({
    force: true,
    ...opts,
  })
  await new Promise((res) => setTimeout(res, delay - 150))
  const res = await cb()
  await promise
  return res
}

export async function whileHovered<A>(locator: Locator, cb: () => Promise<A>) {
  await locator.hover({
    force: true,
  })
  return await cb()
}

export async function getPressStyle(locator: Locator, opts?: InteractionOpts) {
  return await whilePressed(
    locator,
    async () => {
      return await getStyles(locator)
    },
    opts
  )
}

export async function getHoverStyle(locator: Locator) {
  return await whileHovered(locator, async () => {
    return await getStyles(locator)
  })
}
