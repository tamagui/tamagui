import { createCodeHighlighter } from '@lib/highlightCode'
import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'
const highlightCode = createCodeHighlighter()

const styledSnippet = highlightCode(
  `import { Text, styled } from '@tamagui/core'

export const Heading = styled(Text, {
  color: '$color',
  fontFamily: '$title',
  fontSize: 18,
  
  hoverStyle: { color: '$colorHover' },

  // media query
  $small: { fontSize: 12 },

  variants: {
    size: {
      bigger: {
        fontSize: 22,
        $small: { fontSize: 20 }
      },
    },
  },
})`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="@tamagui/core"
      subTitle="Style library"
      theme="pink"
      steps={[
        [
          {
            type: 'code',
            content: styledSnippet,
          },
        ],
      ]}
    />
  )
})
