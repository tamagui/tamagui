import { expect, test } from '@playwright/test'

test.describe('ToggleGroup + XGroup integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:9000/?test=ToggleGroupXGroupCase')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Pattern A: XGroup.Item wraps ToggleGroup.Item', () => {
    test('clicking item changes toggle value', async ({ page }) => {
      const leftButton = page.getByTestId('pattern-a-left')
      await leftButton.waitFor({ state: 'visible' })

      // initial state should be off
      const initialState = await leftButton.getAttribute('data-state')
      expect(initialState).toBe('off')

      // click to toggle on
      await leftButton.click()
      await page.waitForTimeout(100)

      const stateAfterClick = await leftButton.getAttribute('data-state')
      expect(stateAfterClick).toBe('on')
    })

    test('clicking different items changes selection', async ({ page }) => {
      const leftButton = page.getByTestId('pattern-a-left')
      const centerButton = page.getByTestId('pattern-a-center')
      await leftButton.waitFor({ state: 'visible' })

      await leftButton.click()
      await page.waitForTimeout(100)
      expect(await leftButton.getAttribute('data-state')).toBe('on')
      expect(await centerButton.getAttribute('data-state')).toBe('off')

      await centerButton.click()
      await page.waitForTimeout(100)
      expect(await leftButton.getAttribute('data-state')).toBe('off')
      expect(await centerButton.getAttribute('data-state')).toBe('on')
    })

    test('XGroup properly applies radius styles to items', async ({ page }) => {
      const leftButton = page.getByTestId('pattern-a-left')
      const centerButton = page.getByTestId('pattern-a-center')
      const rightButton = page.getByTestId('pattern-a-right')
      await leftButton.waitFor({ state: 'visible' })

      // first item: should have left border radius, zeroed right
      const leftStyles = await leftButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        }
      })
      // first item should have zero right radii
      expect(parseFloat(leftStyles.borderTopRightRadius)).toBe(0)
      expect(parseFloat(leftStyles.borderBottomRightRadius)).toBe(0)

      // center item: should have all corners zeroed
      const centerStyles = await centerButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        }
      })
      expect(parseFloat(centerStyles.borderTopLeftRadius)).toBe(0)
      expect(parseFloat(centerStyles.borderBottomLeftRadius)).toBe(0)
      expect(parseFloat(centerStyles.borderTopRightRadius)).toBe(0)
      expect(parseFloat(centerStyles.borderBottomRightRadius)).toBe(0)

      // last item: should have zero left radii
      const rightStyles = await rightButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        }
      })
      expect(parseFloat(rightStyles.borderTopLeftRadius)).toBe(0)
      expect(parseFloat(rightStyles.borderBottomLeftRadius)).toBe(0)
    })
  })

  test.describe('Pattern B: ToggleGroup.Item asChild wraps XGroup.Item', () => {
    test('clicking item changes toggle value', async ({ page }) => {
      const leftButton = page.getByTestId('pattern-b-left')
      await leftButton.waitFor({ state: 'visible' })

      // click to toggle on
      await leftButton.click()
      await page.waitForTimeout(100)

      // verify toggle group value changed via data-state or aria-pressed
      const stateAfterClick = await leftButton.getAttribute('data-state')
      expect(stateAfterClick).toBe('on')
    })

    test('clicking different items changes selection', async ({ page }) => {
      const leftButton = page.getByTestId('pattern-b-left')
      const centerButton = page.getByTestId('pattern-b-center')
      await leftButton.waitFor({ state: 'visible' })

      await leftButton.click()
      await page.waitForTimeout(100)
      expect(await leftButton.getAttribute('data-state')).toBe('on')
      expect(await centerButton.getAttribute('data-state')).toBe('off')

      await centerButton.click()
      await page.waitForTimeout(100)
      expect(await leftButton.getAttribute('data-state')).toBe('off')
      expect(await centerButton.getAttribute('data-state')).toBe('on')
    })

    test('XGroup properly applies radius styles through asChild chain', async ({
      page,
    }) => {
      const leftButton = page.getByTestId('pattern-b-left')
      const centerButton = page.getByTestId('pattern-b-center')
      const rightButton = page.getByTestId('pattern-b-right')
      await leftButton.waitFor({ state: 'visible' })

      // first item: should have left border radius preserved, zeroed right
      const leftStyles = await leftButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        }
      })
      expect(parseFloat(leftStyles.borderTopRightRadius)).toBe(0)
      expect(parseFloat(leftStyles.borderBottomRightRadius)).toBe(0)

      // center item: should have all corners zeroed
      const centerStyles = await centerButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        }
      })
      expect(parseFloat(centerStyles.borderTopLeftRadius)).toBe(0)
      expect(parseFloat(centerStyles.borderBottomLeftRadius)).toBe(0)
      expect(parseFloat(centerStyles.borderTopRightRadius)).toBe(0)
      expect(parseFloat(centerStyles.borderBottomRightRadius)).toBe(0)

      // last item: should have zero left radii
      const rightStyles = await rightButton.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          borderTopLeftRadius: style.borderTopLeftRadius,
          borderBottomLeftRadius: style.borderBottomLeftRadius,
          borderTopRightRadius: style.borderTopRightRadius,
          borderBottomRightRadius: style.borderBottomRightRadius,
        }
      })
      expect(parseFloat(rightStyles.borderTopLeftRadius)).toBe(0)
      expect(parseFloat(rightStyles.borderBottomLeftRadius)).toBe(0)
    })
  })
})
