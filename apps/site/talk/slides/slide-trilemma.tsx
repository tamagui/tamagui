import { Slide } from 'components/Slide'
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
        //     image: require('../images/trilemma.png').default,
        //   },
        // ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/trilemma-2.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/trilemma-3.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/trilemma-4.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/trilemma-5.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/trilemma-6.png').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/trilemma-7.png').default,
          },
        ],
      ]}
    />
  )
})
