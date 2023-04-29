import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Tamagui UI"
      subTitle="Less API surface = ship faster"
      theme="pink"
      steps={[
        [
          // todo: intro to why its different bullets
        ],
      ]}
    />
  )
})
