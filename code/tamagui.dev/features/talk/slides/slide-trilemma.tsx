import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Can we solve it?"
      subTitle="You typically have to choose two:"
      theme="purple"
      stepsStrategy="replace"
      steps={[
        // [
        //   {
        //     type: 'image',
        //     variant: 'centered',
        //     image: '/talk-images/trilemma.png',
        //   },
        // ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/trilemma-2.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/trilemma-3.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/trilemma-4.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/trilemma-5.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/trilemma-6.png',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/trilemma-7.png',
          },
        ],
      ]}
    />
  )
})
