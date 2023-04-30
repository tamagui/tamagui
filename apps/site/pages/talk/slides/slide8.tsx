import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tamagui"
      subTitle="Features"
      theme="blue"
      steps={[
        [
          {
            type: 'vertical',
            content: [
              {
                type: 'bullet-point',
                slim: true,
                content: [
                  {
                    type: 'text',
                    content: `Themeable`,
                  },
                ],
              },

              {
                type: 'bullet-point',
                slim: true,
                content: [
                  {
                    type: 'text',
                    content: `Sizeable`,
                  },
                ],
              },

              {
                type: 'bullet-point',
                slim: true,
                content: [
                  {
                    type: 'text',
                    content: `Radix-y composable components`,
                  },
                ],
              },

              {
                type: 'bullet-point',
                slim: true,
                content: [
                  {
                    type: 'code-inline',
                    content: `<Adapt />`,
                  },
                ],
              },
            ],
          },
        ],
      ]}
    />
  )
})
