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
          ],
        },
      ]}
    />
  )
})
