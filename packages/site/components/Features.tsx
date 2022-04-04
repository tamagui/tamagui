import React from 'react'
import { Paragraph, Text, XStack, YStack } from 'tamagui'

import { CheckCircle } from './CheckCircle'

export const Features = ({ items, ...props }: any) => {
  return (
    <YStack space {...props}>
      {items.map((feature, i) => (
        <XStack tag="li" key={i}>
          <Text color="$green9">
            <CheckCircle />
          </Text>
          <Paragraph color="$gray11">{feature}</Paragraph>
        </XStack>
      ))}
    </YStack>
  )
}
