import { useState } from 'react'
import { Button, Paragraph, Popover, YStack } from 'tamagui'

// exercises D2: the trigger wires aria-controls to the content id while open.
// covers generated-id, controlled, force-mounted (keepChildrenMounted), and
// explicit-content-id cases.
export function PopoverAriaControlsCase() {
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <YStack gap="$6" padding="$4">
      {/* uncontrolled, content uses the generated content id */}
      <Popover>
        <Popover.Trigger asChild>
          <Button id="generated-trigger">generated</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Paragraph>generated content</Paragraph>
          <Popover.Close asChild>
            <Button id="generated-close">close</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>

      {/* controlled open state */}
      <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
        <Popover.Trigger asChild>
          <Button id="controlled-trigger">controlled</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Paragraph>controlled content</Paragraph>
        </Popover.Content>
      </Popover>
      <Button
        id="controlled-external-toggle"
        onPress={() => setControlledOpen((v) => !v)}
      >
        external toggle
      </Button>

      {/* force-mounted content stays in the dom even while closed */}
      <Popover keepChildrenMounted>
        <Popover.Trigger asChild>
          <Button id="forcemount-trigger">force mounted</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Paragraph>force mounted content</Paragraph>
        </Popover.Content>
      </Popover>

      {/* user-supplied content id must round-trip to the trigger */}
      <Popover>
        <Popover.Trigger asChild>
          <Button id="explicit-trigger">explicit id</Button>
        </Popover.Trigger>
        <Popover.Content id="explicit-content-id">
          <Paragraph>explicit content</Paragraph>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
