import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('nested group notifications', () => {
  test('unchanged group re-emits do not cascade into a render loop', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await setupPage(page, {
      name: 'GroupNestedNotifyLoopCase',
      type: 'useCase',
      searchParams: { animationDriver: 'reanimated' },
    })

    await expect(page.getByTestId('nested-group-ready')).toHaveText('idle')
    await page.getByTestId('nested-group-root').click()
    await expect(page.getByTestId('nested-group-ready')).toHaveText('active')

    expect(errors).not.toContainEqual(
      expect.stringContaining('Maximum update depth exceeded')
    )
  })
})
