import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Web only?"
      theme="green"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                props: {
                  minHeight: 100,
                  fontSize: 60,
                  marginVertical: 50,
                  display: 'inline-flex',
                },
                content: (
                  <>
                    No, but native&nbsp;<strong>flattens less</strong>
                  </>
                ),
              },

              {
                type: 'bullet-point',
                props: {
                  marginVertical: 50,
                },
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        <strong>CSS Variables</strong> for now, useTheme()
                      </>
                    ),
                  },
                ],
              },

              {
                type: 'bullet-point',
                props: {
                  marginVertical: 50,
                },
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        <strong>Media queries</strong> for now, useMedia()
                      </>
                    ),
                  },
                ],
              },

              {
                type: 'bullet-point',
                props: {
                  marginVertical: 50,
                },
                content: [
                  {
                    type: 'text',

                    content: (
                      <>
                        <strong>Pseudo styles</strong> for now, onPress, onFocus, etc
                      </>
                    ),
                  },
                ],
              },
            ],
          },

          // {
          //   type: 'bullet-point',
          //   content: [
          //     {
          //       type: 'text',
          //       props: {
          //         lineHeight: 90,
          //       },
          //       content: <>Upside - Native less sensitive</>,
          //     },

          //     {
          //       type: 'bullet-point',
          //       content: [
          //         {
          //           type: 'text',
          //           content: `Fewer elements on screen, less resizing, DOM overhead, separate UI thread.`,
          //         },
          //       ],
          //     },
          //   ],
          // },
        ],
      ]}
    />
  )
})
