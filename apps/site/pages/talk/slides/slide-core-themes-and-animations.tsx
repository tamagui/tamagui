import { createCodeHighlighter } from '@lib/highlightCode'
import { Slide } from 'components/Slide'
import { memo } from 'react'

const highlightCode = createCodeHighlighter()

const snippetUsage1 = highlightCode(
  `
import { Stack } from '@tamagui/core'
  
export default (props) => (
  <Stack
    animation="fast"

    enterStyle={{
      opacity: 0,
    }}

    opacity={1}
  />
)
`,
  'tsx'
)

const snippetUsage2 = highlightCode(
  `
import { Stack } from '@tamagui/core'
  
export default (props) => (
  <Stack
    animation="fast"

    enterStyle={{
      opacity: 0,
      backgroundColor: '$color5',
    }}

    opacity={1}
    backgroundColor="$color6"
  />
)
`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Themes + Animations"
      subTitle="Bringing it all together"
      stepsStrategy="replace"
      theme="pink"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: snippetUsage1,
              },

              {
                type: 'vertical',
                content: [],
              },
            ],
          },
        ],

        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                title: `Use token values`,
                content: snippetUsage2,
              },

              {
                type: 'vertical',
                content: [],
              },
            ],
          },
        ],

        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                title: `Use token values`,
                content: snippetUsage2,
              },

              {
                type: 'vertical',
                variant: 'center-vertically',
                content: [
                  {
                    type: 'text',
                    content: `If using CSS driver, this never re-renders`,
                  },
                ],
              },
            ],
          },
        ],

        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                title: `Use token values`,
                content: snippetUsage2,
              },

              {
                type: 'vertical',
                variant: 'center-vertically',
                content: [
                  {
                    type: 'text',
                    content: `If using Reanimated driver, it re-renders to capture new value`,
                  },
                ],
              },
            ],
          },
        ],
      ]}
    />
  )
})
