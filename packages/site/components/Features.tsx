import React from 'react'
import { Paragraph, Text, XStack, YStack } from 'tamagui'

import { CheckCircle } from './CheckCircle'

export const Features = ({ items, ...props }: any) => {
  return (
    <YStack space {...props}>
      {items.map((feature, i) => (
        <XStack tag="li" key={i}>
          <CheckCircle />
          <Paragraph color="$gray10">{feature}</Paragraph>
        </XStack>
      ))}
    </YStack>
  )
}
