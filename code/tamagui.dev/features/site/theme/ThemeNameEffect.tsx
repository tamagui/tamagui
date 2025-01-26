import { ThemeTint, useTint } from '@tamagui/logo'
import { memo, useEffect, useState } from 'react'
import type { ColorTokens, ThemeName } from 'tamagui'
import { YStack, isClient, useDidFinishSSR, useTheme, useThemeName } from 'tamagui'

type Props = { colorKey?: ColorTokens; theme?: ThemeName | null; children?: any }

export const ThemeNameEffect = memo((props: Props) => {
  const Tint = useTint()

  useEffect(() => {
    if (!props.theme) {
      Tint.setTintIndex(3)
    } else {
      Tint.setTintIndex(Tint.tints.findIndex((x) => x === props.theme))
    }
  }, [props.theme])

  return (
    <ThemeTint>
      <Inner {...props} />
      {props.children}
    </ThemeTint>
  )
})

const Inner = ({ colorKey = '$color1' }: Props) => {
  const isHydrated = useDidFinishSSR()
  const theme = useTheme()
  const themeName = useThemeName()
  const [isActive, setIsActive] = useState(false)

  const color = theme[colorKey]?.val

  console.info(`theme`, themeName, color, colorKey)

  if (isClient) {
    useEffect(() => {
      if (!isHydrated) return
      if (!isActive) return
      document.querySelector('#theme-color')?.setAttribute('content', color)
      // document.body.style.setProperty('background-color', color, 'important')
    }, [isHydrated, isActive, color])
  }

  return (
    <>
      <YStack
        id={`theme-name-effect`}
        ref={() => {
          setIsActive(true)
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
