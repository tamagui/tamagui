import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'
const highlightCode = createCodeHighlighter()

export default memo(() => {
  return (
    <Slide
      title="@tamagui/static"
      subTitle="Optimizing compiler"
      stepsStrategy="replace"
      theme="green"
      steps={[
        [
          {
            type: 'split-horizontal',
            variant: 'centered',
            content: [
              {
                type: 'vertical',
                content: [
                  {
                    type: 'bullet-point',
                    props: {
                      paddingBottom: 100,
                    },
                    content: [
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 50,
                          paddingVertical: 20,
                          display: 'inline-flex',
                        },
                        content: `Extracting CSS`,
                      },
                    ],
                  },

                  {
                    type: 'bullet-point',
                    props: {
                      paddingBottom: 100,
                    },
                    content: [
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 50,
                          paddingVertical: 20,
                          display: 'inline-flex',
                        },
                        content: `Partial evaluation`,
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
                    props: {
                      paddingBottom: 100,
                    },
                    content: [
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 50,
                          paddingVertical: 20,
                          display: 'inline-flex',
                        },
                        content: `Tree-flattening`,
                      },
                    ],
                  },
                  {
                    type: 'bullet-point',
                    props: {
                      paddingBottom: 100,
                    },
                    content: [
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 50,
                          paddingVertical: 20,
                          display: 'inline-flex',
                        },
                        content: `Hook removal`,
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
