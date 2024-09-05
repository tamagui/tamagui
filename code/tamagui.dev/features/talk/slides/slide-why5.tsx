import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why did it feel terrible?"
      subTitle="Verbosity & JavaScript"
      theme="blue"
      steps={[
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Media queries - ',
              },

              {
                type: 'code-inline',
                content: 'useWindowDimensions + setState',
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Pseudo styles -',
              },

              {
                type: 'code-inline',
                content: 'useState + Pressable + onPressIn + onPressOut',
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Themes -',
              },

              {
                type: 'code-inline',
                content: 'Whole-tree re-render and re-parse styles',
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'All styles in JS -',
              },

              {
                type: 'code-inline',
                content: 'Bundle size and parsing time',
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: `Tree depth -`,
              },

              {
                type: 'code-inline',
                content: 'Every <Stack /> costs $',
              },
            ],
          },
        ],
      ]}
    />
  )
})
