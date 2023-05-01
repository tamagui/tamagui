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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
                        props: {
                          size: '$10',
                          marginBottom: 40,
                          display: 'inline-flex',
                        },
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
