import { memo, startTransition, useEffect, useState } from 'react'
import { Stack, useTheme } from 'tamagui'

export const ThemeNameEffect = memo(() => {
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false)
  const color = theme.color1.val

  useEffect(() => {
    if (!isActive) return
    document.querySelector('#theme-color')?.setAttribute('content', color)
    document.body.style.backgroundColor = color
  }, [isActive, color])

  return (
    <Stack
      onLayout={() => {
        startTransition(() => {
          setIsActive(true)
        })
      }}
    />
  )
})
