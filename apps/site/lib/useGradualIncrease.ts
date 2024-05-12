import { useEffect, useState } from 'react'

export function useGradualIncrease(hasCopied = false, timeout = 1500) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (hasCopied) {
      const startTime = Date.now()
      const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min((elapsedTime / timeout) * 100, 100)
        setValue(progress)
      }, timeout / 100)

      return () => clearInterval(intervalId)
    }

    setValue(0)
  }, [timeout, hasCopied])

  return value
}
