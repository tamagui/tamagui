import { Menu } from '@tamagui/menu'
import { memo, useRef, useState } from 'react'
import {
  Button,
  Paragraph,
  Popover,
  SizableText,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'

const SharedPopoverTrigger = memo(function SharedPopoverTrigger({
  scope,
  triggerTestId,
  countTestId,
  label,
  setActiveLabel,
}: {
  scope: string
  triggerTestId: string
  countTestId: string
  label: string
  setActiveLabel: (label: string) => void
}) {
  const renderCountRef = useRef(0)
  renderCountRef.current++

  return (
    <View gap="$1.5" items="center">
      <Popover.Trigger scope={scope} asChild onMouseEnter={() => setActiveLabel(label)}>
        <Button data-testid={triggerTestId}>{label}</Button>
      </Popover.Trigger>
      <Text data-testid={countTestId} fontSize="$1" textAlign="center">
        renders: {renderCountRef.current}
      </Text>
    </View>
  )
})

const SharedMenuTrigger = memo(function SharedMenuTrigger({
  triggerTestId,
  countTestId,
  label,
}: {
  triggerTestId: string
  countTestId: string
  label: string
}) {
  const renderCountRef = useRef(0)
  renderCountRef.current++

  return (
    <View gap="$1.5" items="center">
      <Menu.Trigger asChild>
        <Button data-testid={triggerTestId}>{label}</Button>
      </Menu.Trigger>
      <Text data-testid={countTestId} fontSize="$1" textAlign="center">
        renders: {renderCountRef.current}
      </Text>
    </View>
  )
})

export function GlobalScopedTriggerIsolationCase() {
  const [activePopoverLabel, setActivePopoverLabel] = useState('Popover 1')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <YStack flex={1} gap="$8" p="$6" bg="$background">
      <YStack gap="$2">
        <SizableText fontWeight="bold" data-testid="global-popover-label">
          Controlled global popover with memoized triggers
        </SizableText>

        <Popover
          scope="global-shared-popover"
          open={!!activePopoverLabel}
          onOpenChange={(open) => {
            if (!open) {
              setActivePopoverLabel('')
            }
          }}
          hoverable={{ delay: 0, restMs: 0 }}
          placement="bottom-start"
          offset={8}
        >
          <XStack gap="$4">
            <SharedPopoverTrigger
              scope="global-shared-popover"
              triggerTestId="global-popover-trigger-1"
              countTestId="global-popover-trigger-1-renders"
              label="Popover 1"
              setActiveLabel={setActivePopoverLabel}
            />
            <SharedPopoverTrigger
              scope="global-shared-popover"
              triggerTestId="global-popover-trigger-2"
              countTestId="global-popover-trigger-2-renders"
              label="Popover 2"
              setActiveLabel={setActivePopoverLabel}
            />
            <SharedPopoverTrigger
              scope="global-shared-popover"
              triggerTestId="global-popover-trigger-3"
              countTestId="global-popover-trigger-3-renders"
              label="Popover 3"
              setActiveLabel={setActivePopoverLabel}
            />
          </XStack>

          <Popover.Content
            scope="global-shared-popover"
            data-testid="global-popover-content"
            disableFocusScope
            p="$3"
            minWidth={180}
            enterStyle={{ y: -8, opacity: 0 }}
            exitStyle={{ y: -8, opacity: 0 }}
          >
            <Popover.Arrow scope="global-shared-popover" />
            <Paragraph>{activePopoverLabel || 'Shared hoverable popover'}</Paragraph>
          </Popover.Content>
        </Popover>
      </YStack>

      <YStack gap="$2">
        <SizableText fontWeight="bold" data-testid="global-menu-label">
          Chat-style global menu context with memoized triggers
        </SizableText>

        <Menu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          placement="bottom-start"
          offset={8}
        >
          <XStack gap="$4">
            <SharedMenuTrigger
              triggerTestId="global-menu-trigger-1"
              countTestId="global-menu-trigger-1-renders"
              label="Menu 1"
            />
            <SharedMenuTrigger
              triggerTestId="global-menu-trigger-2"
              countTestId="global-menu-trigger-2-renders"
              label="Menu 2"
            />
            <SharedMenuTrigger
              triggerTestId="global-menu-trigger-3"
              countTestId="global-menu-trigger-3-renders"
              label="Menu 3"
            />
          </XStack>

          <Menu.Portal>
            <Menu.Content
              data-testid="global-menu-content"
              p="$2"
              minWidth={180}
              borderWidth={1}
              borderColor="$borderColor"
              elevation="$3"
            >
              <Menu.Item key="alpha" textValue="Alpha">
                <Menu.ItemTitle>Alpha</Menu.ItemTitle>
              </Menu.Item>
              <Menu.Item key="beta" textValue="Beta">
                <Menu.ItemTitle>Beta</Menu.ItemTitle>
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>
      </YStack>
    </YStack>
  )
}
