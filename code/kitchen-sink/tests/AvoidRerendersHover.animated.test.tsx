import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * The avoidReRenders pipeline: motion and reanimated declare it, so a hover
 * pushes the resolved style straight to the node through useStyleEmitter and
 * React never commits. The css driver does not declare it, so the same hover
 * runs through setState and does commit. Both halves are asserted, which is
 * what makes the zero-commit half a real result rather than a broken probe.
 */

const AVOIDS_RERENDERS = ['motion', 'reanimated']

const bg = (page: import('@playwright/test').Page) =>
  page
    .getByTestId('avoid-rerenders-square')
    .evaluate((el) => getComputedStyle(el).backgroundColor)

const commits = (page: import('@playwright/test').Page) =>
  page.evaluate(() => window.__commits)

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'AvoidRerendersHoverCase', type: 'useCase' })
  await expect(page.getByTestId('avoid-rerenders-square')).toBeVisible()
  await page.waitForTimeout(200)
})

test('a hover reaches the node without a React commit on drivers that avoid them', async ({
  page,
}, testInfo) => {
  const driver = testInfo.project.metadata.animationDriver
  const square = page.getByTestId('avoid-rerenders-square')

  expect(await bg(page), 'starts on the base red').toBe('rgb(255, 0, 0)')

  // the probe has to be able to count, or zero proves nothing
  const beforeBump = await commits(page)
  await page.getByTestId('avoid-rerenders-bump').click()
  await page.waitForTimeout(100)
  expect(
    await commits(page),
    'a plain setState in the parent commits the square subtree'
  ).toBeGreaterThan(beforeBump)

  const beforeHover = await commits(page)
  await square.hover()
  await expect.poll(() => bg(page), { timeout: 2000 }).toBe('rgb(0, 255, 0)')
  const hoverCommits = (await commits(page)) - beforeHover

  if (AVOIDS_RERENDERS.includes(driver)) {
    expect(hoverCommits, `${driver} declares avoidReRenders`).toBe(0)
  } else {
    expect(hoverCommits, `${driver} has no emitter path`).toBeGreaterThan(0)
  }

  const beforeLeave = await commits(page)
  await page.mouse.move(0, 0)
  await expect.poll(() => bg(page), { timeout: 2000 }).toBe('rgb(255, 0, 0)')

  if (AVOIDS_RERENDERS.includes(driver)) {
    expect((await commits(page)) - beforeLeave, 'hover-out is emitted too').toBe(0)
  }
})
