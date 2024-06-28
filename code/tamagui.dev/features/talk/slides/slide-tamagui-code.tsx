import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import React from 'react'
import { memo } from 'react'

const highlightCode = createCodeHighlighter()

const adaptSnippet = highlightCode(
  `<Popover>
  <Popover.Trigger asChild>
    <Button />
  </Popover.Trigger>

  <Adapt when="sm" platform="touch">
    <Popover.Sheet>
      <Popover.Sheet.Frame>
        <Adapt.Contents />
      </Popover.Sheet.Frame>
    </Popover.Sheet>
  </Adapt>

  <Popover.Content animation="quick">
     {/* ... */}
  </Popover.Content>
</Popover>`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Tamagui"
      subTitle="Adapt based on platform or capability"
      theme="blue"
      steps={[
        [
          {
            type: 'code',
            content: adaptSnippet,
          },
          // {
          //   type: 'split-horizontal',
          //   content: [
          //     {
          //       type: 'image',
          //       image: '/talk-images/popover.jpg',
          //     },
          //   ],
          // },
        ],
      ]}
    />
  )
})
