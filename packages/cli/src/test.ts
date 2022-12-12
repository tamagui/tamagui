/* eslint-disable no-console */
import { ResolvedOptions } from './types.js'

export const test = async (options: ResolvedOptions) => {
  const { dev } = await import('./dev.js')

  // failing on startup "Tamagui error bundling components require() of ES Module"

  void dev(options)

  console.log('run tests')
}
