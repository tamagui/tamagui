import { Button, Dialog, Input, YStack } from '@tamagui/ui'
import React from 'react'

export function DialogFocusScopeDebug() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    // Log focus changes
    const handleFocus = (e: FocusEvent) => {
      console.log('[DEBUG] Focus changed to:', e.target, (e.target as any)?.tagName, (e.target as any)?.id)
    }
    
    document.addEventListener('focusin', handleFocus, true)
    return () => document.removeEventListener('focusin', handleFocus, true)
  }, [])

  return (
    <YStack padding="$4" gap="$4">
      <Button onPress={() => {
        console.log('[DEBUG] Opening dialog')
        setOpen(true)
      }}>
        Open Dialog (Check Console)
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen} modal>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            key="content"
            bordered
            elevate
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            width={400}
            padding="$6"
            gap="$4"
          >
            <YStack gap="$4">
              <Dialog.Title>Debug Dialog</Dialog.Title>
              <Dialog.Description>
                Check console for focus logs
              </Dialog.Description>
              
              <Input 
                id="test-input-1" 
                placeholder="First input - should auto-focus" 
                onFocus={() => console.log('[DEBUG] First input focused')}
              />
              
              <Input 
                id="test-input-2" 
                placeholder="Second input"
                onFocus={() => console.log('[DEBUG] Second input focused')}
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