import { readTamaguiOptions } from './readTamaguiOptions'

export async function getTamaguiOptions({ cwd = '.' }: { cwd?: string }) {
  return (await readTamaguiOptions({ cwd })).options
}
