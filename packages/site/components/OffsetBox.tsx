import React from 'react'
import { YStack, YStackProps } from 'tamagui'

export const OffsetBox = (props: YStackProps & { size?: 'hero' }) => {
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
