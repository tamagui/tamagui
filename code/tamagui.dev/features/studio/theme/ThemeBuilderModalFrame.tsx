import type React from 'react'
import { H4, XStack, YStack, styled, useWindowDimensions } from 'tamagui'

import {
  MODAL_MAX_HEIGHT,
  MODAL_MIN_HEIGHT,
  MODAL_WIDTH,
  SIDEBAR_WIDTH,
} from '../constants'

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
      {/* <YStack
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
      </YStack> */}

      <XStack
        animation="quick"
        // animateOnly={['transition']}
        data-tauri-drag-region
        // disableClassName
        position="absolute"
        width={MODAL_WIDTH + SIDEBAR_WIDTH}
        z={1000000}
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
          rounded="$8"
          borderTopRightRadius={isCentered ? '$8' : 0}
          borderBottomRightRadius={isCentered ? '$8' : 0}
          borderBottomLeftRadius={isCentered ? '$8' : 0}
          overflow="hidden"
          width={MODAL_WIDTH}
          height={isCentered ? modalHeight : `calc(100vh - ${HEADER_BAR_HEIGHT}px)`}
          borderColor="$borderColor"
          borderWidth={1}
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
          position="absolute"
          r={0}
          t={0}
          b={0}
          z={-1}
          animation="quick"
          width={SIDEBAR_WIDTH + 100}
          borderTopRightRadius="$8"
          borderBottomRightRadius="$8"
          pl={80}
          overflow="hidden"
          flex={1}
          bg="$color2"
          elevation="$8"
          borderColor="$borderColor"
          borderWidth={1}
          opacity={hasSidebar ? 1 : 0}
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
  letterSpacing: 2,
  animation: 'quick',
  ellipsis: true,
})
