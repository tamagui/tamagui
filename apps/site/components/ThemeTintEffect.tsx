import { useEffect } from 'react'
import { useTheme } from 'tamagui'

export const ThemeTintEffect = () => {
  const theme = useTheme()
  const color = theme.color5.val

  useEffect(() => {
    document.querySelector('#theme-color')?.setAttribute('content', color)
    document.body.style.backgroundColor = color
  }, [color])

  return null
}
