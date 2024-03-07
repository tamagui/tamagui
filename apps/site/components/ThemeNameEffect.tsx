import { memo, startTransition, useLayoutEffect, useState } from 'react'
import type { ColorTokens } from 'tamagui'
import { Stack, isClient, useTheme } from 'tamagui'

export const ThemeNameEffect = memo(
  ({ colorKey = '$color1' }: { colorKey?: ColorTokens }) => {
    const theme = useTheme()
    const [isActive, setIsActive] = useState(false)
    const color = theme[colorKey]!.val

    if (isClient) {
      useLayoutEffect(() => {
        if (!isActive) return
        document.querySelector('#theme-color')?.setAttribute('content', color)
        document.body.style.setProperty('background-color', color, 'important')
      }, [isActive, color])
    }

    return (
      <>
        <Stack
          id="theme-name-effect"
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
