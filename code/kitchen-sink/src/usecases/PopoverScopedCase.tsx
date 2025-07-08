import {
  Adapt,
  Button,
  Paragraph,
  Popover,
  Sheet,
  useMedia,
  XStack,
  YStack,
} from 'tamagui'

export function PopoverScopedCase() {
  const shouldAdapt = window.location.search.includes('adapt=true')

  return (
    <YStack padding="$4" gap="$4">
      <Popover size="$5" allowFlip stayInFrame offset={15} resize>
        <TestPopoverContent shouldAdapt={shouldAdapt} name="plain" />
        <Popover.Trigger asChild>
          <Button data-testid={`plain-trigger`}>Open Plain</Button>
        </Popover.Trigger>
      </Popover>

      <Popover scope="PopoverA" size="$5" allowFlip stayInFrame offset={15} resize>
        <TestPopoverContent shouldAdapt={shouldAdapt} name="a" />

        <Popover scope="PopoverB" size="$5" allowFlip stayInFrame offset={15} resize>
          <TestPopoverContent shouldAdapt={shouldAdapt} name="b" />

          <Popover.Trigger asChild scope="PopoverA">
            <Button data-testid={`a-trigger`}>Open A</Button>
          </Popover.Trigger>

          <Popover.Trigger asChild scope="PopoverB">
            <Button data-testid={`b-trigger`}>Open B</Button>
          </Popover.Trigger>
        </Popover>
      </Popover>
    </YStack>
  )
}

const TestPopoverContent = ({ name, shouldAdapt }) => {
  return (
    <>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        width={300}
        height={300}
        elevate
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack data-testid={`${name}-popover-content`} gap="$3">
          <XStack gap="$3">
            <Paragraph size="$3">Popover {name}</Paragraph>
          </XStack>

          <Popover.Close asChild>
            <Button size="$3" data-testid={`popover-close`}>
              Close
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>

      {shouldAdapt && (
        <Adapt when="gtXs">
          <Sheet animation="medium" modal dismissOnSnapToBottom>
            <Sheet.Frame data-testid={`${name}-sheet-contents`} padding="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              backgroundColor="$shadowColor"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
      )}
    </>
  )
}
