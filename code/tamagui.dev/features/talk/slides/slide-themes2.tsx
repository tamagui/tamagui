import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import { memo } from 'react'
import { H1, XStack } from 'tamagui'

import { CodeInline } from '../../../components/Code'

const highlightCode = createCodeHighlighter()

const themeSnippet = highlightCode(
  `<Theme name="dark">
<Theme name="red">
  <Text theme="subtle" color="$color">
    Hello
  </Text>
</Theme>
</Theme>
`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Core: Themes"
      subTitle="Powerful, but misunderstood"
      theme="yellow"
      steps={[
        [
          {
            type: 'vertical',
            content: [
              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: <>Nest as many as you want!</>,
                  },
                ],
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        Underscore = sub-theme: <CodeInline>dark_red_subtle</CodeInline>
                      </>
                    ),
                  },
                ],
              },

              {
                type: 'space',
              },

              {
                type: 'space',
              },

              {
                type: 'code',
                content: themeSnippet,
              },

              {
                type: 'bullet-point',
                content: [
                  {
                    type: 'text',
                    content: (
                      <>
                        Instead of setting{' '}
                        <CodeInline>Text color="$alternate"</CodeInline>
                      </>
                    ),
                  },
                ],
              },

              {
                type: 'content',
                content: (
                  <XStack py="$10" display="flex" w="100%" ai="center" jc="center">
                    <H1>Generics for styling!</H1>
                  </XStack>
                ),
              },
            ],
          },
        ],
      ]}
    />
  )
})
