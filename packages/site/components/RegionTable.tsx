import React from 'react'
import { YStack, YStackProps } from 'tamagui'

export function RegionTable(props: YStackProps) {
  return (
    <YStack
      theme="alt1"
      bc="$background"
      tag="table"
      // @ts-ignore
      display="table"
      // @ts-ignore
      role="region"
      tabIndex={0}
      position="relative"
      borderRadius="$2"
      borderWidth={1}
      borderColor="$borderColorHover"
      overflow="hidden"
      p="$2"
      mb="$4"
      {...props}
    />
  )
}
