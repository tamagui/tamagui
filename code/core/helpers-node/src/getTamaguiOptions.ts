import { readTamaguiOptions } from './readTamaguiOptions'

export async function getTamaguiOptions({
  cwd = '.',
}: { cwd?: string }): Promise<import('@tamagui/types/types').TamaguiOptions> {
  return (await readTamaguiOptions({ cwd })).options
}
