import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Compile for creativity"
      subTitle="More straightforward, simple code"
      theme="green"
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
