import { memo, startTransition, useEffect, useState } from 'react'
import type { ColorTokens } from 'tamagui'
import { Stack, useTheme } from 'tamagui'

export const ThemeNameEffect = memo(
  ({ colorKey = '$color1' }: { colorKey?: ColorTokens }) => {
    const theme = useTheme()
    const [isActive, setIsActive] = useState(false)
    const color = theme[colorKey].val

    useEffect(() => {
      if (!isActive) return
      document.querySelector('#theme-color')?.setAttribute('content', color)
      document.body.style.backgroundColor = color
    }, [isActive, color])

    return (
      <>
        <Stack
          onLayout={() => {
            startTransition(() => {
              setIsActive(true)
            })
          }}
        />
      </>
    )
  }
)
