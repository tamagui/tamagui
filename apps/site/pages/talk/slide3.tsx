import React from 'react'
import { memo } from 'react'

import { Slide } from '../../components/Slide'

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      theme="green"
      steps={[
        {
          bulletPoints: [
            [
              {
                type: 'code',
                content: `code`,
              },
            ],
          ],
        },
      ]}
    />
  )
})
