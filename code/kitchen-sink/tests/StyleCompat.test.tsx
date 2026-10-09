import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyleCompatCase', type: 'useCase' })
})

test('web mode flex shorthand emits CSS flex shrink semantics', async ({ page }) => {
  const styles = await getStyles(page.getByTestId('style-compat-flex-child').first())

  expect(styles.flexGrow).toBe('1')
  expect(styles.flexShrink).toBe('1')
  expect(styles.flexBasis).toBe('0px')
})

test('numeric leading and font lengths render identically in class and inline styles', async ({
  page,
}) => {
  for (const inline of [false, true]) {
    await expect
      .poll(() =>
        page
          .getByTestId(`leading-ratio-${inline}`)
          .evaluate((element) => (element as HTMLElement).style.lineHeight)
      )
      .toBe(inline ? '1.5' : '')
    for (const [name, expected] of [
      ['ratio', '30px'],
      ['child', '15px'],
      ['pixels', '24px'],
      ['font', '24px'],
      ['large', '480px'],
      ['style', '30px'],
    ]) {
      const text = page.getByTestId(`leading-${name}-${inline}`)
      await expect(text).toBeAttached()
      await expect(text).toHaveCSS('line-height', expected)
    }
  }
})
