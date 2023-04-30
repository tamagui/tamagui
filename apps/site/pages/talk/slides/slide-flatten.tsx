import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Flatten trees"
      subTitle="for smoking fast rendering times 💨"
      theme="green"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'image',
                image: require('../images/flattened-pre.png').default,
              },
              {
                type: 'image',
                image: require('../images/flattened-post.png').default,
              },
            ],
          },

          {
            type: 'split-horizontal',
            content: [
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: `Lighthouse score`,
                  },
                  {
                    type: 'code-inline',
                    content: `+20%`,
                  },
                ],
              },
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: `Initial parsing time`,
                  },
                  {
                    type: 'code-inline',
                    content: `-15%`,
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
