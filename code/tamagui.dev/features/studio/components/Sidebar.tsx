import React, { memo } from 'react'
import type { YStackProps } from 'tamagui'
import { H4, H5, ScrollView, Spacer, XStack, YStack, styled } from 'tamagui'

import { sidebarWidth } from '../constants'

export const SidebarTitle = styled(H4, {
  fontSize: 16,
  pt: '$2',
  px: '$3',
})

export const SidebarRight = memo(function SidebarRight(props: {
  children: React.ReactNode
}) {
  return (
    <YStack
      blw={1}
      elevation="$1"
      blc="$borderColor"
      bg="$background"
      pos="absolute"
      t={0}
      r={0}
      b={0}
      w={sidebarWidth}
      zi={100}
    >
      <ScrollView>{props.children}</ScrollView>
    </YStack>
  )
})

export const SidebarLeft = memo(function SidebarLeft(props: {
  children: React.ReactNode
}) {
  return (
    <YStack
      brw={1}
      brc="$borderColor"
      bg="$background"
      pos="absolute"
      elevation="$1"
      t={0}
      l={0}
      b={0}
      w={sidebarWidth}
      zi={1000}
    >
      <ScrollView>
        <YStack>{props.children}</YStack>
      </ScrollView>
    </YStack>
  )
})

export type SidebarPanelProps = YStackProps & {
  title?: string
  controls?: React.ReactNode
  scrollable?: boolean
}

export const SidebarPanel = ({
  children,
  title,
  controls,
  space,
  scrollable,
  separator,
  maxHeight,
  ...props
}: SidebarPanelProps) => {
  return (
    <YStack
      pb="$3"
      px={scrollable ? 0 : '$3'}
      py="$2"
      bbw={1}
      bbc="$borderColor"
      {...props}
    >
      {!!(title || controls) && (
        <XStack px={scrollable ? '$3' : 0} ai="center" h="$3">
          {!!title && (
            <H5 size="$2" userSelect="none" cursor="default">
              {title}
            </H5>
          )}

          <Spacer flex />

          <XStack ai="center" space="$2">
            {controls}
          </XStack>
        </XStack>
      )}

      <YStack space={space} separator={separator}>
        {scrollable ? (
          <ScrollView maxHeight={maxHeight} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </YStack>
    </YStack>
  )
}

export const SidebarPanelUnpad = styled(YStack, {
  mt: '$-2',
  mx: '$-3',
})
