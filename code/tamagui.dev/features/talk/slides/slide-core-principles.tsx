import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      theme="yellow"
      steps={[
        [
          {
            type: 'callout',
            content: <>#1 rule: avoid re&#8209;rendering</>,
          },
        ],
      ]}
    />
  )
})
