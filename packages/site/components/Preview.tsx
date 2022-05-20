import React from 'react'
import { YStack, YStackProps } from 'tamagui'

export const Preview = (props: YStackProps) => (
  <YStack
    data-preview
    margin={0}
    overflow="visible"
    borderWidth={1}
    borderColor="$borderColor"
    borderTopLeftRadius="$3"
    borderTopRightRadius="$3"
    mb="$-1"
    padding="$3"
    position="relative"
    ai="flex-start"
    {...props}
  />
)
