import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Can we solve it?"
      subTitle="You typically have to choose two:"
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
