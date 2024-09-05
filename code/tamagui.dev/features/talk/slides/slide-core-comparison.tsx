import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tailwind?"
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
                    type: 'space',
                  },

                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        props: {
                          size: '$10',
                          marginBottom: 70,
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
                          marginBottom: 70,
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
                          marginBottom: 70,
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
                          marginBottom: 70,
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
                    type: 'space',
                  },

                  {
                    type: 'bullet-point',
                    slim: true,
                    content: [
                      {
                        type: 'text',
                        props: {
                          size: '$9',
                          marginBottom: 20,
                          display: 'inline-flex',
                        },
                        content: <>Has extra bundle size ❌</>,
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
                          size: '$9',
                          marginBottom: 20,
                          display: 'inline-flex',
                        },
                        content: `... but compiler makes up`,
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
                          size: '$9',
                          marginBottom: 20,
                          display: 'inline-flex',
                        },
                        content: `Everything is typed w/o plugin`,
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
                          size: '$9',
                          marginBottom: 20,
                          display: 'inline-flex',
                        },
                        content: `Truly dynamic styles`,
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
                          size: '$9',
                          marginBottom: 20,
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
                          size: '$9',
                          marginBottom: 20,
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
                          size: '$9',
                          marginBottom: 20,
                          display: 'inline-flex',
                        },
                        content: `Powerful themes`,
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
