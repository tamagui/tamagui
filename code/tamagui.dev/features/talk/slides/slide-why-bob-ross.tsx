import { memo } from 'react'
import { Slide } from '../Slide'

export default memo(() => {
  return (
    <Slide
      theme="orange"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/bob-ross.jpg',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/bob-ross2.jpg',
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/bob-ross3.jpg',
          },
        ],
      ]}
    />
  )
})
