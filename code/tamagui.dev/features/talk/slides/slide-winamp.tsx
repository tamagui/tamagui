import { Slide } from '../Slide'
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
            image: '/talk-images/winamp.jpg',
          },
        ],
      ]}
    />
  )
})
