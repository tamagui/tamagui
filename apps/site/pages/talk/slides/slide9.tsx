import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="How"
      subTitle="Themes let you re-skin your entire UI without changing app code"
      theme="pink"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: `
    const themes = {
      light: {
        background: '#fff',
        color: '#000',
      },
      dark: {
        background: '#000',
        color: '#fff'
      }
    }
    `,
              },
              {
                type: 'code',
                content: `
.t_light {
  --background: #fff;
  --color: #000;
}

.t_dark {
  --background: #000;
  --color: #fff;
}
    `,
              },
            ],
          },

          {
            type: 'bullet-point',
            content: [
              {
                type: 'text',
                content: `No re-renders!`,
              },
            ],
          },
          // {
          //   type: 'split-horizontal',
          //   content: [
          //     {
          //       type: 'image',
          //       image: require('../images/popover.jpg').default,
          //     },
          //   ],
          // },
        ],
      ]}
    />
  )
})
