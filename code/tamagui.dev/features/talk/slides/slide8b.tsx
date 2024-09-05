import { createCodeHighlighter } from '../utils'
import { Slide } from '../Slide'
import { memo } from 'react'

const highlightCode = createCodeHighlighter()

const tamaguiUiSnippet = highlightCode(
  `<Popover size="$5" allowFlip {...props}>
  <Popover.Trigger asChild>
    <Button icon={Icon} />
  </Popover.Trigger>

  <Adapt when="sm" platform="touch">
    <Popover.Sheet modal dismissOnSnapToBottom>
      <Popover.Sheet.Frame padding="$4">
        <Adapt.Contents />
      </Popover.Sheet.Frame>
      <Popover.Sheet.Overlay />
    </Popover.Sheet>
  </Adapt>

  <Popover.Content
    enterStyle={{ x: 0, y: -10, opacity: 0 }}
    exitStyle={{ x: 0, y: -10, opacity: 0 }}
    x={0}
    y={0}
    opacity={1}
    animation="quick"
    >
    <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

    <YStack gap="$3">
      <XStack gap="$3">
        <Label size="$3" htmlFor={Name}>
          Name
        </Label>
        <Input size="$3" id={Name} />
      </XStack>
      <Popover.Close asChild>
        <Button
          size="$3"
          onPress={() => {
            /* Custom code goes here, does not interfere with popover closure */
          }}
        >
          Submit
        </Button>
      </Popover.Close>
    </YStack>
  </Popover.Content>
</Popover>
`,
  'tsx'
)

export default memo(() => {
  return (
    <Slide
      title="Tamagui UI"
      subTitle="Less API surface = ship faster"
      theme="pink"
      steps={[
        [
          {
            type: 'code',
            content: tamaguiUiSnippet,
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
