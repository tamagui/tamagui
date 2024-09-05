import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tamagui UI"
      subTitle="The interesting parts"
      theme="blue"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
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
                        content: `Multi-component APIs`,
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
                        content: `Themeable, sizeable`,
                      },
                    ],
                  },
                ],
              },

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
                        content: `The native prop`,
                      },
                    ],
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
