import { getDefaultTamaguiConfigPath } from './getTamaguiDefaultPath'
import type { TamaguiOptions } from './types'

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
