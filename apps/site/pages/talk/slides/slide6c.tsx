import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="... on the web"
      subTitle="Native needs..."
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
                    Native <strong>flattens much less</strong> because no equivalent to:
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
                        <strong>CSS Variables</strong> - falls back to useTheme()
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
                        <strong>Media queries</strong> - falls back to useMedia()
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
                        <strong>Psuedo styles</strong> - falls back to onPress, onFocus,
                        etc
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
                content: (
                  <>Let's get CSS variables, pseudo + responsive styles first-class 🗳️</>
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
                    Luckily less sensitive due to less elements on screen, no DOM
                    overhead, more than one thread.
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
