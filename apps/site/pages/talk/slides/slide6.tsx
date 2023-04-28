import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      subTitle="My app felt slow & my code was verbose"
      theme="purple"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Media queries',
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'code-inline',
                    content: 'useScreenDimenisions + setState',
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
                content: 'Pseudo styles (hover, focus, press)',
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'code-inline',
                    content: 'useState + Pressable + onPressIn + onPressOut...',
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
                content: 'Themes (CSS Variables)',
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'code-inline',
                    content: 'Whole-tree re-render and re-parse styles',
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
                content: 'CSS',
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'code-inline',
                    content: 'Parsing JS, inserting styles on mount',
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
