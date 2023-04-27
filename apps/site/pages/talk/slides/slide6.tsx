import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      subTitle="My app was slow & my code was verbose"
      theme="green"
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
                    type: 'text',
                    content: 'Media queries',
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
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: 'Themes (CSS Variables)',
              },
            ],
          },
        ],
      ]}
    />
  )
})
