import { ContextMenu } from '@tamagui/context-menu'
import React from 'react'
import { YStack } from 'tamagui'
import { Button } from '../components/Button'

/**
 * ContextMenu with a controlled `open`.
 *
 * The provider state and the inner menu have to agree: the trigger's
 * data-state is read off the provider, the content off the menu.
 */

function ControlledContextMenu({
  id,
  open,
  onOpenChange,
}: {
  id: string
  open: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <ContextMenu open={open} onOpenChange={onOpenChange}>
      <ContextMenu.Trigger data-testid={`${id}-trigger`} p="4" borderWidth={1}>
        right click {id}
      </ContextMenu.Trigger>

      <ContextMenu.Portal zIndex={100}>
        <ContextMenu.Content
          data-testid={`${id}-content`}
          p="2"
          minW={160}
          borderWidth={1}
        >
          <ContextMenu.Item
            data-testid={`${id}-item-1`}
            key="item-1"
            textValue="One"
            style={{ paddingHorizontal: 8, paddingVertical: 6 }}
          >
            <ContextMenu.ItemTitle>One</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  )
}

export function ContextMenuControlledCase() {
  const [open, setOpen] = React.useState(false)

  return (
    <YStack padding="4" gap="4">
      {/* a caller that never lets it open */}
      <ControlledContextMenu id="pinned" open={false} />

      {/* a caller that opens it without the trigger being right clicked */}
      <Button data-testid="open-button" onPress={() => setOpen(true)}>
        open controlled
      </Button>
      <ControlledContextMenu id="controlled" open={open} onOpenChange={setOpen} />
    </YStack>
  )
}
