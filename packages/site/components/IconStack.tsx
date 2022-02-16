import React from 'react'
import { StackProps, YStack } from 'tamagui'

export const IconStack = (props: StackProps) => {
  return <YStack mb="$4" br={100} backgroundColor="$bg" p="$2" als="flex-start" {...props} />
}
