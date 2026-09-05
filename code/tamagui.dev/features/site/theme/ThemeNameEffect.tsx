import { ThemeTint, useTint } from '@tamagui/logo'
import { memo, useEffect } from 'react'
import type { ColorTokens } from 'tamagui'
import { useTheme } from 'tamagui'

type Props = {
  colorKey?: ColorTokens
  disableTint?: boolean
}

// keeps the browser chrome color and the body background (what shows when you
// overscroll) in sync with the active theme. the site layout renders exactly
// one of these - pages must not add their own or they fight over document.body.
export const ThemeNameEffect = memo(({ colorKey = 'color1', disableTint }: Props) => {
  const Tint = useTint()

  useEffect(() => {
    Tint.setTintIndex(3)
  }, [])

  return (
    <ThemeTint disable={disableTint}>
      <BodyColor colorKey={colorKey} />
    </ThemeTint>
  )
})

const BodyColor = ({ colorKey }: { colorKey: ColorTokens }) => {
  const color = useTheme()[colorKey]?.val

  useEffect(() => {
    if (!color) return
    document.querySelector('#theme-color')?.setAttribute('content', color)
    document.body.style.setProperty('background-color', color, 'important')
  }, [color])

  return null
}
