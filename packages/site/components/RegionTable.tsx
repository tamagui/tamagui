import React from 'react'
import { StackProps, YStack } from 'tamagui'

export function RegionTable(props: StackProps) {
  console.warn('todo')
  return (
    <YStack
      // TODO change to this:
      // theme="alt1"
      // bc="$background"
      bc="$bg2"
      tag="table"
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
