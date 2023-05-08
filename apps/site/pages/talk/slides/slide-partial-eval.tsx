import { createCodeHighlighter } from '@lib/highlightCode'
import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

const highlightCode = createCodeHighlighter()

const inputSnippet = highlightCode(
  `import { Text, YStack } from 'tamagui'
import { baseFontSize } from './constants'

const height = 300

const App = (props) => (
  <YStack
    padding={props.big ? '$5' : '$3'}
    height={props.big ? height : height + 20}
    {...(props.colorful && {
      backgroundColor: 'green',
    })}
  >
    <Text fontSize={baseFontSize}>
      Lorem ipsum.
    </Paragraph>
  </YStack>
)`,
  'tsx'
)

const outputSnippet = highlightCode(
  `const App = props => <div
  className={_cn + (
    props.big ? _cn2 : _cn3 +
      (" " + (props.big ? _cn4 : _cn5))
      (" " + (props.colorful ? _cn6 : " "))
  )}
>
    <span className={_cn5}>
      Lorem ipsum.
    </span>
  </div>

const _cn6 = " _bc-1l6ykvy"
const _cn5 = " _h-scmqyp"
const _cn4 = "  _h-1542mo4"
const _cn3 = " _pb-12bic3x _pl-7ztw5e _pr-g6vdx7 _pt-1vq430g"
const _cn2 = " _pb-z3qxl0 _pl-14km6ah _pr-1qpq1qc _pt-1medp4i"
const _cn = "_fs-1q142lx "`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Partial Evaluation"
      subTitle="Performance worries gone"
      theme="green"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: inputSnippet,
              },
              {
                type: 'code',
                content: outputSnippet,
              },
            ],
          },
        ],
      ]}
    />
  )
})
