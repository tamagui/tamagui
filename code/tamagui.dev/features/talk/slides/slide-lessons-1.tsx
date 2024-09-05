import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      theme="pink"
      stepsStrategy="replace"
      steps={[
        [
          {
            type: 'image',
            variant: 'centered',
            image: '/talk-images/DesignSystems.svg',
          },
        ],

        [
          {
            type: 'callout',
            content: <>Make it work, make it right, make it fast?</>,
          },
        ],

        // [
        //   {
        //     type: 'callout',
        //     content: (
        //       <>
        //         Make it work,
        //         <br />
        //         make it right
        //         <br /> make it fast ...
        //         <br />
        //         <br /> <em>...was a trap</em>
        //       </>
        //     ),
        //   },
        //   // {
        //   //   type: 'split-horizontal',
        //   //   content: [
        //   //     {
        //   //       type: 'image',
        //   //       image: '/talk-images/popover.jpg',
        //   //     },
        //   //   ],
        //   // },
        // ],
      ]}
    />
  )
})
