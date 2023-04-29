import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      subTitle="Features"
      theme="yellow"
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
                        content: `Responsive styles`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Psuedo styles`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Tokens`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Themes`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Nesting`,
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
                        content: `Typed variants`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `className, tag, etc`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Functional variants`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Shorthands`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        content: `Unified RN API's`,
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
