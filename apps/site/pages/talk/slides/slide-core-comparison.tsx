import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tailwind?"
      subTitle="🌶️"
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
                          marginBottom: 60,
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
                          marginBottom: 60,
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
                          marginBottom: 60,
                          display: 'inline-flex',
                        },
                        content: `Minimal CSS`,
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
                          marginBottom: 60,
                          display: 'inline-flex',
                        },
                        content: `Native + Web`,
                      },
                    ],
                  },
                ],
              },

              {
                type: 'vertical',
                title: `Different`,
                content: [
                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        props: {
                          size: '$8',
                          marginBottom: 0,
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
                          size: '$8',
                          marginBottom: 0,
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
                          size: '$8',
                          marginBottom: 0,
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
                          size: '$8',
                          marginBottom: 0,
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
                          size: '$8',
                          marginBottom: 0,
                          display: 'inline-flex',
                        },
                        content: `Compiler optimization++`,
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
                          size: '$8',
                          marginBottom: 0,
                          display: 'inline-flex',
                        },
                        content: `Powerful themes`,
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
                          size: '$8',
                          marginBottom: 0,
                          display: 'inline-flex',
                        },
                        content: `No editor plugin`,
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
                          size: '$8',
                          marginBottom: 0,
                          display: 'inline-flex',
                        },
                        content: `Has extra bundle size`,
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
