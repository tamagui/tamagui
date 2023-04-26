import { memo } from 'react'

import { Slide } from '../../components/Slide'

export default memo(() => {
  return (
    <Slide
      title="What is Tamagui"
      theme="blue"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'code-inline',
                content: `@tamagui/core`,
              },
              {
                type: 'text',
                content: `Style library that unifies React Native and web`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'code-inline',
                content: `@tamagui/static`,
              },
              {
                type: 'text',
                content: `Optimizing compiler that works with core`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'code-inline',
                content: `tamagui`,
              },
              {
                type: 'text',
                content: `Complete universal component kit`,
              },
            ],
          },
        ],
      ]}
    />
  )
})
