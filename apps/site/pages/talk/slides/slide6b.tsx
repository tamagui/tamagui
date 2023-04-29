import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Get rid of half your tree"
      subTitle="Flatten trees for great performance"
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
