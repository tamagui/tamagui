import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tamagui"
      subTitle="Universal UI kit"
      theme="green"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Radix-like composable components',
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Component kit which Adapts to each platform',
              },
            ],
          },

          {
            type: 'split-horizontal',
            content: [
              {
                type: 'image',
                image: require('../images/select-custom.png').default,
              },
              {
                type: 'image',
                image: require('../images/select-native.png').default,
              },
            ],
          },
        ],
      ]}
    />
  )
})
