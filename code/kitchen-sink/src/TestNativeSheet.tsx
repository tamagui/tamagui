import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import type { SheetProps } from '@tamagui/sheet'
import { Sheet } from '@tamagui/sheet'
import React from 'react'
import { Button, H2, Input, Paragraph, XStack, YStack } from 'tamagui'

export const NativeSheetDemo = () => {
  const [position, setPosition] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [innerOpen, setInnerOpen] = React.useState(false)

  return (
    <>
      <YStack gap="$4">
        <XStack gap="$4" $sm={{ flexDirection: 'column', alignItems: 'center' }}>
          <Button onPress={() => setOpen(true)}>Open</Button>
        </XStack>
      </YStack>

      <Sheet
        native
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5">
          <Button size="$6" circular icon={ChevronDown} onPress={() => setOpen(false)} />
          <Input width={200} />
          <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
          <Button
            size="$6"
            circular
            icon={ChevronUp}
            onPress={() => setInnerOpen(true)}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

function InnerSheet(props: SheetProps) {
  return (
    <Sheet
      native
      animation="medium"
      modal
      snapPoints={[90]}
      dismissOnSnapToBottom
      {...props}
    >
      <Sheet.Overlay
        animation="medium"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Frame flex={1} justifyContent="center" alignItems="center" gap="$5">
        <Sheet.ScrollView>
          <YStack p="$5" gap="$8">
            <Button
              size="$6"
              circular
              alignSelf="center"
              icon={ChevronDown}
              onPress={() => props.onOpenChange?.(false)}
            />

            <H2>Hello world</H2>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Paragraph key={i} size="$8">
                Eu officia sunt ipsum nisi dolore labore est laborum laborum in esse ad
                pariatur. Dolor excepteur esse deserunt voluptate labore ea. Exercitation
                ipsum deserunt occaecat cupidatat consequat est adipisicing velit
                cupidatat ullamco veniam aliquip reprehenderit officia. Officia labore
                culpa ullamco velit. In sit occaecat velit ipsum fugiat esse aliqua dolor
                sint.
              </Paragraph>
            ))}
          </YStack>
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
