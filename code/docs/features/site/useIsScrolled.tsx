import { useState, useEffect } from 'react'

const getIsScrolled = () => window.scrollY > 10
export const useIsScrolled = () => {
  const [x, setX] = useState(false)

  useEffect(() => {
    setX(getIsScrolled)

    const controller = new AbortController()

    window.addEventListener(
      'scroll',
      () => {
        setX(getIsScrolled)
      },
      {
        signal: controller.signal,
      }
    )

    return () => {
      controller.abort()
    }
  }, [])

  return x
}
