import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Flatten trees"
      subTitle=<>for smoking fast renders &nbsp; 💨</>
      theme="green"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/safari.png').default,
          },

          {
            type: 'text-overlay',
            content: `500px², 49 flattened components`,
          },
        ],

        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'image',
                variant: 'circled',
                image: require('../images/flatten-in.png').default,
              },
              {
                type: 'image',
                variant: 'circled',
                image: require('../images/flatten-out.png').default,
              },
            ],
          },

          {
            type: 'text-overlay',
            content: `Stack => div`,
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
