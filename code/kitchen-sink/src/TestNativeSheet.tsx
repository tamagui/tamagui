import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons-2'
import type { SheetProps } from '@tamagui/sheet'
import { Sheet } from '@tamagui/sheet'
import React from 'react'
import { H2, Input, Paragraph, XStack, YStack } from 'tamagui'
import { Button } from './components/Button'

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
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        transition="medium"
      >
        <Sheet.Overlay
          transition="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Container
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$5"
        >
          <Sheet.Background />
          <Button
            size="large"
            circular
            icon={ChevronDown}
            onPress={() => setOpen(false)}
          />
          <Input width={200} />
          <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
          <Button
            size="large"
            circular
            icon={ChevronUp}
            onPress={() => setInnerOpen(true)}
          />
        </Sheet.Container>
      </Sheet>
    </>
  )
}

function InnerSheet(props: SheetProps) {
  return (
    <Sheet
      native
      transition="medium"
      modal
      snapPoints={[90]}
      dismissOnSnapToBottom
      {...props}
    >
      <Sheet.Overlay
        transition="medium"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />
      <Sheet.Container flex={1} justifyContent="center" alignItems="center" gap="$5">
        <Sheet.Background />
        <Sheet.ScrollView>
          <YStack p="$5" gap="$8">
            <Button
              size="large"
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
      </Sheet.Container>
    </Sheet>
  )
}
