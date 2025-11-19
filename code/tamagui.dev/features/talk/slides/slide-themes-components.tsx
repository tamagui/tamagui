import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import { memo } from 'react'
import { Square, YStack } from 'tamagui'

const highlightCode = createCodeHighlighter()

const snippet1 = highlightCode(
  `const Square = styled(Stack, {
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
                content: (
                  <YStack ai="center" jc="center">
                    <Square size={300} bc="red" />
                  </YStack>
                ),
              },
            ],
          },
        ],
      ]}
    />
  )
})
