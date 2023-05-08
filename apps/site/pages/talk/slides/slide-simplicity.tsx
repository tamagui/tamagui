import { Slide } from 'components/Slide'
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
            content: `Because our systems are always getting faster...`,
          },
        ],

        [
          {
            type: 'callout',
            content: `...our codebases should get simpler over time`,
          },
        ],
      ]}
    />
  )
})
