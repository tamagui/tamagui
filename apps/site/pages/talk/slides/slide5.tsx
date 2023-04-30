import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tamagui"
      subTitle="Adapt + Native"
      theme="blue"
      steps={[
        {
          type: 'image',
          image: require('../images/select.png').default,
        },
      ]}
    />
  )
})
