import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Flatten your trees"
      subTitle="For much bigger performance gains"
      theme="purple"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'image',
                image: require('../images/flattened-pre.png').default,
              },
              {
                type: 'image',
                image: require('../images/flattened-post.png').default,
              },
            ],
          },
        ],
      ]}
    />
  )
})
