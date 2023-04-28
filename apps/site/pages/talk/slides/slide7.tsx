import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Smarter compilers"
      subTitle="= less code = better experiences"
      theme="pink"
      steps={[
        [
          {
            type: 'image',
            image: require('../images/trilemma.svg').default,
          },
        ],
      ]}
    />
  )
})
