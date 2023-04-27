import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="How"
      subTitle="Smarter compilers = less code = better experiences"
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
