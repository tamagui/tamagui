import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Get rid of JS"
      subTitle="On the web, use the platform"
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
                    content: '@media (max-width) ...',
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
                content: 'Pseudo styles',
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'code-inline',
                    content: ':hover, :focus, :active',
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
                content: 'Themes',
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'code-inline',
                    content: '--background: #000',
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
                    content: '{ backgroundColor: "#000" } => CSS + { bg: "bg0" }',
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
