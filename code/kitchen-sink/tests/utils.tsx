import { expect, type Locator } from '@playwright/test'

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
  _opts?: InteractionOpts
) {
  // use explicit mouse.down/up instead of click({ delay }) for reliable
  // pressed state testing - click timing is imprecise on slow CI
  const box = await locator.boundingBox()
  if (!box) throw new Error('Element not visible')
  const page = locator.page()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.waitForTimeout(150)
  const res = await cb()
  await page.mouse.up()
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

// a moving element sampled per rAF: distance between consecutive samples cannot
// tell a teleport from a delayed callback, and CI runs several browser projects
// at once. velocity keeps the original 150px-per-60Hz-frame boundary without
// depending on the frame rate the runner actually delivered.
//
// this metric is not just guarding against a hypothetical. it caught a real
// spring stepped with a negative time delta on a loaded runner, which put the
// tooltip at translate -33,554,430px for a frame; see the clock guard in
// animations-reanimated's applyAnimation. TooltipStarvedFrames reproduces that
// starvation on demand with cpu throttling.
const NOMINAL_FRAME_MS = 1000 / 60
export const TELEPORT_VELOCITY = 150 / NOMINAL_FRAME_MS

export type PositionSample = { at: number; tx: number }

export function getMaxPositionVelocity(samples: PositionSample[]) {
  let maxVelocity = 0
  for (let i = 1; i < samples.length; i++) {
    const elapsed = samples[i].at - samples[i - 1].at
    if (elapsed > 0) {
      maxVelocity = Math.max(
        maxVelocity,
        Math.abs(samples[i].tx - samples[i - 1].tx) / elapsed
      )
    }
  }
  return maxVelocity
}

export function expectNoTeleport(samples: PositionSample[]) {
  expect(samples.length).toBeGreaterThan(1)

  // negative control: the metric must still reject the 150px-in-one-frame jump
  // these regression tests were written to catch
  expect(
    getMaxPositionVelocity([
      { at: 0, tx: 0 },
      { at: NOMINAL_FRAME_MS, tx: 151 },
    ])
  ).toBeGreaterThan(TELEPORT_VELOCITY)

  const maxVelocity = getMaxPositionVelocity(samples)
  expect(maxVelocity, `tooltip moved at ${maxVelocity.toFixed(2)}px/ms`).toBeLessThan(
    TELEPORT_VELOCITY
  )
}
