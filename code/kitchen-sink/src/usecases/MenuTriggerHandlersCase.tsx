import { Menu } from '@tamagui/menu'
import React from 'react'
import { Paragraph, YStack } from 'tamagui'
import { Button } from '../components/Button'

/**
 * Menu.Trigger with caller-supplied event handlers.
 *
 * A caller's own onKeyDown / onPointerDown must not replace the handlers that
 * open the menu, and the caller's handler must still run.
 */

function TriggerMenu({
  id,
  triggerProps,
}: {
  id: string
  triggerProps: Record<string, any>
}) {
  return (
    <Menu placement="bottom-start">
      <Menu.Trigger asChild {...triggerProps}>
        <Button data-testid={`${id}-trigger`}>Open {id}</Button>
      </Menu.Trigger>

      <Menu.Portal zIndex={100}>
        <Menu.Content data-testid={`${id}-content`} p="2" minW={200} borderWidth={1}>
          <Menu.Item
            data-testid={`${id}-item-1`}
            key="item-1"
            textValue="One"
            style={{ paddingHorizontal: 8, paddingVertical: 6 }}
          >
            <Menu.ItemTitle>One</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}

export function MenuTriggerHandlersCase() {
  const [keyDownCount, setKeyDownCount] = React.useState(0)
  const [legacyKeyDownCount, setLegacyKeyDownCount] = React.useState(0)
  const [pressCount, setPressCount] = React.useState(0)

  return (
    <YStack padding="4" gap="4">
      <Paragraph data-testid="keydown-count">{keyDownCount}</Paragraph>
      <Paragraph data-testid="legacy-keydown-count">{legacyKeyDownCount}</Paragraph>
      <Paragraph data-testid="press-count">{pressCount}</Paragraph>

      <TriggerMenu
        id="keydown"
        triggerProps={{ onKeyDown: () => setKeyDownCount((c) => c + 1) }}
      />

      <TriggerMenu
        id="legacy"
        triggerProps={{ onKeydown: () => setLegacyKeyDownCount((c) => c + 1) }}
      />

      <TriggerMenu
        id="press"
        triggerProps={{ onPointerDown: () => setPressCount((c) => c + 1) }}
      />
    </YStack>
  )
}
