import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledHtmlCase', type: 'useCase' })
})

test.describe('styled.element() API', () => {
  test.describe('styled.a()', () => {
    test('renders anchor element with proper tag', async ({ page }) => {
      const element = page.getByTestId('styled-a')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('a')
    })

    test('accepts href attribute', async ({ page }) => {
      const element = page.getByTestId('styled-a')
      expect(await element.getAttribute('href')).toBe('https://example.com')
    })

    test('accepts target attribute', async ({ page }) => {
      const element = page.getByTestId('styled-a')
      expect(await element.getAttribute('target')).toBe('_blank')
    })

    test('accepts rel attribute', async ({ page }) => {
      const element = page.getByTestId('styled-a')
      expect(await element.getAttribute('rel')).toBe('noopener')
    })
  })

  test.describe('styled.button()', () => {
    test('renders button element with proper tag', async ({ page }) => {
      const element = page.getByTestId('styled-button')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('button')
    })

    test('accepts type attribute', async ({ page }) => {
      const element = page.getByTestId('styled-button')
      expect(await element.getAttribute('type')).toBe('submit')
    })
  })

  test.describe('styled.div()', () => {
    test('renders div element', async ({ page }) => {
      const element = page.getByTestId('styled-div')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('div')
    })
  })

  test.describe('styled.span()', () => {
    test('renders span element', async ({ page }) => {
      const element = page.getByTestId('styled-span')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('span')
    })
  })

  test.describe('styled.input()', () => {
    test('renders input element with proper tag', async ({ page }) => {
      const element = page.getByTestId('styled-input')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('input')
    })

    test('accepts type attribute', async ({ page }) => {
      const element = page.getByTestId('styled-input')
      expect(await element.getAttribute('type')).toBe('text')
    })

    test('accepts placeholder attribute', async ({ page }) => {
      const element = page.getByTestId('styled-input')
      expect(await element.getAttribute('placeholder')).toBe('Enter text')
    })

    test('accepts maxLength attribute', async ({ page }) => {
      const element = page.getByTestId('styled-input')
      expect(await element.getAttribute('maxlength')).toBe('100')
    })
  })

  test.describe('styled.form()', () => {
    test('renders form element with proper tag', async ({ page }) => {
      const element = page.getByTestId('styled-form')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('form')
    })

    test('accepts action attribute', async ({ page }) => {
      const element = page.getByTestId('styled-form')
      expect(await element.getAttribute('action')).toBe('/submit')
    })

    test('accepts method attribute', async ({ page }) => {
      const element = page.getByTestId('styled-form')
      expect(await element.getAttribute('method')).toBe('post')
    })
  })

  test.describe('styled.label()', () => {
    test('renders label element with proper tag', async ({ page }) => {
      const element = page.getByTestId('styled-label')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('label')
    })

    test('accepts htmlFor attribute (rendered as for)', async ({ page }) => {
      const element = page.getByTestId('styled-label')
      expect(await element.getAttribute('for')).toBe('test-input')
    })
  })

  test.describe('semantic elements', () => {
    test('styled.nav() renders nav element', async ({ page }) => {
      const element = page.getByTestId('styled-nav')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('nav')
    })

    test('styled.main() renders main element', async ({ page }) => {
      const element = page.getByTestId('styled-main')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('main')
    })

    test('styled.section() renders section element', async ({ page }) => {
      const element = page.getByTestId('styled-section')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('section')
    })
  })

  test.describe('styled.a() with variants', () => {
    test('renders with large size variant', async ({ page }) => {
      const element = page.getByTestId('styled-a-variants')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('a')
      expect(await element.getAttribute('href')).toBe('/internal')
    })

    test('renders with small size variant', async ({ page }) => {
      const element = page.getByTestId('styled-a-variants-small')
      await expect(element).toBeVisible()
      expect(await element.getAttribute('href')).toBe('/small')
    })
  })
})
