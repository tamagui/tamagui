import { Copy, X } from '@tamagui/lucide-icons'
import { memo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import type { DialogCloseProps } from 'tamagui'
import {
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  SizableText,
  Tabs,
  TextArea,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'

import { generateOutput } from '../state/generateOutput'
import { rootStore } from '../state/RootStore'
import type {
  ConfirmDeleteDialogProps,
  CreateAnimationDialogProps,
  CreateThemeDialogProps,
  DialogTypes,
  ExportDialogProps,
  StudioAlertDialogProps,
} from '../state/types'
import { useGlobalState } from '../state/useGlobalState'
import { toastController } from '../ToastProvider'

const DialogCloseButton = () => (
  <Unspaced>
    <Dialog.Close asChild="except-style">
      <Button size="$3" pos="absolute" t="$3" r="$3" circular icon={X} zi={1000} />
    </Dialog.Close>
  </Unspaced>
)

export const Dialogs = memo(() => {
  const state = useGlobalState()
  const DialogContents = dialogs[state.dialog]
  const dialogProps = state.dialogProps as any
  const dimensions = useWindowDimensions()

  if (!DialogContents) {
    return null
  }

  return (
    <Dialog
      modal
      open={state.dialog !== 'none'}
      onOpenChange={(val) => {
        if (val === false) {
          rootStore.hideDialog()
        }
      }}
    >
      <Dialog.Portal zIndex={10000000000}>
        <Dialog.Overlay
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          onPointerDownOutside={() => {
            rootStore.hideDialog()
          }}
          bordered
          elevate
          key="content"
          animation={[
            'quickest',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          maxWidth={dimensions.width * 75}
          p="$5"
        >
          <DialogContents {...dialogProps} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
})

const CreateWorkspaceDialog = () => {
  return (
    <>
      <DialogCloseButton />
      <YStack space="$4">
        <YStack space="$2">
          <Dialog.Title size="$7">Create Workspace</Dialog.Title>
          <Dialog.Description size="$3" theme="alt2">
            A workspace contains assets: colors, themes, fonts, and icons. You can import
            existing assets into the workspace after creation.
          </Dialog.Description>
        </YStack>

        <Fieldset space="$4" horizontal>
          <Label size="$3" w={160} justifyContent="flex-end" htmlFor="workspace-name">
            Name
          </Label>
          <Input size="$3" f={1} id="workspace-name" />
        </Fieldset>

        <YStack ai="flex-end" mt="$2">
          <DialogClose>
            <Button aria-label="Close">Create</Button>
          </DialogClose>
        </YStack>
      </YStack>
    </>
  )
}

const DialogClose = (props: DialogCloseProps) => {
  return (
    <Dialog.Close
      asChild
      {...props}
      onPress={() => {
        rootStore.setConfirmationStatus(true)
      }}
    />
  )
}

const CreateThemeDialog = (props: CreateThemeDialogProps) => {
  return (
    <>
      <DialogCloseButton />
      <YStack space="$4">
        <YStack space="$2">
          <Dialog.Title size="$7">Create Theme</Dialog.Title>
          <Dialog.Description size="$3" theme="alt2">
            Create a new theme in scope {props.category}.
          </Dialog.Description>
        </YStack>

        <Fieldset space="$4" horizontal>
          <Label size="$3" w={160} justifyContent="flex-end" htmlFor="theme-name">
            Name
          </Label>
          <Input size="$3" f={1} id="theme-name" />
        </Fieldset>
        <DialogClose>
          <Button aria-label="Close">Create</Button>
        </DialogClose>
      </YStack>
    </>
  )
}

const ConfirmDeleteDialog = (props: ConfirmDeleteDialogProps) => {
  return (
    <>
      <DialogCloseButton />
      <YStack space="$6" p="$2">
        <YStack space="$2">
          <Dialog.Title size="$7">Delete {props.thingName}?</Dialog.Title>
          <Dialog.Description size="$3" theme="alt2">
            Are you sure you want to delete {props.thingName}?
          </Dialog.Description>
        </YStack>

        <XStack jc="flex-end" space>
          <Dialog.Close asChild>
            <Button>Cancel</Button>
          </Dialog.Close>
          <DialogClose>
            <Button theme="red" aria-label="Close">
              Delete
            </Button>
          </DialogClose>
        </XStack>
      </YStack>
    </>
  )
}

const AlertDialog = (props: StudioAlertDialogProps) => {
  return (
    <>
      <DialogCloseButton />
      <YStack space="$6" p="$2">
        <YStack space="$2">
          <Dialog.Title size="$7">{props.title}</Dialog.Title>
          <Dialog.Description size="$3" theme="alt2">
            {props.message}
          </Dialog.Description>
        </YStack>

        <XStack jc="flex-end" space>
          <DialogClose>
            <Button themeInverse aria-label="Ok">
              Ok
            </Button>
          </DialogClose>
        </XStack>
      </YStack>
    </>
  )
}

const CreateAnimationDialog = (props: CreateAnimationDialogProps) => {
  const state = useGlobalState()
  const [name, setName] = useState('')

  return (
    <>
      <DialogCloseButton />
      <YStack space="$4">
        <YStack space="$2">
          <Dialog.Title size="$7">Create Theme</Dialog.Title>
          <Dialog.Description size="$3" theme="alt2">
            Create a new animation.
          </Dialog.Description>
        </YStack>

        <Fieldset space="$4" horizontal>
          <Label size="$3" w={160} justifyContent="flex-end" htmlFor="animation-name">
            Name
          </Label>
          <Input
            value={name}
            onChangeText={setName}
            size="$3"
            f={1}
            id="animation-name"
          />
        </Fieldset>
        {/* <Fieldset space="$4" horizontal>
          <Label size="$3" w={160} justifyContent="flex-end" htmlFor="animation-name">
            Type
          </Label>
          <RadioGroup defaultValue="react-native">
            <XStack ai="center" space>
              <RadioGroup.Item value="react-native" id="radio-react-native">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="radio-react-native">React Native</Label>
            </XStack>
            <XStack ai="center" space>
              <RadioGroup.Item value="css" id="radio-react-css">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label htmlFor="radio-react-css">CSS</Label>
            </XStack>
          </RadioGroup>
        </Fieldset> */}
        <DialogClose>
          <Button
            onPress={() => {
              state.animations.createAnimation(name)
            }}
            aria-label="Close"
          >
            Create
          </Button>
        </DialogClose>
      </YStack>
    </>
  )
}

const ExportDialog = (props: ExportDialogProps) => {
  const state = useGlobalState()
  const [tab, setTab] = useState('current')
  const snippet = tab === 'current' ? props.snippet : generateOutput(state)

  return (
    <>
      <DialogCloseButton />
      <YStack space="$4">
        <YStack space="$2">
          <Dialog.Title size="$7">Export</Dialog.Title>
          <Dialog.Description size="$3" theme="alt2">
            Copy and paste (for now)
          </Dialog.Description>
        </YStack>
        <Tabs
          size="$3"
          flexDirection="column"
          orientation="horizontal"
          value={tab}
          onValueChange={(newTab) => setTab(newTab)}
        >
          <XStack jc="space-between" ai="center" mb="$2">
            <Tabs.List disablePassBorderRadius>
              <Tabs.Tab value="current">
                <SizableText>Current Tab</SizableText>
              </Tabs.Tab>
              <Tabs.Tab value="full">
                <SizableText>Full Config</SizableText>
              </Tabs.Tab>
            </Tabs.List>

            <Button
              size="$3"
              theme="green"
              icon={Copy}
              onPress={async () => {
                await navigator.clipboard.writeText(snippet)
                toastController.show('Copied!')
              }}
            >
              Copy to Clipboard
            </Button>
          </XStack>

          <TextArea
            fontFamily="$mono"
            multiline
            width={600}
            numberOfLines={10}
            // @ts-ignore
            rows="10"
            disabled
            value={snippet}
          />
        </Tabs>

        <XStack jc="flex-end" mt="$2" space>
          <DialogClose>
            <Button aria-label="Close">Done</Button>
          </DialogClose>
        </XStack>
      </YStack>
    </>
  )
}

const dialogs: {
  [Key in keyof DialogTypes]: (props: DialogTypes[Key]) => any
} = {
  none: CreateWorkspaceDialog,
  'create-workspace': CreateWorkspaceDialog,
  'create-theme': CreateThemeDialog,
  'create-animation': CreateAnimationDialog,
  'confirm-delete': ConfirmDeleteDialog,
  export: ExportDialog,
  alert: AlertDialog,
}
