import { basename } from 'node:path'

import type { TamaguiOptions } from '../types'
import { getPrefixLogs } from './getPrefixLogs'

export function createLogger(sourcePath: string, options: TamaguiOptions) {
  const shouldLogTiming = options.logTimings ?? true
  const start = Date.now()
  const mem =
    process.env.TAMAGUI_SHOW_MEMORY_USAGE && shouldLogTiming
      ? process.memoryUsage()
      : null

  return (res) => {
    if (!shouldLogTiming) {
      return
    }

    const memUsed = mem
      ? Math.round(((process.memoryUsage().heapUsed - mem.heapUsed) / 1024 / 1204) * 10) /
        10
      : 0
    const path = basename(sourcePath || '')
      .replace(/\.[jt]sx?$/, '')
      .slice(0, 22)
      .trim()
      .padStart(24)

    const numOptimized = `${res.optimized + res.styled}`.padStart(3)
    const numFound = `${res.found + res.styled}`.padStart(3)
    const numFlattened = `${res.flattened}`.padStart(3)
    const memory = memUsed ? ` ${memUsed}MB` : ''
    const timing = Date.now() - start
    const timingStr = `${timing}ms`.padStart(6)
    const pre = getPrefixLogs(options)
    const memStr = memory ? `(${memory})` : ''
    console.info(
      `${pre} ${path}   ·  ${numFound} found   ·  ${numOptimized} opt   ·  ${numFlattened} flat  ${timingStr} ${memStr}`
    )
  }
}
