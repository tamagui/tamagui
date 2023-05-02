import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      theme="orange"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'callout',
            content: `I couldn't afford to write two apps...`,
          },
        ],

        [
          {
            type: 'callout',
            content: `... but my universal app felt terrible 😭`,
          },
        ],
      ]}
    />
  )
})
