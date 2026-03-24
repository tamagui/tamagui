import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// integration tests for RN 0.82 DOM Node APIs via tamagui component refs
// verifies that View/Text/ScrollView/Input refs expose the full DOM node API surface

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'DOMNodeAPIs', type: 'useCase' })
  // wait for results to render
  await page.waitForSelector('#dom-node-results', { timeout: 5_000 })
  await page.waitForFunction(
    () => {
      const results = document.getElementById('dom-node-results')
      return results && results.children.length > 5
    },
    { timeout: 5_000, polling: 50 }
  )
})

async function getResult(page, key: string): Promise<string> {
  const el = page.locator(`[data-testid="result-${key}"]`)
  const text = await el.textContent()
  // format is "key=value"
  return text?.split('=').slice(1).join('=') ?? ''
}

// tree traversal

test('parentNode exists on child ref', async ({ page }) => {
  expect(await getResult(page, 'parentNode-exists')).toBe('true')
})

test('parentElement exists on child ref', async ({ page }) => {
  expect(await getResult(page, 'parentElement-exists')).toBe('true')
})

test('parent.contains(child) returns true', async ({ page }) => {
  expect(await getResult(page, 'parent-contains-childA')).toBe('true')
  expect(await getResult(page, 'parent-contains-childB')).toBe('true')
})

test('child.contains(parent) returns false', async ({ page }) => {
  expect(await getResult(page, 'childA-contains-parent')).toBe('false')
})

test('hasChildNodes returns true', async ({ page }) => {
  expect(await getResult(page, 'hasChildNodes')).toBe('true')
})

test('childNodes and children have length > 0', async ({ page }) => {
  const childNodesLen = Number(await getResult(page, 'childNodes-length'))
  const childrenLen = Number(await getResult(page, 'children-length'))
  expect(childNodesLen).toBeGreaterThan(0)
  expect(childrenLen).toBeGreaterThan(0)
})

test('firstChild and lastChild exist', async ({ page }) => {
  expect(await getResult(page, 'firstChild-exists')).toBe('true')
  expect(await getResult(page, 'lastChild-exists')).toBe('true')
})

test('firstElementChild and lastElementChild exist', async ({ page }) => {
  expect(await getResult(page, 'firstElementChild-exists')).toBe('true')
  expect(await getResult(page, 'lastElementChild-exists')).toBe('true')
})

// sibling traversal

test('nextSibling and previousSibling work', async ({ page }) => {
  expect(await getResult(page, 'childA-nextSibling-exists')).toBe('true')
  expect(await getResult(page, 'childB-previousSibling-exists')).toBe('true')
})

test('nextElementSibling and previousElementSibling work', async ({ page }) => {
  expect(await getResult(page, 'childA-nextElementSibling-exists')).toBe('true')
  expect(await getResult(page, 'childB-previousElementSibling-exists')).toBe('true')
})

// getBoundingClientRect

test('getBoundingClientRect returns full DOMRect', async ({ page }) => {
  expect(await getResult(page, 'rect-has-width')).toBe('true')
  expect(await getResult(page, 'rect-has-height')).toBe('true')
  expect(await getResult(page, 'rect-has-x')).toBe('true')
  expect(await getResult(page, 'rect-has-y')).toBe('true')
  expect(await getResult(page, 'rect-has-top')).toBe('true')
  expect(await getResult(page, 'rect-has-left')).toBe('true')
  expect(await getResult(page, 'rect-has-right')).toBe('true')
  expect(await getResult(page, 'rect-has-bottom')).toBe('true')
})

// document access

test('ownerDocument exists and isConnected is true', async ({ page }) => {
  expect(await getResult(page, 'ownerDocument-exists')).toBe('true')
  expect(await getResult(page, 'isConnected')).toBe('true')
})

test('getElementById via ownerDocument works', async ({ page }) => {
  expect(await getResult(page, 'getElementById-works')).toBe('true')
})

// compareDocumentPosition

test('compareDocumentPosition indicates containment', async ({ page }) => {
  expect(await getResult(page, 'compareDocumentPosition-contained')).toBe('true')
})

// node properties

test('nodeType is 1 (ELEMENT_NODE)', async ({ page }) => {
  expect(await getResult(page, 'parent-nodeType')).toBe('1')
})

test('nodeName exists', async ({ page }) => {
  expect(await getResult(page, 'parent-nodeName-exists')).toBe('true')
})

// textContent

test('textContent returns text from Text component', async ({ page }) => {
  expect(await getResult(page, 'text-textContent')).toBe('hello dom')
})

// offset properties

test('offsetWidth and offsetHeight are positive', async ({ page }) => {
  expect(await getResult(page, 'offsetWidth-positive')).toBe('true')
  expect(await getResult(page, 'offsetHeight-positive')).toBe('true')
})

test('offsetParent exists', async ({ page }) => {
  expect(await getResult(page, 'offsetParent-exists')).toBe('true')
})

// client properties

test('clientWidth and clientHeight are positive', async ({ page }) => {
  expect(await getResult(page, 'clientWidth-positive')).toBe('true')
  expect(await getResult(page, 'clientHeight-positive')).toBe('true')
})

// childElementCount

test('childElementCount is > 0', async ({ page }) => {
  const count = Number(await getResult(page, 'childElementCount'))
  expect(count).toBeGreaterThan(0)
})

// getRootNode

test('getRootNode returns a node', async ({ page }) => {
  expect(await getResult(page, 'getRootNode-exists')).toBe('true')
})

// focus/blur

test('focus and blur work on Input ref', async ({ page }) => {
  expect(await getResult(page, 'focus-works')).toBe('true')
  expect(await getResult(page, 'blur-works')).toBe('true')
})
