import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="How?"
      subTitle="Convert nice code into performant code"
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
                content: '@media (max-width) ...',
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Pseudo styles - ',
              },

              {
                type: 'code-inline',
                content: ':hover, :focus, :active',
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Themes - ',
              },

              {
                type: 'code-inline',
                content: '--background: #000',
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'CSS - ',
              },

              {
                type: 'code-inline',
                content: '{ backgroundColor: "#000" } => CSS + { bg: "bg0" }',
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Flattening - ',
              },

              {
                type: 'code-inline',
                content: '<Stack /> becomes <div /> or <View />',
              },
            ],
          },
        ],
      ]}
    />
  )
})
