import { Slide } from 'components/Slide'
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
                  size: '$10',
                  minHeight: 100,
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
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        <strong>CSS Variables</strong> - useTheme()
                      </>
                    ),
                  },
                ],
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        <strong>Media queries</strong> - useMedia()
                      </>
                    ),
                  },
                ],
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',

                    content: (
                      <>
                        <strong>Psuedo styles</strong> - onPress, onFocus, etc
                      </>
                    ),
                  },
                ],
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                props: {
                  size: '$10',
                  lineHeight: 90,
                },
                content: <>Let's make it happen 🗳️</>,
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                props: {
                  size: '$10',
                  lineHeight: 90,
                },
                content: (
                  <>
                    Native less sensitive - fewer elements on screen, less resizing, no
                    DOM overhead, separate UI thread.
                  </>
                ),
              },
            ],
          },
        ],
      ]}
    />
  )
})
