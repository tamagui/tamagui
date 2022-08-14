import { useEffect, useState } from 'react'
import { XStack } from 'tamagui'

export const HeaderFloating = (props: any) => {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof document !== 'undefined') {
    useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 250)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <XStack
      className="ease-out all ms200"
      y={isScrolled ? -1 : -60}
      o={isScrolled ? 1 : 0}
      py={0}
      bbw={1}
      bbc="$borderColor"
      zi={10000000}
      // @ts-ignore
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bc="$backgroundHover"
      elevation="$2"
    >
      {props.children}
    </XStack>
  )
}
