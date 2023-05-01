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
                    props: {
                      size: '$10',
                      display: 'inline-flex',
                      my: '$4',
                    },
                    content: `Radix-like composable component APIs`,
                  },
                ],
              },

              {
                type: 'bullet-point',
                slim: true,
                content: [
                  {
                    type: 'text',
                    props: {
                      size: '$10',
                      display: 'inline-flex',
                      my: '$4',
                    },
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
                    props: {
                      size: '$10',
                      display: 'inline-flex',
                      my: '$4',
                    },
                    content: `Sizeable`,
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

              {
                type: 'bullet-point',
                slim: true,
                content: [
                  {
                    type: 'text',
                    props: {
                      size: '$10',
                      display: 'inline-flex',
                      my: '$4',
                    },
                    content: `Prop:`,
                  },
                  {
                    type: 'code-inline',
                    content: `native`,
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
