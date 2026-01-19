import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// mobile viewport with touch support for realistic sheet testing
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
})

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetScrollLockCase', type: 'useCase' })
})

/**
 * perform a drag gesture using mouse events
 */
async function dragSheet(
  page: Page,
  startX: number,
  startY: number,
  deltaY: number,
  options: { steps?: number; stepDelay?: number } = {}
) {
  const { steps = 20, stepDelay = 16 } = options

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(startX, startY + (deltaY * i) / steps)
    await page.waitForTimeout(stepDelay)
  }

  await page.mouse.up()
}

test.describe('Sheet scroll lock behavior', () => {
  test('overflow:hidden is applied when sheet is open', async ({ page }) => {
    // open the sheet from top of page
    const trigger = page.getByTestId('basic-scroll-lock-trigger')
    await trigger.click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('basic-scroll-lock-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify overflow:hidden is applied to html element
    const htmlOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(htmlOverflow).toBe('hidden')

    // verify overscroll-behavior:none is applied to body
    const bodyOverscroll = await page.evaluate(
      () => getComputedStyle(document.body).overscrollBehavior
    )
    expect(bodyOverscroll).toBe('none')
  })

  test('body does not scroll when dragging sheet down', async ({ page }) => {
    const trigger = page.getByTestId('basic-scroll-lock-trigger')
    await trigger.click()
    await page.waitForTimeout(600)

    const handle = page.getByTestId('basic-scroll-lock-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const preScrollY = await page.evaluate(() => window.scrollY)

    // drag sheet down
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      150
    )
    await page.waitForTimeout(300)

    const postScrollY = await page.evaluate(() => window.scrollY)
    expect(postScrollY).toBe(preScrollY)
  })

  test('body does not scroll when dragging sheet up', async ({ page }) => {
    const trigger = page.getByTestId('basic-scroll-lock-trigger')
    await trigger.click()
    await page.waitForTimeout(600)

    // first drag down to a lower snap point
    const handle = page.getByTestId('basic-scroll-lock-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200
    )
    await page.waitForTimeout(500)

    const preScrollY = await page.evaluate(() => window.scrollY)

    // now drag up
    handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      -150
    )
    await page.waitForTimeout(300)

    const postScrollY = await page.evaluate(() => window.scrollY)
    expect(postScrollY).toBe(preScrollY)
  })

  test('body does not scroll when page was scrolled before opening sheet', async ({
    page,
  }) => {
    // scroll body down first
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(100)

    const initialScrollY = await page.evaluate(() => window.scrollY)
    expect(initialScrollY).toBe(500)

    // open sheet
    const trigger = page.getByTestId('basic-scroll-lock-trigger')
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('basic-scroll-lock-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // drag sheet
    const handle = page.getByTestId('basic-scroll-lock-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const preScrollY = await page.evaluate(() => window.scrollY)

    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      100
    )
    await page.waitForTimeout(300)

    const postScrollY = await page.evaluate(() => window.scrollY)
    expect(postScrollY).toBe(preScrollY)
  })

  test('scroll lock is released when sheet closes', async ({ page }) => {
    const trigger = page.getByTestId('basic-scroll-lock-trigger')
    await trigger.click()
    await page.waitForTimeout(600)

    // verify locked
    let htmlOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(htmlOverflow).toBe('hidden')

    // close sheet
    const closeBtn = page.getByTestId('basic-scroll-lock-close')
    await closeBtn.click()
    await page.waitForTimeout(600)

    // verify unlocked
    htmlOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(htmlOverflow).toBe('visible')

    // verify body can scroll again
    await page.evaluate(() => window.scrollTo(0, 500))
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBe(500)
  })
})

test.describe('Sheet.ScrollView handoff behavior', () => {
  test('Sheet.ScrollView content can scroll when at top snap point', async ({ page }) => {
    const trigger = page.getByTestId('scrollview-sheet-trigger')
    await trigger.scrollIntoViewIfNeeded()
    const preOpenScrollY = await page.evaluate(() => window.scrollY)
    await trigger.click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('scrollview-sheet-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // find the scrollview
    const scrollview = page.getByTestId('scrollview-sheet-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // check initial scroll position
    const preScrollTop = await scrollview.evaluate((el: HTMLElement) => el.scrollTop)
    expect(preScrollTop).toBe(0)

    // use wheel event to scroll the scrollview content
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(300)

    // verify scrollview scrolled
    const postScrollTop = await scrollview.evaluate((el: HTMLElement) => el.scrollTop)
    expect(postScrollTop).toBeGreaterThan(0)

    // verify body did not scroll from where it was when sheet opened
    const bodyScrollY = await page.evaluate(() => window.scrollY)
    expect(bodyScrollY).toBe(preOpenScrollY)
  })

  test('body remains locked during Sheet.ScrollView interaction', async ({ page }) => {
    const trigger = page.getByTestId('scrollview-sheet-trigger')
    await trigger.scrollIntoViewIfNeeded()
    const preOpenScrollY = await page.evaluate(() => window.scrollY)
    await trigger.click()
    await page.waitForTimeout(600)

    // verify body scroll lock
    const htmlOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(htmlOverflow).toBe('hidden')

    // scroll the scrollview
    const scrollview = page.getByTestId('scrollview-sheet-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(300)

    // verify body is still locked at same position
    const postScrollY = await page.evaluate(() => window.scrollY)
    expect(postScrollY).toBe(preOpenScrollY)
  })

  test('sheet can be dragged from handle when ScrollView is at top', async ({ page }) => {
    const trigger = page.getByTestId('scrollview-sheet-trigger')
    await trigger.scrollIntoViewIfNeeded()
    const preOpenScrollY = await page.evaluate(() => window.scrollY)
    await trigger.click()
    await page.waitForTimeout(600)

    const snapIndicator = page.getByTestId('scrollview-sheet-snap-indicator')
    const initialSnap = await snapIndicator.textContent()
    expect(initialSnap).toContain('0')

    // drag from handle
    const handle = page.getByTestId('scrollview-sheet-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      250
    )
    await page.waitForTimeout(600)

    // verify snap point changed
    const finalSnap = await snapIndicator.textContent()
    expect(finalSnap).toContain('1')

    // verify body did not scroll from where it was
    const bodyScrollY = await page.evaluate(() => window.scrollY)
    expect(bodyScrollY).toBe(preOpenScrollY)
  })
})
