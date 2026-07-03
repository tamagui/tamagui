import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

const isAndroid = () => device.getPlatform() === 'android'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('SheetKeyboardFitContent', () => {
  beforeAll(async () => {
    if (isAndroid()) return
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'SheetKeyboardFitContentCase' },
    })
    await waitForSheetKeyboardFitContent()
  })

  // remount per test (launch once, deep-link remount) so a failed attempt that
  // leaves the sheet open can't occlude the trigger on the jest retry - without
  // this, any real failure cascades into a misleading "trigger not hittable".
  beforeEach(async () => {
    if (isAndroid()) return
    await remountDirectUseCase('sheet-kb-fit-screen')
    await device.disableSynchronization()
  })

  it('keeps fit Sheet.ScrollView stable through keyboard open, close, and scroll', async () => {
    if (isAndroid()) return

    await withSync(() => element(by.id('sheet-kb-fit-trigger')).tap())
    await waitFor(element(by.id('sheet-kb-fit-frame')))
      .toBeVisible()
      .withTimeout(5000)
    await sleep(500)
    await expect(element(by.id('sheet-kb-fit-scroll-y'))).toHaveText('Scroll Y: 0')
    await expect(element(by.id('sheet-kb-fit-max-scroll-y'))).toHaveText(
      'Max scroll Y: 0'
    )

    await withSync(() => element(by.id('sheet-kb-fit-load-tall')).tap())
    await waitFor(element(by.id('sheet-kb-fit-image')))
      .toBeVisible()
      .withTimeout(3000)
    await sleep(300)
    assertAtMost(await readScrollY(), 2, 'dynamic content current scroll')
    assertAtMost(await readMaxScrollY(), 2, 'dynamic content max scroll')
    const loadedViewportHeight = await readFrameHeight('sheet-kb-fit-scrollview')

    await withSync(() => element(by.id('sheet-kb-fit-input')).tap())
    await sleep(700)
    assertAtMost(await readScrollY(), 2, 'keyboard open current scroll')
    assertAtMost(await readMaxScrollY(), 2, 'keyboard open max scroll')
    assertNear(
      await readFrameHeight('sheet-kb-fit-scrollview'),
      loadedViewportHeight,
      2,
      'keyboard open viewport height'
    )

    await withSync(() => element(by.id('sheet-kb-fit-input')).tapReturnKey())
    await sleep(700)
    assertAtMost(await readScrollY(), 2, 'keyboard close current scroll')
    assertAtMost(await readMaxScrollY(), 2, 'keyboard close max scroll')
    assertNear(
      await readFrameHeight('sheet-kb-fit-scrollview'),
      loadedViewportHeight,
      2,
      'keyboard close viewport height'
    )

    await withSync(() => element(by.id('sheet-kb-fit-input')).tap())
    await sleep(700)
    assertAtMost(await readScrollY(), 2, 'keyboard reopen current scroll')
    assertAtMost(await readMaxScrollY(), 2, 'keyboard reopen max scroll')
    assertNear(
      await readFrameHeight('sheet-kb-fit-scrollview'),
      loadedViewportHeight,
      2,
      'keyboard reopen viewport height'
    )

    await element(by.id('sheet-kb-fit-image')).swipe('up', 'slow', 0.7)
    await waitFor(element(by.id('sheet-kb-fit-post')))
      .toBeVisible()
      .withTimeout(3000)
    assertAtLeast(await readScrollY(), 20, 'scroll after swipe up')

    await withSync(() => element(by.id('sheet-kb-fit-post')).tap())
    const eventsText = await readText('sheet-kb-fit-events')
    if (!eventsText.includes('post')) {
      throw new Error(`expected post event, got "${eventsText}"`)
    }

    await element(by.id('sheet-kb-fit-post')).swipe('down', 'slow', 0.7)
    await sleep(700)
    assertAtMost(await readScrollY(), 5, 'scroll after swipe back to top')
  })
})

async function waitForSheetKeyboardFitContent() {
  await waitFor(element(by.id('sheet-kb-fit-trigger')))
    .toExist()
    .withTimeout(180000)
}

async function readText(id: string) {
  const attributes = await element(by.id(id)).getAttributes()
  const text = (attributes as any).text
  if (typeof text !== 'string') {
    throw new Error(`expected ${id} to expose text, got ${JSON.stringify(attributes)}`)
  }
  return text
}

async function readNumber(id: string, prefix: string) {
  const text = await readText(id)
  const value = Number.parseInt(text.replace(prefix, ''), 10)
  if (Number.isNaN(value)) {
    throw new Error(`expected ${id} to start with "${prefix}", got "${text}"`)
  }
  return value
}

const readScrollY = () => readNumber('sheet-kb-fit-scroll-y', 'Scroll Y: ')
const readMaxScrollY = () => readNumber('sheet-kb-fit-max-scroll-y', 'Max scroll Y: ')

async function readFrameHeight(id: string) {
  const attributes = await element(by.id(id)).getAttributes()
  const frame = (attributes as any).frame || (attributes as any).elementFrame
  const height = frame?.height
  if (typeof height !== 'number') {
    throw new Error(
      `expected ${id} to expose frame height, got ${JSON.stringify(attributes)}`
    )
  }
  return Math.round(height)
}

function assertAtMost(value: number, max: number, label: string) {
  if (value > max) {
    throw new Error(`${label}: expected <= ${max}, got ${value}`)
  }
}

function assertAtLeast(value: number, min: number, label: string) {
  if (value < min) {
    throw new Error(`${label}: expected >= ${min}, got ${value}`)
  }
}

function assertNear(value: number, expected: number, tolerance: number, label: string) {
  if (Math.abs(value - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} +/- ${tolerance}, got ${value}`)
  }
}
