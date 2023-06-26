import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="orange"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/bob-ross.jpg').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/bob-ross2.jpg').default,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/bob-ross3.jpg').default,
          },
        ],
      ]}
    />
  )
})
