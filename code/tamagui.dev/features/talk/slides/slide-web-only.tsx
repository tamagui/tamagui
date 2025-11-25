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
                  minH: 100,
                  fontSize: 60,
                  my: 50,
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
                  my: 50,
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
                  my: 50,
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
                  my: 50,
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
