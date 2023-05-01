import { Slide } from 'components/Slide'
import React from 'react'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Express yourself"
      subTitle="No-cost inline styles make better products"
      theme="green"
      steps={[
        [
          {
            type: 'split-horizontal',
            content: [
              {
                type: 'code',
                content: `import { Paragraph, YStack } from 'tamagui'

const App = (props) => (
  <YStack
    padding={props.big ? '$5' : '$3'}
    {...(props.colorful && {
      backgroundColor: 'green',
    })}
  >
    <Paragraph size="$2">
      Lorem ipsum.
    </Paragraph>
  </YStack>
)`,
              },
              {
                type: 'code',
                content: `const _cn5 = " _color-scmqyp _d-1471scf _ff-xeweqh _fs-7uzi8p _lineHeight-1l6ykvy"
const _cn4 = "  _bc-1542mo4"
const _cn3 = " _pb-12bic3x _pl-7ztw5e _pr-g6vdx7 _pt-1vq430g"
const _cn2 = " _pb-z3qxl0 _pl-14km6ah _pr-1qpq1qc _pt-1medp4i"
const _cn = " _d-6koalj _fd-eqz5dr _fs-1q142lx "
import { Paragraph, YStack } from 'tamagui'

const App = props => <div className={_cn + (props.big ? _cn2 : _cn3 + (" " + (props.colorful ? _cn4 : " ")))}>
    <span className={_cn5}>
      Lorem ipsum.
    </span>
  </div>`,
              },
            ],
          },

          {
            type: 'centered',
            content: `Write code how you want.`,
          },
        ],
      ]}
    />
  )
})
