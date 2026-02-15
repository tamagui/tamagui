import {
  Button,
  Dialog,
  Input,
  Paragraph,
  Popover,
  Select,
  XStack,
  YStack,
} from 'tamagui'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from '@tamagui/lucide-icons'
import {
  useHasDismissableLayers,
  useIsInsideDismissable,
  getDismissableLayerCount,
} from '@tamagui/dismissable'

// tests that when multiple dismissable layers are open, ESC closes the topmost one
export function DismissLayerStackingCase() {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialog2Open, setDialog2Open] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [selectValue2, setSelectValue2] = useState('')

  return (
    <YStack padding="$4" gap="$4">
      <Paragraph>
        Test: Open popover, then open dialog from inside popover. Press ESC - dialog
        should close first, not the popover.
      </Paragraph>

      <XStack gap="$4" flexWrap="wrap">
        {/* left side: popover with dialog inside */}
        <YStack gap="$3">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Popover.Trigger asChild>
              <Button testID="popover-trigger">Open Popover</Button>
            </Popover.Trigger>

            <Popover.Content testID="popover-content" padding="$4" elevate bordered>
              <YStack gap="$3" width={280}>
                <Paragraph>Popover Content</Paragraph>
                <Input testID="popover-input" placeholder="Popover input" />

                {/* select inside popover */}
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <Select.Trigger testID="popover-select-trigger" iconAfter={ChevronDown}>
                    <Select.Value placeholder="Select fruit" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Viewport testID="popover-select-viewport">
                      <Select.Item testID="popover-select-apple" value="apple" index={0}>
                        <Select.ItemText>Apple</Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        testID="popover-select-banana"
                        value="banana"
                        index={1}
                      >
                        <Select.ItemText>Banana</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <Dialog.Trigger asChild>
                    <Button testID="dialog-trigger">Open Dialog</Button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay testID="dialog-overlay" key="overlay" opacity={0.5} />
                    <Dialog.Content
                      testID="dialog-content"
                      bordered
                      elevate
                      key="content"
                    >
                      <YStack gap="$3" padding="$2">
                        <Dialog.Title>Dialog Title</Dialog.Title>
                        <Dialog.Description>
                          Press ESC to close this dialog. The popover should stay open.
                        </Dialog.Description>
                        <Input
                          testID="dialog-input"
                          placeholder="Dialog input"
                          autoFocus
                        />

                        {/* select inside dialog */}
                        <Select value={selectValue2} onValueChange={setSelectValue2}>
                          <Select.Trigger
                            testID="dialog-select-trigger"
                            iconAfter={ChevronDown}
                          >
                            <Select.Value placeholder="Select color" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Viewport testID="dialog-select-viewport">
                              <Select.Item
                                testID="dialog-select-red"
                                value="red"
                                index={0}
                              >
                                <Select.ItemText>Red</Select.ItemText>
                              </Select.Item>
                              <Select.Item
                                testID="dialog-select-blue"
                                value="blue"
                                index={1}
                              >
                                <Select.ItemText>Blue</Select.ItemText>
                              </Select.Item>
                            </Select.Viewport>
                          </Select.Content>
                        </Select>

                        <XStack gap="$3" justifyContent="flex-end">
                          <Dialog.Close asChild>
                            <Button testID="dialog-close">Close Dialog</Button>
                          </Dialog.Close>
                        </XStack>
                      </YStack>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog>

                <Popover.Close asChild>
                  <Button testID="popover-close">Close Popover</Button>
                </Popover.Close>
              </YStack>
            </Popover.Content>
          </Popover>
        </YStack>

        {/* right side: standalone dialog */}
        <YStack gap="$3">
          <Dialog open={dialog2Open} onOpenChange={setDialog2Open}>
            <Dialog.Trigger asChild>
              <Button testID="dialog2-trigger">Open Dialog 2</Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay testID="dialog2-overlay" key="overlay2" opacity={0.5} />
              <Dialog.Content testID="dialog2-content" bordered elevate key="content2">
                <YStack gap="$3" padding="$2">
                  <Dialog.Title>Dialog 2</Dialog.Title>
                  <Dialog.Description>This is a separate dialog.</Dialog.Description>
                  <Dialog.Close asChild>
                    <Button testID="dialog2-close">Close</Button>
                  </Dialog.Close>
                </YStack>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </YStack>
      </XStack>

      {/* status display for tests */}
      <YStack gap="$2">
        <Paragraph testID="popover-status">
          Popover: {popoverOpen ? 'open' : 'closed'}
        </Paragraph>
        <Paragraph testID="dialog-status">
          Dialog: {dialogOpen ? 'open' : 'closed'}
        </Paragraph>
        <Paragraph testID="dialog2-status">
          Dialog 2: {dialog2Open ? 'open' : 'closed'}
        </Paragraph>
      </YStack>

      {/* hook testing components */}
      <HookTester />
    </YStack>
  )
}

function HookTester() {
  const ref = useRef<HTMLDivElement>(null)
  const hasDismissableLayers = useHasDismissableLayers()
  const isInside = useIsInsideDismissable(ref)
  const [layerCount, setLayerCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLayerCount(getDismissableLayerCount())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <YStack gap="$2" ref={ref as any} testID="hook-tester">
      <Paragraph testID="has-layers-status">
        useHasDismissableLayers: {hasDismissableLayers ? 'true' : 'false'}
      </Paragraph>
      <Paragraph testID="layer-count-status">
        getDismissableLayerCount: {layerCount}
      </Paragraph>
      <Paragraph testID="is-inside-status">
        useIsInsideDismissable: {isInside ? 'true' : 'false'}
      </Paragraph>
    </YStack>
  )
}
