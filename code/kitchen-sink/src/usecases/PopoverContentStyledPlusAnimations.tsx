import { Button, Popover, styled } from 'tamagui'

export function PopoverContentStyledPlusAnimations() {
  return (
    <Popover size="$5">
      <Popover.Trigger asChild>
        <Button>go</Button>
      </Popover.Trigger>

      <PopoverStyledContent>
        <Popover.Arrow borderWidth={1} borderColor="border-color" />
      </PopoverStyledContent>
    </Popover>
  )
}

const PopoverStyledContent = styled(Popover.Content, {
  name: 'PopoverContent2',
  backgroundColor: 'background',
  borderWidth: 1,
  borderColor: 'border-color',
  boxShadow: '0 4px 12px shadow-color',
  p: '3',
  rounded: '3',
  x: '0 enter:0 exit:0',
  y: '0 enter:-10px exit:-10px',
  opacity: '1 enter:0 exit:0',
  transition: [
    'quick',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
})
