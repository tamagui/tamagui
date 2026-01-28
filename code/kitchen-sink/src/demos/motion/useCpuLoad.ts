import { useEffect, useRef } from 'react'

/**
 * Hook that simulates CPU load by blocking the main thread.
 * @param load - 0 to 100, percentage of frame time to block
 */
export function useCpuLoad(load: number) {
  const loadRef = useRef(load)
  loadRef.current = load

  useEffect(() => {
    let rafId = 0
    // block for longer to make stuttering more visible
    // at 95% load, block for ~50ms which causes severe frame drops
    const maxBlockTime = 60

    function blockMainThread() {
      const currentLoad = loadRef.current
      if (currentLoad > 0) {
        const blockTime = maxBlockTime * (currentLoad / 100)
        const start = performance.now()
        // busy wait to block main thread
        while (performance.now() - start < blockTime) {
          // intentionally blocking
        }
      }
      rafId = requestAnimationFrame(blockMainThread)
    }

    rafId = requestAnimationFrame(blockMainThread)
    return () => cancelAnimationFrame(rafId)
  }, [])
}
