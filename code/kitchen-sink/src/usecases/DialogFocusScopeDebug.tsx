import { Button, Dialog, Input, YStack } from 'tamagui'
import React from 'react'

export function DialogFocusScopeDebug() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    // Log focus changes
    const handleFocus = (e: FocusEvent) => {
      console.info(
        '[DEBUG] Focus changed to:',
        e.target,
        (e.target as any)?.tagName,
        (e.target as any)?.id
      )
    }

    document.addEventListener('focusin', handleFocus, true)
    return () => document.removeEventListener('focusin', handleFocus, true)
  }, [])

  return (
    <YStack padding="4" gap="4">
      <Button
        onPress={() => {
          console.info('[DEBUG] Opening dialog')
          setOpen(true)
        }}
      >
        Open Dialog (Check Console)
      </Button>

      <Dialog open={open} onOpenChange={setOpen} modal>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" transition="quick" opacity="0.5 enter:0 exit:0" />
          <Dialog.Content
            key="content"
            bordered
            elevate
            transition={{
              preset: 'quick',
              opacity: { preset: 'quick', spring: { overshootClamping: true } },
            }}
            x="enter:0 exit:0"
            y="enter:-20px exit:10px"
            opacity="enter:0 exit:0"
            scale="enter:0.9 exit:0.95"
            width={400}
            padding="6"
            gap="4"
          >
            <YStack gap="4">
              <Dialog.Title>Debug Dialog</Dialog.Title>
              <Dialog.Description>Check console for focus logs</Dialog.Description>

              <Input
                id="test-input-1"
                placeholder="First input - should auto-focus"
                onFocus={() => console.info('[DEBUG] First input focused')}
              />

              <Input
                id="test-input-2"
                placeholder="Second input"
                onFocus={() => console.info('[DEBUG] Second input focused')}
              />

              <Dialog.Close asChild>
                <Button>Close</Button>
              </Dialog.Close>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
