import { LogoWords } from '@tamagui/logo'
import React from 'react'
import { H4, XStack, YStack, styled, useWindowDimensions } from 'tamagui'

import {
  MODAL_MAX_HEIGHT,
  MODAL_MIN_HEIGHT,
  MODAL_WIDTH,
  SIDEBAR_WIDTH,
} from '~/src/constants'

export const ThemeBuilderModalFrame = ({
  children,
  isCentered,
  sidebar,
  noBottomBar,
}: {
  children: React.ReactNode
  isCentered?: boolean
  sidebar?: React.ReactNode
  noBottomBar?: boolean
}) => {
  const hasSidebar = !!sidebar
  const windowDimensions = useWindowDimensions()
  const spaceForVerticalNonModalElements = 96
  const modalHeight = Math.min(
    MODAL_MAX_HEIGHT,
    Math.max(windowDimensions.height - spaceForVerticalNonModalElements, MODAL_MIN_HEIGHT)
  )

  if (!windowDimensions.width) {
    return null
  }

  const x =
    -windowDimensions.width / 2 +
    MODAL_WIDTH / 2 +
    (hasSidebar ? SIDEBAR_WIDTH / 2 : SIDEBAR_WIDTH)
  const y = windowDimensions.height / 2 - modalHeight / 2 - (noBottomBar ? 0 : 16)

  const HEADER_BAR_HEIGHT = 64

  return (
    <>
      <YStack
        fullscreen
        data-tauri-drag-region
        zi={10000}
        pointerEvents={isCentered ? 'auto' : 'none'}
        style={{
          backdropFilter: isCentered ? 'blur(100px)' : 'none',
          WebkitBackdropFilter: isCentered ? 'blur(100px)' : 'none', // safari
          transition: 'all 200ms',
        }}
      >
        <YStack
          data-tauri-drag-region
          pos="absolute"
          t={0}
          l={0}
          r={0}
          ai="center"
          py={10}
          scale={0.75}
        >
          <LogoWords grayscale />
        </YStack>
      </YStack>

      <XStack
        animation="quick"
        // animateOnly={['transition']}
        data-tauri-drag-region
        // disableClassName
        pos="absolute"
        w={MODAL_WIDTH + SIDEBAR_WIDTH}
        zi={1000000}
        t={isCentered ? 0 : HEADER_BAR_HEIGHT}
        r={0}
        x={SIDEBAR_WIDTH}
        y={0}
        {...(isCentered && {
          x,
          y,
        })}
        style={{
          transitionProperty: 'transform',
        }}
      >
        <YStack
          bg="$color2"
          br="$8"
          btrr={isCentered ? '$8' : 0}
          bbrr={isCentered ? '$8' : 0}
          bblr={isCentered ? '$8' : 0}
          ov="hidden"
          w={MODAL_WIDTH}
          h={isCentered ? modalHeight : `calc(100vh - ${HEADER_BAR_HEIGHT}px)`}
          bc="$borderColor"
          bw={1}
          $theme-dark={{
            elevation: '$8',
          }}
          $theme-light={{
            elevation: '$6',
          }}
        >
          {children}
        </YStack>
        <YStack
          pos="absolute"
          r={0}
          t={0}
          b={0}
          zi={-1}
          animation="quick"
          w={SIDEBAR_WIDTH + 100}
          btrr="$8"
          bbrr="$8"
          pl={80}
          ov="hidden"
          f={1}
          bg="$color2"
          elevation="$8"
          bc="$borderColor"
          bw={1}
          o={hasSidebar ? 1 : 0}
          x={hasSidebar ? 0 : -SIDEBAR_WIDTH}
          $theme-light={{
            elevation: '$8',
            bg: '$color3',
            shadowOpacity: 1,
          }}
        >
          {sidebar}
        </YStack>
      </XStack>
    </>
  )
}

export const ModalTitle = styled(H4, {
  fontFamily: '$mono',
  size: '$6',
  ls: 2,
  animation: 'quick',
  ellipse: true,
})
