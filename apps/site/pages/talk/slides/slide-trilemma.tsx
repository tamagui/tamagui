import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Choose two"
      subTitle="Can we solve the write-once trillemma?"
      theme="purple"
      steps={[
        [
          {
            type: 'image',
            image: require('../images/trilemma.png').default,
          },
        ],

        [
          {
            type: 'image',
            image: require('../images/trilemma-solved.png').default,
          },
        ],
      ]}
    />
  )
})
