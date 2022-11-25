import React from 'react'
import { Paragraph, XStack, YStack } from 'tamagui'

import { CheckCircle } from './CheckCircle'

export const Features = ({ items, size, ...props }: any) => {
  return (
    <YStack mt="$4" mb="$6" {...props} space="$4">
      {items.map((feature, i) => (
        <XStack tag="li" key={i}>
          <YStack mt={-5}>
            <CheckCircle />
          </YStack>
          <Paragraph size={size} color="$gray11">
            {feature}
          </Paragraph>
        </XStack>
      ))}
    </YStack>
  )
}
