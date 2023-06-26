import { Slide } from 'components/Slide'
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
            image: require('../images/austin-powers.jpg').default,
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
