import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'
import { Paragraph, YStack } from 'tamagui'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      theme="blue"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'callout',
            content: <>I wanted to save time building&nbsp;an&nbsp;app...</>,
          },

          {
            type: 'content',

            content: (
              <YStack marginTop={-100} ai="center">
                <Paragraph theme="alt2" size="$10">
                  (Ironically)
                </Paragraph>
              </YStack>
            ),
          },
        ],

        [
          {
            type: 'callout',
            content: `... but my universal app felt terrible 😭`,
          },
        ],
      ]}
    />
  )
})
