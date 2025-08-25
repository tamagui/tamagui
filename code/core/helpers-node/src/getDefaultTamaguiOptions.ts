import type { TamaguiOptions } from '@tamagui/types'

import { getDefaultTamaguiConfigPath } from './getTamaguiDefaultPath'

export async function getDefaultTamaguiOptions({
  cwd = '.',
}: {
  cwd: string
}): Promise<TamaguiOptions> {
  return {
    platform: 'native',
    components: ['@tamagui/ui'],
    config: await getDefaultTamaguiConfigPath({ cwd }),
  }
}
