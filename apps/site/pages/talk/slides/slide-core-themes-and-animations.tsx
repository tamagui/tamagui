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

    hoverStyle={{
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
    backgroundColor="$color6"
    hoverStyle={{
      backgroundColor: '$color5',
    }}
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
                    content: `On the web this doesn't trigger a render on theme change - or even on animation when using the CSS driver`,
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
