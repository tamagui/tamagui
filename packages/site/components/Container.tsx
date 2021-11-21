import React from 'react'
import { StackProps, YStack } from 'tamagui'

export const Container = (props: StackProps) => {
  return (
    <YStack
      mx="auto"
      px="$4"
      width="100%"
      $gtSm={{
        maxWidth: 700,
      }}
      $gtMd={{
        maxWidth: 700,
      }}
      {...props}
    />
  )
}

export const ContainerLarge = (props: StackProps) => {
  return (
    <YStack
      mx="auto"
      px="$4"
      width="100%"
      $gtSm={{
        maxWidth: 960,
      }}
      $gtMd={{
        maxWidth: 1040,
      }}
      {...props}
    />
  )
}
