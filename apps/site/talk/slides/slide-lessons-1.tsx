import { Slide } from 'components/Slide'
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
            image: require('../images/DesignSystems.svg').default,
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
        //   //       image: require('../images/popover.jpg').default,
        //   //     },
        //   //   ],
        //   // },
        // ],
      ]}
    />
  )
})
