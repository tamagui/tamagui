import React from 'react'
import { Paragraph, Text, XStack } from 'tamagui'

import { CheckCircle } from './CheckCircle'

export const Features = (props: any) => {
  return props.items.map((feature, i) => (
    <XStack py="$1" tag="li" key={i}>
      <Text color="$green9">
        <CheckCircle />
      </Text>
      <Paragraph color="$gray11">{feature}</Paragraph>
    </XStack>
  ))
}
