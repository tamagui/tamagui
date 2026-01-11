// @ts-nocheck - animation prop types need fixing in v2
import { Button, Popover, styled } from 'tamagui'

export function PopoverContentStyledPlusAnimations() {
  return (
    <Popover size="$5">
      <Popover.Trigger asChild>
        <Button>go</Button>
      </Popover.Trigger>

      <PopoverStyledContent>
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
      </PopoverStyledContent>
    </Popover>
  )
}
// @ts-ignore animation prop types need fixing in v2
const PopoverStyledContent = styled(Popover.Content, {
  name: 'PopoverContent2',
  elevate: true,
  bordered: true,
  p: '$3',
  rounded: '$3',
  enterStyle: {
    opacity: 0,
    y: -10,
    x: 0,
  },
  exitStyle: {
    opacity: 0,
    y: -10,
    x: 0,
  },
  x: 0,
  y: 0,
  opacity: 1,
  animation: [
    'quick',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
})
