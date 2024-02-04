import React from 'react'
import { Paragraph, XStack, YStack } from 'tamagui'

import { CheckCircle } from './CheckCircle'

export const Features = ({ items, size, large, ...props }: any) => {
  return (
    <YStack mt="$4" mb="$6" {...props} gap="$3">
      {items.map((feature, i) => (
        <XStack tag="li" key={i}>
          <YStack y={1} mt={large ? 1 : -2}>
            <CheckCircle />
          </YStack>
          <Paragraph size={size ?? (large ? '$6' : '$4')} color="$gray11">
            {feature}
          </Paragraph>
        </XStack>
      ))}
    </YStack>
  )
}
