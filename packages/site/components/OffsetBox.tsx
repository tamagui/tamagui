import React from 'react'
import { StackProps, YStack } from 'tamagui'

export const OffsetBox = (props: StackProps & { size?: 'hero' }) => {
  return (
    <YStack
      {...(props.size === 'hero' && {
        $gtSm: { mx: '$-5' },
        $gtMd: { mx: '$-10' },
      })}
      {...props}
    />
  )
}
