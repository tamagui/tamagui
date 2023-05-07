import { Slide } from 'components/Slide'
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
            content: `Avoid re-rendering`,
          },
        ],
      ]}
    />
  )
})
