import { memo } from 'react'

import { Slide } from '../../components/Slide'

export default memo(() => {
  return (
    <Slide
      title="What is Tamagui"
      theme="blue"
      steps={[
        {
          bulletPoints: [
            [
              {
                type: 'code',
                content: `@tamagui/core`,
              },
              {
                type: 'text',
                content: `Style library that unifies React Native and web`,
              },
            ],

            [
              {
                type: 'code',
                content: `@tamagui/static`,
              },
              {
                type: 'text',
                content: `Optimizing compiler that works with core`,
              },
            ],

            [
              {
                type: 'code',
                content: `tamagui`,
              },
              {
                type: 'text',
                content: `Complete universal component kit`,
              },
            ],
          ],
        },
      ]}
    />
  )
})
