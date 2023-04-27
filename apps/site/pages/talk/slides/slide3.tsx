import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      subTitle="Style library"
      theme="yellow"
      steps={[
        [
          {
            type: 'code',
            content: `import { Text, styled } from '@tamagui/core'

export const Heading = styled(Text, {
  tag: 'h1',
  color: '$color',
  backgroundColor: '$background',

  $small: {
    fontSize: 18
  },

  variants: {
    size: {
      large: {
        fontSize: 22,
      },
    },
  },
})`,
          },
        ],
      ]}
    />
  )
})
