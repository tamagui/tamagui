import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      subTitle="Features"
      theme="pink"
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
                          display: 'inline-flex',
                        },
                        content: `Pseudo styles`,
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
                          display: 'inline-flex',
                        },
                        content: `Animation drivers`,
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
                          fontSize: 50,
                          marginTop: 60,
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
                          fontSize: 50,
                          marginTop: 60,
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
