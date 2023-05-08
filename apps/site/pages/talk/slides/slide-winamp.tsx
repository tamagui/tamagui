import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="pink"
      steps={[
        [
          {
            type: 'callout',
            content: `Winamp for React`,
            image: require('../images/winamp.jpg').default,
          },
        ],
      ]}
    />
  )
})
