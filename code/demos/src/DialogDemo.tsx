import { ChevronDown, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Paragraph,
  Select,
  Sheet,
  TooltipSimple,
  Unspaced,
  View,
  XGroup,
  XStack,
} from 'tamagui'
import { SelectDemoContents } from './SelectDemo'

type DialogMode = 'plain' | 'adapt' | 'keepMounted'

export function DialogDemo() {
  const [mode, setMode] = useState<DialogMode>('plain')

  return (
    <View gap="$4" justify="center" items="center">
      <XGroup>
        <XGroup.Item>
          <Button
            size="$3"
            theme={mode === 'plain' ? 'accent' : undefined}
            onPress={() => setMode('plain')}
          >
            Plain
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            size="$3"
            theme={mode === 'adapt' ? 'accent' : undefined}
            onPress={() => setMode('adapt')}
          >
            Adapt to Sheet
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            size="$3"
            theme={mode === 'keepMounted' ? 'accent' : undefined}
            onPress={() => setMode('keepMounted')}
          >
            Keep Mounted
          </Button>
        </XGroup.Item>
      </XGroup>

      <DialogInstance mode={mode} />
    </View>
  )
}

function DialogInstance({ mode }: { mode: DialogMode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      modal
      keepChildrenMounted={mode === 'keepMounted'}
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild>
        <Button>
          <Button.Text>Show Dialog</Button.Text>
        </Button>
      </Dialog.Trigger>

      {mode === 'adapt' && (
        <Adapt when="maxMd" platform="touch">
          <Sheet
            transition="medium"
            zIndex={200000}
            modal
            dismissOnSnapToBottom
            unmountChildrenWhenHidden
          >
            <Sheet.Frame p="$4" gap="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$background"
              opacity={0.5}
              transition="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
      )}

      <Dialog.Portal>
        <Dialog.Overlay
          bg="$background"
          opacity={0.5}
          animateOnly={['transform', 'opacity']}
          transition={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            transition={[
              'quicker',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: 20, opacity: 0 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
              Make changes to your profile here. Click save when you're done.
            </Dialog.Description>

            <Fieldset gap="$4" horizontal>
              <Label width={64} htmlFor="name">
                Name
              </Label>
              <Input flex={1} id="name" defaultValue="Nate Wienert" />
            </Fieldset>

            <Fieldset gap="$4" horizontal>
              <Label width={64} htmlFor="username">
                <TooltipSimple label="Pick your favorite" placement="bottom-start">
                  <Paragraph>Food</Paragraph>
                </TooltipSimple>
              </Label>
              <XStack flex={1}>
                <SelectDemoContents
                  trigger={
                    <Select.Trigger flex={1} iconAfter={ChevronDown} borderRadius="$4">
                      <Select.Value placeholder="Something" />
                    </Select.Trigger>
                  }
                />
              </XStack>
            </Fieldset>

            <XStack self="flex-end" gap="$4">
              <Dialog.Close displayWhenAdapted asChild>
                <Button theme="accent" aria-label="Close">
                  Save changes
                </Button>
              </Dialog.Close>
            </XStack>

            <Unspaced>
              <Dialog.Close asChild>
                <Button position="absolute" r="$3" size="$2" circular icon={X} />
              </Dialog.Close>
            </Unspaced>
          </Dialog.Content>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  )
}
