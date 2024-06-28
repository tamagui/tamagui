import { Slide } from '../Slide'
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
            image: '/talk-images/safari.png',
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
                image: '/talk-images/flatten-in.png',
              },
              {
                type: 'image',
                variant: 'circled',
                image: '/talk-images/flatten-out.png',
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
            image: '/talk-images/profile-without.png',
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
            image: '/talk-images/profile-with.png',
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
            image: '/talk-images/lighthouse-without.png',
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
            image: '/talk-images/lighthouse-with.png',
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
