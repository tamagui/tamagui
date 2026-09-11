import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test('Reanimated web wrapper does not forward nativeID', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'animated-reanimated',
    'Only the Reanimated project uses the tested custom web wrapper'
  )

  const messages: string[] = []
  page.on('console', (message) => messages.push(message.text()))

  await setupPage(page, {
    name: 'AnimatedDOMPropsCase',
    type: 'useCase',
  })

  const animated = page.getByTestId('animated-dom-props')
  await expect(animated).not.toHaveAttribute('nativeID')
  expect(messages.some((message) => message.includes('nativeID'))).toBe(false)
})
