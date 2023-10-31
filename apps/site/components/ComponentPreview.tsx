import React from 'react'
import { YStack, YStackProps } from 'tamagui'

export const Preview = (props: YStackProps) => (
  <YStack
    data-preview
    margin={0}
    overflow="visible"
    borderWidth={1}
    borderColor="$borderColor"
    borderRadius="$3"
    padding="$3"
    position="relative"
    ai="flex-start"
    {...props}
  />
)
