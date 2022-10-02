import React from 'react'
import { Paragraph, XStack, YStack } from 'tamagui'

import { CheckCircle } from './CheckCircle'

export const Features = ({ items, size, ...props }: any) => {
  return (
    <YStack space={size ?? '$4'} {...props}>
      {items.map((feature, i) => (
        <XStack tag="li" key={i}>
          <CheckCircle />
          <Paragraph size={size} color="$gray11">
            {feature}
          </Paragraph>
        </XStack>
      ))}
    </YStack>
  )
}
