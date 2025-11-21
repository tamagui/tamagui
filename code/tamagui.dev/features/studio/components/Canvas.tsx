'use client'

import type { YStackProps } from 'tamagui'
import { EnsureFlexed, YStack, styled } from 'tamagui'

import { sidebarWidth } from '../constants'

export const CanvasFrame = styled(YStack, {
  fullscreen: true,
  bg: '$background',
  items: 'center',
  justify: 'center',
  overflow: 'hidden',
})

export const CanvasInner = styled(YStack, {
  maxW: `calc(100vw - ${sidebarWidth * 2}px)`,
  mx: 'auto',
  pt: 0,
  height: '100%',
  width: '100%',
})

export const Canvas = ({ children, ...props }: YStackProps) => {
  return (
    <CanvasFrame {...props}>
      <CanvasInner>
        <EnsureFlexed />
        {children}
      </CanvasInner>
    </CanvasFrame>
  )
}

export const CanvasArtboard = styled(YStack, {
  borderWidth: 1,
  borderColor: '$borderColor',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  maxW: 1000,
  maxH: 1000,
  items: 'center',
  justify: 'center',
  minW: 300,
})
