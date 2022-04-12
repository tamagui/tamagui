import throttle from 'lodash.throttle'
import { useEffect, useState } from 'react'
import { Theme, XStack } from 'tamagui'

import { ContainerLarge } from '../components/Container'
import { Header } from '../components/Header'

export const HeaderFloating = (props: any) => {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof document !== 'undefined') {
    useEffect(() => {
      const onScroll = throttle(() => {
        setIsScrolled(window.scrollY > 250)
      }, 50)
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
      py={0}
      bbw={1}
      bbc="$borderColor"
      zi={1000}
      // @ts-ignore
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bc="$backgroundHover"
      elevation="$2"
    >
      <ContainerLarge>
        <Header floating {...props} />
      </ContainerLarge>
    </XStack>
  )
}
