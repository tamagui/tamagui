import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Takeaways"
      theme="pink"
      steps={[
        [
          {
            type: 'callout',
            content: <>I couldn't have done this in Rust 🌶️ - thank you Babel.</>,
          },
          // {
          //   type: 'split-horizontal',
          //   content: [
          //     {
          //       type: 'image',
          //       image: require('../images/popover.jpg').default,
          //     },
          //   ],
          // },
        ],
      ]}
    />
  )
})
