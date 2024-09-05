import { Slide } from '../Slide'
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
            image: '/talk-images/twitter-poll.png',
          },
        ],
      ]}
    />
  )
})
