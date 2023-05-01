import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      subTitle="Because I don't think ahead"
      theme="orange"
      steps={[
        [
          {
            type: 'callout',
            content: `N features * 3 operating systems * 4 runtimes * server/client * optimized/static * touch/mouse * 3 animation drivers * ...`,
          },
        ],
      ]}
    />
  )
})
