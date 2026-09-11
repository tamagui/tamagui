import { expect, test, type Page } from '@playwright/test'

/**
 * The hydration premise, unverified since `359e29cc83` removed
 * `normalizeThemeValue`, which had made an SSR-hydrated theme value compare
 * equal to a client-computed one.
 *
 * Two passes, each with its own control, because the two ways a client can
 * arrive at a theme value are different mechanisms:
 *
 * - `same-config` is what every app in this repo does, since the names-only
 *   projection below has no producer. Both sides parse the identical config,
 *   so mixed color spellings cannot diverge, and this says so rather than
 *   assuming it.
 * - `css-roundtrip` is the names-only client projection, the one shape where
 *   the client rebuilds theme values out of the document's CSS instead of from
 *   the config. Restored theme-variable collapsing means several theme keys now
 *   share one variable, so the client reads back the spelling that won the
 *   collapse. The guarantee is the color, not the spelling; see the handoff log
 *   for the measured before and after.
 */

type Receipt = {
  scenario: string
  clientLabel: string
  serverProbe: string
  clientProbe: string
  recoverable: string[]
  errors: string[]
  serverValues: Record<string, string>
  clientValues: Record<string, string>
  colorDiffs: string[]
  spellingDiffs: string[]
}

const receiptFor = async (page: Page, scenario: string): Promise<Receipt> => {
  await page.goto(`/hydration.html?case=${scenario}`)
  await page.waitForFunction(() => Boolean((window as any).__hydration))
  return page.evaluate(() => (window as any).__hydration)
}

test('a mixed-spelling config hydrates clean when both sides parse it', async ({
  page,
}) => {
  const receipt = await receiptFor(page, 'same-config')

  expect(receipt.recoverable).toEqual([])
  expect(receipt.errors).toEqual([])
  expect(receipt.clientProbe).toBe(receipt.serverProbe)
  expect(receipt.spellingDiffs).toEqual([])
  expect(receipt.colorDiffs).toEqual([])
})

test('a server payload carrying a different color is reported, not absorbed', async ({
  page,
}) => {
  const receipt = await receiptFor(page, 'render-mismatch')

  // React 418 is the hydration mismatch; the client corrects the markup back to
  // what it computed, so the probe no longer matches what the server sent
  expect(receipt.recoverable.join(' ')).toContain('418')
  expect(receipt.clientProbe).not.toBe(receipt.serverProbe)
})

test('theme values rebuilt from the document are the colors the server rendered', async ({
  page,
}) => {
  const receipt = await receiptFor(page, 'css-roundtrip')

  // the client config carried no theme values at all, so every one of these
  // came out of the CSS
  expect(Object.values(receipt.clientValues).every(Boolean)).toBe(true)
  expect(receipt.colorDiffs).toEqual([])
})

test('the round-trip pass reports a document that disagrees with the server', async ({
  page,
}) => {
  const receipt = await receiptFor(page, 'css-roundtrip-mismatch')

  expect(receipt.colorDiffs).toContain('background')
})
