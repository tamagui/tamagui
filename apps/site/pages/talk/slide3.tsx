import React from 'react'
import { memo } from 'react'

import { Slide } from '../../components/Slide'

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      theme="green"
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
