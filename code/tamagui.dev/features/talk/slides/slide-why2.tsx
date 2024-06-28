import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Why?"
      subTitle="Because I don't think ahead"
      theme="blue"
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
                content: `3-4 operating systems`,
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
                content: `Touch input or mouse input`,
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
                content: `Headless, styled, native`,
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
                content: `50*3*4*2*2*2*2*3`,
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
                content: `= 43,200 😮‍💨`,
              },
            ],
          },
        ],
      ]}
    />
  )
})

// N features * 3 operating systems * 4 runtimes * server/client * optimized/static * touch/mouse * 3 animation drivers * ...`
