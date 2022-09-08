import type { TamaguiOptions } from '@tamagui/static'

import { getDefaultTamaguiConfigPath } from './getTamaguiDefaultPath'

export async function getDefaultTamaguiOptions({
  cwd = '.',
}: {
  cwd: string
}): Promise<TamaguiOptions> {
  return {
    components: ['tamagui'],
    config: await getDefaultTamaguiConfigPath({ cwd }),
  }
}
