import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="vs Tailwind 🌶️"
      theme="yellow"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'vertical',
                title: `Similar`,
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
                        content: `Inline styles`,
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
                        content: `Build-time optimized`,
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
                        content: `RN + Web`,
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
                        content: `Performance`,
                      },
                    ],
                  },
                ],
              },

              {
                type: 'vertical',
                title: `Improves`,
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
                        content: `Everything is typed`,
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
                        content: `Properly merge props`,
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
                        content: `De/re-structure styles`,
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
                        content: `No dark:red-300`,
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
                        content: `No editor plugin`,
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
