import { join } from 'path'

import { pathExists } from 'fs-extra'

let cachedPath = ''

export async function getDefaultTamaguiConfigPath({
  cwd = '.',
  cache = true,
}: {
  cwd?: string
  // TODO this isn't passed down / could avoid
  cache?: boolean
}) {
  if (cache && cachedPath) {
    return cachedPath
  }

  const defaultPaths = ['tamagui.config.ts', join('src', 'tamagui.config.ts')].map((p) =>
    join(cwd, p)
  )
  const existing = (
    await Promise.all(defaultPaths.map((path) => pathExists(path)))
  ).findIndex((x) => !!x)
  const found = defaultPaths[existing]
  if (!found) {
    throw new Error(`No found tamagui.config.ts`)
  }

  cachedPath = found
  return found
}
