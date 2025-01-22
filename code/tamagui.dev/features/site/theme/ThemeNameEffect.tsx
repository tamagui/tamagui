import { memo, startTransition, useLayoutEffect, useState } from 'react'
import type { ColorTokens } from 'tamagui'
import { YStack, isClient, useDidFinishSSR, useTheme, useThemeName } from 'tamagui'

export const ThemeNameEffect = memo(
  ({ colorKey = '$color1' }: { colorKey?: ColorTokens }) => {
    const isHydrated = useDidFinishSSR()
    const theme = useTheme()
    const themeName = useThemeName()
    const [isActive, setIsActive] = useState(false)

    const color = theme[colorKey]?.val

    if (isClient) {
      useLayoutEffect(() => {
        if (!isHydrated) return
        if (!isActive) return
        document.querySelector('#theme-color')?.setAttribute('content', color)
        document.body.style.setProperty('background-color', color, 'important')
      }, [isHydrated, isActive, color])
    }

    return (
      <>
        <YStack
          id="theme-name-effect"
          ref={() => {
            startTransition(() => {
              setIsActive(true)
            })
          }}
        />
        <style>
          {`
body {
  background: var(--${colorKey.slice(1)}) !important;
}
`}
        </style>
      </>
    )
  }
)
