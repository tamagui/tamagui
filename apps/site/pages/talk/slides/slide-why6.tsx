import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="blue"
      steps={[
        [
          {
            type: 'callout',
            content: <>Verbosity, the death&nbsp;of&nbsp;creativity</>,
          },
        ],
      ]}
    />
  )
})
