import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Render Prop', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'RenderPropCase', type: 'useCase' })
  })

  test.describe('styled() render prop', () => {
    test('renders button element when render="button"', async ({ page }) => {
      const element = page.getByTestId('styled-button')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('button')
    })

    test('renders anchor element when render="a"', async ({ page }) => {
      const element = page.getByTestId('styled-anchor')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('a')
      // Check href attribute is passed through
      const href = await element.getAttribute('href')
      expect(href).toBe('#')
    })
  })

  test.describe('semantic elements', () => {
    test('renders nav element', async ({ page }) => {
      const element = page.getByTestId('styled-nav')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('nav')
    })

    test('renders main element', async ({ page }) => {
      const element = page.getByTestId('styled-main')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('main')
    })

    test('renders section element', async ({ page }) => {
      const element = page.getByTestId('styled-section')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('section')
    })

    test('renders article element', async ({ page }) => {
      const element = page.getByTestId('styled-article')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('article')
    })

    test('renders footer element', async ({ page }) => {
      const element = page.getByTestId('styled-footer')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('footer')
    })
  })

  test.describe('form elements', () => {
    test('renders form element', async ({ page }) => {
      const element = page.getByTestId('styled-form')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('form')
    })

    test('renders fieldset element', async ({ page }) => {
      const element = page.getByTestId('styled-fieldset')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('fieldset')
    })

    test('renders label element with htmlFor', async ({ page }) => {
      const element = page.getByTestId('styled-label')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('label')
      const htmlFor = await element.getAttribute('for')
      expect(htmlFor).toBe('test-input')
    })
  })

  test.describe('heading elements', () => {
    test('renders h1 element', async ({ page }) => {
      const element = page.getByTestId('styled-h1')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('h1')
    })

    test('renders h2 element', async ({ page }) => {
      const element = page.getByTestId('styled-h2')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('h2')
    })
  })

  test.describe('list elements', () => {
    test('renders ul element', async ({ page }) => {
      const element = page.getByTestId('styled-ul')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('ul')
    })

    test('renders li elements', async ({ page }) => {
      const li1 = page.getByTestId('styled-li-1')
      const li2 = page.getByTestId('styled-li-2')
      await expect(li1).toBeVisible()
      await expect(li2).toBeVisible()
      const tagName1 = await li1.evaluate((el) => el.tagName.toLowerCase())
      const tagName2 = await li2.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName1).toBe('li')
      expect(tagName2).toBe('li')
    })
  })

  test.describe('runtime render prop override', () => {
    test('overrides to button at runtime', async ({ page }) => {
      const element = page.getByTestId('runtime-button')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('button')
    })

    test('overrides to anchor at runtime', async ({ page }) => {
      const element = page.getByTestId('runtime-anchor')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('a')
    })
  })

  test.describe('Stack with render prop', () => {
    test('Stack renders as section', async ({ page }) => {
      const element = page.getByTestId('stack-as-section')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('section')
    })

    test('Stack renders as aside', async ({ page }) => {
      const element = page.getByTestId('stack-as-aside')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('aside')
    })
  })

  test.describe('Text with render prop', () => {
    test('Text renders as span', async ({ page }) => {
      const element = page.getByTestId('text-as-span')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('span')
    })

    test('Text renders as strong', async ({ page }) => {
      const element = page.getByTestId('text-as-strong')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('strong')
    })

    test('Text renders as em', async ({ page }) => {
      const element = page.getByTestId('text-as-em')
      await expect(element).toBeVisible()
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('em')
    })
  })

  test.describe('styles are applied correctly', () => {
    test('styled button has correct styles', async ({ page }) => {
      const element = page.getByTestId('styled-button')
      await expect(element).toBeVisible()

      // Check cursor style
      const cursor = await element.evaluate((el) => window.getComputedStyle(el).cursor)
      expect(cursor).toBe('pointer')
    })

    test('styled nav has correct background', async ({ page }) => {
      const element = page.getByTestId('styled-nav')
      await expect(element).toBeVisible()

      // Just verify the element has some background set
      const bg = await element.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      )
      expect(bg).toBeTruthy()
      expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    })
  })

  test.describe('JSX element render prop', () => {
    test('renders JSX element with merged props', async ({ page }) => {
      const element = page.getByTestId('jsx-element-render')
      await expect(element).toBeVisible()

      // Should render as anchor (from JSX element)
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('a')

      // Should have href from JSX element
      const href = await element.getAttribute('href')
      expect(href).toBe('/test-link')

      // Should have custom data attribute from JSX element
      const jsxAttr = await element.getAttribute('data-jsx-element')
      expect(jsxAttr).toBe('true')
    })

    test('renders JSX button with type attribute', async ({ page }) => {
      const element = page.getByTestId('jsx-element-button')
      await expect(element).toBeVisible()

      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('button')

      const type = await element.getAttribute('type')
      expect(type).toBe('submit')

      const jsxAttr = await element.getAttribute('data-jsx-button')
      expect(jsxAttr).toBe('true')
    })

    test('JSX element has styles from Stack', async ({ page }) => {
      const element = page.getByTestId('jsx-element-render')
      await expect(element).toBeVisible()

      // Should have padding and background from Stack props
      const bg = await element.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      )
      expect(bg).toBeTruthy()
      expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    })
  })

  test.describe('function render prop', () => {
    test('renders with custom component via function', async ({ page }) => {
      const element = page.getByTestId('function-render')
      await expect(element).toBeVisible()

      // Should render as button (from CustomButton)
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('button')

      // Should have custom data attribute from CustomButton
      const customAttr = await element.getAttribute('data-custom-button')
      expect(customAttr).toBe('true')
    })

    test('function render receives state object', async ({ page }) => {
      const element = page.getByTestId('function-render-with-state')
      await expect(element).toBeVisible()

      // Check that state object is passed - initial state should be false
      // Note: CSS driver doesn't track hover/press state - it uses CSS :hover
      // The state object is still passed but hover/press may not update with CSS driver
      const hoverAttr = await element.getAttribute('data-hover')
      const pressAttr = await element.getAttribute('data-press')

      // Should have the data attributes (state is passed to render function)
      expect(hoverAttr).toBeDefined()
      expect(pressAttr).toBeDefined()

      // Initial values should be 'false'
      expect(hoverAttr).toBe('false')
      expect(pressAttr).toBe('false')
    })

    test('function render has styles from Stack', async ({ page }) => {
      const element = page.getByTestId('function-render')
      await expect(element).toBeVisible()

      const bg = await element.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      )
      expect(bg).toBeTruthy()
      expect(bg).not.toBe('rgba(0, 0, 0, 0)')
    })
  })
})
