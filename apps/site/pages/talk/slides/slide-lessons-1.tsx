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
            content: (
              <>
                Make it work, make it right, make it fast ...
                <br />
                <br /> <em>is kind of wrong</em>
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
