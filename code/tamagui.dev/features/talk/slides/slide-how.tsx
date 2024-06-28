import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="How?"
      subTitle={`Simple syntax in, "use the platform" out`}
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
        ],
        [
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
        ],
        [
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
        ],
        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Remove JS - ',
              },

              {
                type: 'code-inline',
                content: '{ backgroundColor: "#000" } => CSS + { bg: "bg0" }',
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
                content: 'Flattening - ',
              },

              {
                type: 'code-inline',
                content: '<StyledView /> becomes <div /> or <View />',
              },
            ],
          },
        ],
      ]}
    />
  )
})
