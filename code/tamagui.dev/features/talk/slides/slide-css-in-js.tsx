import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      // title="No"
      theme="purple"
      steps={[
        [
          {
            type: 'callout',
            content: `CSS-in-JS is back, baby`,
            image: '/talk-images/austin-powers.jpg',
          },
          // {
          //   type: 'split-horizontal',
          //   content: [
          //     {
          //       type: 'image',
          //       image: '/talk-images/popover.jpg',
          //     },
          //   ],
          // },
        ],
      ]}
    />
  )
})
