import { afterEach, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

test('the client theme projection preserves every server theme and variable name', async () => {
  vi.stubEnv('VITE_ENVIRONMENT', 'server')
  const [{ config }, { clientThemes, themeNames, themeVariableNames }] =
    await Promise.all([
      import('../../../../packages/tamagui-dev-config/src/tamagui.dev.config'),
      import('../../../../packages/tamagui-dev-config/src/themeMetadata'),
    ])

  const serverThemes = config.themes as Record<string, Record<string, unknown>>
  const serverNames = Object.keys(serverThemes).sort()
  const serverVariableNames = [
    ...new Set(Object.values(serverThemes).flatMap((theme) => Object.keys(theme))),
  ].sort()

  expect(themeNames.toSorted()).toEqual(serverNames)
  expect(themeVariableNames.toSorted()).toEqual(serverVariableNames)
  expect(Object.keys(clientThemes).sort()).toEqual(serverNames)
  expect(Object.keys(clientThemes.light).sort()).toEqual(serverVariableNames)
})
