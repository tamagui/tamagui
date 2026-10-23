import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.use({ trace: 'retain-on-failure', screenshot: 'only-on-failure' })

const cases = [
  { prefix: 'input-ref-plain', tagName: 'INPUT' },
  { prefix: 'input-ref-styled', tagName: 'INPUT' },
  { prefix: 'textarea-ref-plain', tagName: 'TEXTAREA' },
  { prefix: 'textarea-ref-styled', tagName: 'TEXTAREA' },
  { prefix: 'input-ref-callback', tagName: 'INPUT' },
  { prefix: 'textarea-ref-callback', tagName: 'TEXTAREA' },
  { prefix: 'input-ref-double-styled', tagName: 'INPUT' },
  { prefix: 'textarea-ref-double-styled', tagName: 'TEXTAREA' },
  { prefix: 'input-ref-imperative', tagName: 'INPUT' },
  { prefix: 'input-ref-as-child', tagName: 'INPUT' },
] as const

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const events: unknown[] = []
    ;(window as any).__inputRefFocus = events
    const describe = (node: Element | null) =>
      node && { tag: node.tagName, id: node.id, connected: node.isConnected }
    for (const type of ['focusin', 'focusout']) {
      document.addEventListener(
        type,
        (event) => {
          events.push({
            type,
            time: performance.now(),
            target: describe(event.target as Element),
          })
        },
        true
      )
    }
    const focus = HTMLElement.prototype.focus
    HTMLElement.prototype.focus = function (...args) {
      const event = {
        type: 'focus-call',
        time: performance.now(),
        target: describe(this),
        before: describe(document.activeElement),
        after: null as ReturnType<typeof describe>,
        stack: new Error().stack,
      }
      events.push(event)
      focus.apply(this, args)
      event.after = describe(document.activeElement)
    }
  })
  await setupPage(page, { name: 'InputRefCase', type: 'useCase' })
})

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) return
  await testInfo.attach('input-ref-focus', {
    body: JSON.stringify(
      await page.evaluate(() => ({
        active: document.activeElement?.outerHTML,
        events: (window as any).__inputRefFocus,
      })),
      null,
      2
    ),
    contentType: 'application/json',
  })
})

test('Input and TextArea refs resolve to their DOM elements and can focus them', async ({
  page,
}) => {
  for (const refCase of cases) {
    await expect(page.getByTestId(`${refCase.prefix}-tag`)).toHaveText(refCase.tagName)

    await page
      .getByTestId(`${refCase.prefix}-focus`)
      .evaluate((element: HTMLElement) => element.click())
    await expect(page.locator(`#${refCase.prefix}`)).toBeFocused()
  }

  await page.getByTestId('input-ref-dialog-open').click()
  await expect(page.getByTestId('input-ref-dialog-tag')).toHaveText('INPUT')
  await page
    .getByTestId('input-ref-dialog-focus')
    .evaluate((element: HTMLElement) => element.click())
  await expect(page.locator('#input-ref-dialog')).toBeFocused()
  await page.getByTestId('input-ref-dialog-close').click()

  await page.getByTestId('textarea-ref-popover-open').click()
  await expect(page.getByTestId('textarea-ref-popover-tag')).toHaveText('TEXTAREA')
  await page
    .getByTestId('textarea-ref-popover-focus')
    .evaluate((element: HTMLElement) => element.click())
  await expect(page.locator('#textarea-ref-popover')).toBeFocused()

  await expect(page.locator('#textarea-ref-plain')).toHaveAttribute('rows', '5')
  await expect(page.locator('#textarea-ref-styled')).toHaveAttribute('rows', '5')
})
