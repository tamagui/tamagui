'use client'

import type { YStackProps} from 'tamagui';
import { EnsureFlexed, YStack, styled } from 'tamagui'

import { sidebarWidth } from '../constants'

export const CanvasFrame = styled(YStack, {
  fullscreen: true,
  backgroundColor: '$background',
  ai: 'center',
  jc: 'center',
  ov: 'hidden',
})

export const CanvasInner = styled(YStack, {
  maw: `calc(100vw - ${sidebarWidth * 2}px)`,
  mx: 'auto',
  pt: 0,
  h: '100%',
  w: '100%',
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
  w: '100%',
  h: '100%',
  ov: 'hidden',
  maw: 1000,
  mah: 1000,
  ai: 'center',
  jc: 'center',
  miw: 300,
})
