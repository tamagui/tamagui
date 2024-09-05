import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'
import { YStack } from 'tamagui'

export default memo(() => {
  return (
    <Slide
      title="Themes"
      theme="pink"
      steps={[
        [
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'text',
                content: `Sub-themes for components`,
              },

              {
                type: 'code-inline',
                content: `light_Button`,
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'code-inline',
                content: `useTheme()`,
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'text',
                content: `Maps to CSS variables`,
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'text',
                content: `Avoids re-renders on web`,
              },
            ],
          },
        ],
        [
          {
            type: 'bullet-point',
            size: '$10',
            slim: true,
            content: [
              {
                type: 'text',
                content: `Nest as many times as you want`,
              },
            ],
          },
        ],
      ]}
    />
  )
})
