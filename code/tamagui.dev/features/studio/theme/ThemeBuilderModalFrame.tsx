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

  return <></>
}

export const ModalTitle = styled(H4, {
  fontFamily: '$mono',
  size: '$6',
  letterSpacing: 2,
  animation: 'quick',
  ellipsis: true,
})
