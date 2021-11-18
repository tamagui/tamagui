import React from 'react'
import { StackProps, YStack } from 'tamagui'

export function RegionTable(props: StackProps) {
  return (
    <YStack
      tag="table"
      display="table"
      role="region"
      tabIndex={0}
      position="relative"
      bc="$bg2"
      borderRadius="$2"
      borderWidth={1}
      borderColor="$borderColor2"
      overflow="hidden"
      p="$2"
      mb="$4"
      {...props}
    />
  )
}
