import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="... on the web"
      theme="green"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: (
                  <>
                    Native <strong>flattens less</strong> because no
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
                content: <>Let's make those happen 🗳️</>,
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
                    Overall less sensitive due to less elements on screen, less resizing,
                    less DOM overhead, multi-thread.
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
