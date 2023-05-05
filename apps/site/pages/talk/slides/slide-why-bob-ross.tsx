import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      // title="Why did it feel terrible?"
      theme="blue"
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
