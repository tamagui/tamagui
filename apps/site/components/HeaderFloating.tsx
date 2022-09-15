import { throttle } from '@github/mini-throttle'
import React, { useId } from 'react'
import { useEffect, useState } from 'react'
import { XStack, YStack } from 'tamagui'

import { ContainerLarge } from '../components/Container'
import { Header } from '../components/Header'
import { HeaderProps } from './HeaderProps'

export const HeaderFloating = ({
  alwaysFloating,
  ...props
}: HeaderProps & { alwaysFloating?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const shown = alwaysFloating ?? isScrolled
  const shiftDown = !isScrolled && alwaysFloating

  if (typeof document !== 'undefined') {
    useEffect(() => {
      const onScroll = throttle(() => {
        setIsScrolled(window.scrollY > 30)
      }, 20)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <XStack
      className="blur ease-out all ms200"
      y={shown ? (shiftDown ? 7 : -1) : -60}
      o={shown ? 1 : 0}
      py={0}
      bbc="$borderColor"
      zi={10000000}
      // @ts-ignore
      pos="fixed"
      top={0}
      my={-1}
      left={0}
      right={0}
      elevation={shiftDown ? 0 : '$3'}
    >
      <YStack className="all ease-in ms200" o={isScrolled ? 0.4 : 0} fullscreen bc="$background" />
      <ContainerLarge>
        <Header floating {...props} />
      </ContainerLarge>
    </XStack>
  )
}
