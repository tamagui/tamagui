import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Flatten more trees"
      subTitle="for smoking fast rendering times 💨"
      theme="green"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'image',
                variant: 'circled',
                image: require('../images/flattened-pre.png').default,
              },
              {
                type: 'image',
                variant: 'circled',
                image: require('../images/flattened-post.png').default,
              },
            ],
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/profile-without.png').default,
          },

          {
            type: 'text-overlay',
            variant: 'bad',
            content: `Without: ~660ms`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/profile-with.png').default,
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `600ms, ~10% faster`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/lighthouse-without.png').default,
          },

          {
            type: 'text-overlay',
            variant: 'bad',
            content: `Without: ~82`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/lighthouse-with.png').default,
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `11% improvement`,
          },
        ],
      ]}
    />
  )
})
