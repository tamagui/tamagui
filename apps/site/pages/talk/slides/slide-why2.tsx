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
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `N features`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `3 operating systems`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `4 JavaScript runtimes`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `Server and client`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `Optimized or not`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `Web mobile vs desktop`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `Touch or mouse`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `3 animation drivers`,
              },
            ],
          },
        ],

        [
          {
            type: 'bullet-point',
            content: [
              {
                type: 'text-bold',
                content: `😮‍💨`,
              },
            ],
          },
        ],
      ]}
    />
  )
})

// N features * 3 operating systems * 4 runtimes * server/client * optimized/static * touch/mouse * 3 animation drivers * ...`
