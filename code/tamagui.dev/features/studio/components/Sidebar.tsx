import type React from 'react'
import { memo } from 'react'
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
      borderLeftWidth={1}
      elevation="$1"
      borderLeftColor="$borderColor"
      bg="$background"
      position="absolute"
      t={0}
      r={0}
      b={0}
      width={sidebarWidth}
      z={100}
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
      borderLeftWidth={1}
      borderRightColor="$borderColor"
      bg="$background"
      position="absolute"
      elevation="$1"
      data-tauri-drag-region
      t={0}
      l={0}
      b={0}
      width={sidebarWidth}
      z={1000}
    >
      <ScrollView data-tauri-drag-region>
        <YStack data-tauri-drag-region>{props.children}</YStack>
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
  scrollable,
  maxH,
  gap,
  ...props
}: SidebarPanelProps) => {
  return (
    <YStack
      pb="$3"
      px={scrollable ? 0 : '$3'}
      py="$2"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      {...props}
    >
      {!!(title || controls) && (
        <XStack px={scrollable ? '$3' : 0} items="center" height="$3">
          {!!title && (
            <H5 size="$2" select="none" cursor="default">
              {title}
            </H5>
          )}

          <Spacer flex={1} />

          <XStack items="center" gap="$2">
            {controls}
          </XStack>
        </XStack>
      )}

      <YStack gap={gap}>
        {scrollable ? (
          <ScrollView maxH={maxH} showsVerticalScrollIndicator={false}>
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
