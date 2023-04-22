/* eslint-disable no-console */
import { CLIResolvedOptions } from '@tamagui/types'

export const test = async (options: CLIResolvedOptions) => {
  const { dev } = await import('./dev.js')

  // failing on startup "Tamagui error bundling components require() of ES Module"

  void dev(options)

  console.log('run tests')
}
