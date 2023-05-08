import { Slide } from 'components/Slide'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="green"
      steps={[
        [
          {
            type: 'callout',
            content: `Not just speed, but creative expression`,
          },
        ],
      ]}
    />
  )
})
