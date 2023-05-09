import { createCodeHighlighter } from '@lib/highlightCode'
import { ButtonDemo } from '@tamagui/demos'
import { Slide } from 'components/Slide'
import { memo } from 'react'
import { Square } from 'tamagui'

const highlightCode = createCodeHighlighter()

const snippet1 = highlightCode(
  `
import { Stack } from '@tamagui/core'
  
const Square = styled(Stack, {
  name: 'Square',
  width: 300,
  height: 300,
  backgroundColor: '$background'
})

const themes =  {
  light_Square: {
    background: 'darkred'
  },

  dark_Square: {
    background: 'red'
  }
}
`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Themes: Components"
      subTitle="Sub-themes apply to named styled components"
      theme="pink"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: snippet1,
              },
              {
                type: 'content',
                content: <Square size={300} bc="red" />,
              },
            ],
          },
        ],
      ]}
    />
  )
})
