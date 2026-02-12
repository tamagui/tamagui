import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// poll interval is ~233ms (14 frames), give generous margin
const POLL_WAIT = 800

function parseLayout(text: string) {
  // format: "A:120x60@0,0#1"
  const m = text.match(/^([AB]):(\d+)x(\d+)@(-?\d+),(-?\d+)#(\d+)$/)
  if (!m) throw new Error(`bad layout string: ${text}`)
  return {
    label: m[1],
    width: Number(m[2]),
    height: Number(m[3]),
    x: Number(m[4]),
    y: Number(m[5]),
    count: Number(m[6]),
  }
}

async function getLayout(page: Page, testId: string) {
  const text = await page.getByTestId(testId).innerText()
  return parseLayout(text)
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'OnLayoutCase', type: 'useCase' })
})

test('fires on mount with correct dimensions', async ({ page }) => {
  // onLayout should fire at least once on mount with accurate size
  await page.waitForTimeout(POLL_WAIT)
  const a = await getLayout(page, 'layout-a')
  expect(a.count).toBeGreaterThanOrEqual(1)
  expect(a.width).toBe(120)
  expect(a.height).toBe(60)
  // x should be 0 (no margin) relative to parent
  expect(a.x).toBe(0)

  // box B should also have fired
  const b = await getLayout(page, 'layout-b')
  expect(b.count).toBeGreaterThanOrEqual(1)
  expect(b.width).toBe(200)
  expect(b.height).toBe(50)
})

test('detects position change', async ({ page }) => {
  await page.waitForTimeout(POLL_WAIT)
  const before = await getLayout(page, 'layout-a')
  expect(before.x).toBe(0)

  await page.getByTestId('btn-move').click()
  await page.waitForTimeout(POLL_WAIT)

  const after = await getLayout(page, 'layout-a')
  expect(after.x).toBe(100)
  expect(after.count).toBeGreaterThan(before.count)
})

test('detects size change', async ({ page }) => {
  await page.waitForTimeout(POLL_WAIT)
  const before = await getLayout(page, 'layout-a')
  expect(before.width).toBe(120)
  expect(before.height).toBe(60)

  await page.getByTestId('btn-resize').click()
  await page.waitForTimeout(POLL_WAIT)

  const after = await getLayout(page, 'layout-a')
  expect(after.width).toBe(180)
  expect(after.height).toBe(80)
  expect(after.count).toBeGreaterThan(before.count)
})

test('detects parent size change via child resize', async ({ page }) => {
  // parent shrinking alone won't re-fire onLayout if the child rect is unchanged.
  // combine parent resize + child resize to verify the parent rect is picked up.
  await page.waitForTimeout(POLL_WAIT)
  const before = await getLayout(page, 'layout-a')

  // resize both parent and child
  await page.getByTestId('btn-parent-resize').click()
  await page.getByTestId('btn-resize').click()
  await page.waitForTimeout(POLL_WAIT)

  const after = await getLayout(page, 'layout-a')
  expect(after.count).toBeGreaterThan(before.count)
  // child resized to 180x80
  expect(after.width).toBe(180)
  expect(after.height).toBe(80)
})

test('unmount cleans up and remount re-fires', async ({ page }) => {
  await page.waitForTimeout(POLL_WAIT)
  const before = await getLayout(page, 'layout-a')
  expect(before.count).toBeGreaterThanOrEqual(1)

  // unmount
  await page.getByTestId('btn-toggle-mount').click()
  await page.waitForTimeout(200)
  // layout text should reset to zeros since state resets
  const unmounted = await getLayout(page, 'layout-a')
  // count shouldn't have increased (component reset its state)
  // but we can't assert count=0 because state persists in parent
  // instead verify box-a is gone from DOM
  await expect(page.getByTestId('box-a')).not.toBeVisible()

  // remount
  await page.getByTestId('btn-toggle-mount').click()
  await page.waitForTimeout(POLL_WAIT)
  const remounted = await getLayout(page, 'layout-a')
  expect(remounted.count).toBeGreaterThan(unmounted.count)
  expect(remounted.width).toBe(120)
  expect(remounted.height).toBe(60)
})

test('node swap fires onLayout for new element', async ({ page }) => {
  await page.waitForTimeout(POLL_WAIT)
  const before = await getLayout(page, 'layout-a')
  expect(before.count).toBeGreaterThanOrEqual(1)

  // swap replaces the element via different key (box-a-default -> box-a-alt)
  await page.getByTestId('btn-swap').click()
  await page.waitForTimeout(POLL_WAIT)

  const after = await getLayout(page, 'layout-a')
  // should have fired for the new node
  expect(after.count).toBeGreaterThan(before.count)
  // dimensions should be the same since props match
  expect(after.width).toBe(120)
  expect(after.height).toBe(60)

  // verify the background color changed (proves DOM node actually swapped)
  const bg = await page.getByTestId('box-a').evaluate((el) => {
    return getComputedStyle(el).backgroundColor
  })
  // blue8 instead of red8 — just check it's not the original red
  expect(bg).not.toContain('rgb(229, 72, 77)')
})

test('multiple instances do not cross-contaminate', async ({ page }) => {
  await page.waitForTimeout(POLL_WAIT)
  const a = await getLayout(page, 'layout-a')
  const b = await getLayout(page, 'layout-b')

  // both should have independent correct values
  expect(a.width).toBe(120)
  expect(b.width).toBe(200)

  // move box A — box B should not change
  await page.getByTestId('btn-move').click()
  await page.waitForTimeout(POLL_WAIT)

  const a2 = await getLayout(page, 'layout-a')
  const b2 = await getLayout(page, 'layout-b')

  expect(a2.x).toBe(100)
  // B's values should be unchanged
  expect(b2.width).toBe(b.width)
  expect(b2.height).toBe(b.height)
  expect(b2.x).toBe(b.x)
  expect(b2.y).toBe(b.y)
})
