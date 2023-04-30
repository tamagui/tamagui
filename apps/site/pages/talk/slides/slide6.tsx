import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      subTitle="Slow app + verbose code = 😭"
      theme="purple"
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

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'CSS > JS -',
              },

              {
                type: 'code-inline',
                content: 'Bundle size and parsing time',
              },
            ],
          },
        ],
      ]}
    />
  )
})
