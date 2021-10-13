import React from 'react'
import { StackProps, YStack } from 'tamagui'

export const Preview = (props: StackProps) => (
  <YStack
    data-preview
    margin={0}
    overflow="auto"
    borderWidth={1}
    borderColor="$borderColor"
    borderTopLeftRadius="$3"
    borderTopRightRadius="$3"
    padding="$3"
    position="relative"
    ai="flex-start"
    {...props}
  />
)
