import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="yellow"
      steps={[
        [
          {
            type: 'image',
            variant: 'centered',
            image: require('../images/DesignSystems.svg').default,
          },
        ],
      ]}
    />
  )
})
