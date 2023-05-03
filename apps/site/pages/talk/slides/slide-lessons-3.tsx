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
            content: <>We need testing to work seamlessly across native and web.</>,
          },

          {
            type: 'callout',
            content: (
              <>
                Javascript is a great language a compiler - it lets you actually ship,
                with more advanced features.
              </>
            ),
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
