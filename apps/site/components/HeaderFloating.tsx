import { throttle } from '@github/mini-throttle'
import { useEffect, useState } from 'react'
import { XStack, YStack, isClient } from 'tamagui'

import { ContainerLarge } from '../components/Container'
import { Header } from '../components/Header'
import { HeaderProps } from './HeaderProps'

export const HeaderFloating = ({
  alwaysFloating,
  ...props
}: HeaderProps & { alwaysFloating?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const shown = alwaysFloating ?? isScrolled
  const shouldPad = !isScrolled && alwaysFloating

  if (isClient) {
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
    <>
      <XStack
        className="blur ease-out all ms200"
        y={shown ? 1 : -60}
        o={shown ? 1 : 0}
        bbc="$borderColor"
        zi={50000}
        // @ts-ignore
        pos="fixed"
        top={0}
        my={-1}
        left={0}
        right={0}
        elevation={shouldPad ? 0 : '$3'}
        py={shouldPad ? '$2' : 0}
      >
        <YStack
          className="all ease-in ms200"
          o={isScrolled ? 0.9 : 0}
          fullscreen
          bc="$background"
        />
        <ContainerLarge>
          <Header floating {...props} />
        </ContainerLarge>
      </XStack>
      {/* push page down */}
      {!!alwaysFloating && <YStack height={54} w="100%" />}
    </>
  )
}
