import type { Page } from '@playwright/test'

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
  const params = new URLSearchParams({
    theme,
    animationDriver: searchParams.animationDriver ?? process.env.TAMAGUI_TEST_ANIMATION_DRIVER ?? 'native',
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
  await page.goto(url, { waitUntil: 'networkidle' })
  await new Promise((res) => setTimeout(res, waitExtra ? 3000 : 300))

  return page
}
