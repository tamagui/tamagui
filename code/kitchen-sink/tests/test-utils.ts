import { test, type Page } from '@playwright/test'

/** Animation drivers available for testing */
export const ANIMATION_DRIVERS = ['css', 'native', 'reanimated', 'motion'] as const
export type AnimationDriver = (typeof ANIMATION_DRIVERS)[number]

type SetupPageArgs = {
  type: 'demo' | 'useCase'
  name: string
  theme?: 'light' | 'dark'
  splitView?: boolean
  centered?: boolean
  waitExtra?: boolean
  adapt?: boolean
  searchParams?: Record<string, string>
}

export async function setupPage(
  page: Page,
  {
    name,
    type,
    theme = 'light',
    splitView = false,
    adapt = false,
    centered = false,
    waitExtra = false,
    searchParams = {},
  }: SetupPageArgs
) {
  // Get animation driver from: searchParams > project metadata > env var > default
  const testInfo = test.info()
  const animationDriver =
    searchParams.animationDriver ??
    (testInfo.project?.metadata as any)?.animationDriver ??
    process.env.TAMAGUI_TEST_ANIMATION_DRIVER ??
    'native'

  const params = new URLSearchParams({
    theme,
    animationDriver,
  })

  // Add any additional custom search params
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== 'animationDriver') {
      params.set(key, value)
    }
  }

  if (type === 'useCase') {
    params.append('test', name)
  } else if (type === 'demo') {
    params.append('demo', name)
  }
  if (splitView) {
    params.append('splitView', 'true')
  }
  if (centered) {
    params.append('centered', 'true')
  }
  if (adapt) {
    params.append('adapt', 'true')
  }

  const url = `/?${params.toString()}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  return page
}
