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
            content: <>Rust is cool, but JS ships - thank you Babel 🙏</>,
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
