import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="blue"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'callout',
            content: <>Verbosity, the death&nbsp;of&nbsp;creativity</>,
          },
        ],

        // [
        //   {
        //     type: 'callout',
        //     content: (
        //       <>
        //         Do a favor and check out out GQty.dev - the greatest lib you've never
        //         heard of
        //       </>
        //     ),
        //   },
        // ],
      ]}
    />
  )
})
