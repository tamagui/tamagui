import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      // title="Why did it feel terrible?"
      theme="blue"
      steps={[
        [
          {
            type: 'callout',
            content: `Verbosity, the death of creativity`,
          },
        ],
      ]}
    />
  )
})
