import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="purple"
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
            content: <>...our codebases should get simpler&nbsp;over&nbsp;time</>,
          },
        ],
      ]}
    />
  )
})
