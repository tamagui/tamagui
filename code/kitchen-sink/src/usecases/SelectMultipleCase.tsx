import { isWeb } from '@tamagui/constants'
import React from 'react'
import { Adapt, Button, Paragraph, Text, YStack } from 'tamagui'

import { Select } from '../components/Select'
import { Sheet } from '../components/Sheet'

const fruits = [
  { value: 'red-delicious', label: 'Red Delicious' },
  { value: 'blueberry', label: 'Blue Berry' },
  { value: 'green-pear', label: 'Green Pear' },
] as const

type Fruit = (typeof fruits)[number]['value']

function FruitItems({ prefix }: { prefix: string }) {
  return fruits.map((fruit) => (
    <Select.Item
      key={fruit.value}
      value={fruit.value}
      testID={`${prefix}-${fruit.value}`}
      textValue={fruit.label}
    >
      <Select.ItemText>{fruit.label}</Select.ItemText>
      <Select.ItemIndicator testID={`${prefix}-${fruit.value}-indicator`} />
    </Select.Item>
  ))
}

function StateReadout({
  prefix,
  value,
  entries,
  open,
}: {
  prefix: string
  value: Fruit[]
  entries: string[]
  open?: boolean
}) {
  return (
    <YStack gap="$1">
      <Text testID={`${prefix}-value`}>{JSON.stringify(value)}</Text>
      <Text testID={`${prefix}-form-data`}>{JSON.stringify(entries)}</Text>
      {open === undefined ? null : <Text testID={`${prefix}-open`}>{String(open)}</Text>}
    </YStack>
  )
}

function FloatingMultiple() {
  const [value, setValue] = React.useState<Fruit[]>([])
  const [open, setOpen] = React.useState(false)
  const [entries, setEntries] = React.useState<string[]>([])
  const [valueReason, setValueReason] = React.useState('')
  const [openReason, setOpenReason] = React.useState('')
  const [activeReason, setActiveReason] = React.useState('')
  const [openChangeCount, setOpenChangeCount] = React.useState(0)

  return (
    <YStack gap="$2">
      <Paragraph>Floating custom web Select</Paragraph>
      {isWeb ? (
        <>
          <Select
            multiple
            name="floating-fruit"
            form="multiple-floating-form"
            open={open}
            onOpenChange={(nextOpen, details) => {
              setOpenReason(details.reason)
              setOpenChangeCount((count) => count + 1)
              setOpen(nextOpen)
            }}
            value={value}
            onValueChange={(nextValue, details) => {
              setValueReason(details.reason)
              setValue(nextValue)
            }}
            onActiveChange={(_activeValue, details) => {
              setActiveReason(`${details.reason}:${details.index}`)
            }}
          >
            <Select.Trigger testID="multiple-floating-trigger" width={260}>
              <Select.Value placeholder="Choose fruits" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport testID="multiple-floating-viewport" minWidth={260}>
                <FruitItems prefix="multiple-floating" />
              </Select.Viewport>
            </Select.Content>
          </Select>
          <Select name="single-fruit" form="multiple-floating-form" value="blueberry" />
          <form
            id="multiple-floating-form"
            data-testid="multiple-floating-form"
            onSubmit={(event) => {
              event.preventDefault()
              setEntries(
                new FormData(event.currentTarget).getAll('floating-fruit').map(String)
              )
            }}
          >
            <button data-testid="multiple-floating-submit" type="submit">
              Submit
            </button>
          </form>
        </>
      ) : null}
      <StateReadout prefix="multiple-floating" value={value} entries={entries} />
      <Text testID="multiple-floating-value-reason">{valueReason}</Text>
      <Text testID="multiple-floating-open-reason">{openReason}</Text>
      <Text testID="multiple-floating-open-count">{openChangeCount}</Text>
      <Text testID="multiple-floating-active-reason">{activeReason}</Text>
    </YStack>
  )
}

function NativeWebMultiple() {
  const [value, setValue] = React.useState<Fruit[]>([])
  const [entries, setEntries] = React.useState<string[]>([])
  const [valueReason, setValueReason] = React.useState('')

  if (!isWeb) return null

  return (
    <YStack gap="$2">
      <Paragraph>Browser-native multiple Select</Paragraph>
      <Select
        multiple
        native="web"
        name="native-fruit"
        form="multiple-native-form"
        value={value}
        onValueChange={(nextValue, details) => {
          setValueReason(details.reason)
          setValue(nextValue)
        }}
      >
        <Select.Trigger testID="multiple-native-trigger" />
        <Select.Group testID="multiple-native-control">
          <FruitItems prefix="multiple-native" />
        </Select.Group>
      </Select>
      <form
        id="multiple-native-form"
        data-testid="multiple-native-form"
        onSubmit={(event) => {
          event.preventDefault()
          requestAnimationFrame(() => {
            const form = document.getElementById(
              'multiple-native-form'
            ) as HTMLFormElement | null
            setEntries(form ? new FormData(form).getAll('native-fruit').map(String) : [])
          })
        }}
      >
        <button data-testid="multiple-native-submit" type="submit">
          Submit
        </button>
      </form>
      <StateReadout prefix="multiple-native" value={value} entries={entries} />
      <Text testID="multiple-native-value-reason">{valueReason}</Text>
    </YStack>
  )
}

function AdaptedMultiple() {
  const [value, setValue] = React.useState<Fruit[]>([])
  const [open, setOpen] = React.useState(false)
  const [entries, setEntries] = React.useState<string[]>([])

  return (
    <YStack gap="$2">
      <Paragraph>Adapt-to-Sheet multiple Select</Paragraph>
      {isWeb ? (
        <form
          data-testid="multiple-adapt-form"
          onSubmit={(event) => {
            event.preventDefault()
            setEntries(
              new FormData(event.currentTarget).getAll('adapt-fruit').map(String)
            )
          }}
        >
          <Select
            multiple
            name="adapt-fruit"
            open={open}
            onOpenChange={setOpen}
            value={value}
            onValueChange={setValue}
          >
            <Select.Trigger testID="multiple-adapt-trigger" width={260}>
              <Select.Value placeholder="Choose fruits" />
              <Select.Icon />
            </Select.Trigger>
            <Adapt when={true}>
              <Sheet modal snapPoints={[70]} dismissOnSnapToBottom zIndex={250_000}>
                <Sheet.Overlay
                  testID="multiple-adapt-overlay"
                  backgroundColor="$shadow6"
                />
                <Sheet.Handle testID="multiple-adapt-handle" />
                <Sheet.Container testID="multiple-adapt-sheet">
                  <Sheet.Background />
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Container>
              </Sheet>
            </Adapt>
            <Select.Content>
              <Select.Viewport testID="multiple-adapt-viewport" minWidth={260}>
                <FruitItems prefix="multiple-adapt" />
              </Select.Viewport>
            </Select.Content>
          </Select>
          <button data-testid="multiple-adapt-submit" type="submit">
            Submit
          </button>
        </form>
      ) : (
        <Select
          multiple
          open={open}
          onOpenChange={setOpen}
          value={value}
          onValueChange={setValue}
        >
          <Select.Trigger testID="multiple-adapt-trigger" width={260}>
            <Select.Value placeholder="Choose fruits" />
            <Select.Icon />
          </Select.Trigger>
          <Adapt when={true}>
            <Sheet modal snapPoints={[70]} dismissOnSnapToBottom>
              <Sheet.Overlay testID="multiple-adapt-overlay" />
              <Sheet.Handle testID="multiple-adapt-handle" />
              <Sheet.Container testID="multiple-adapt-sheet">
                <Sheet.Background />
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Container>
            </Sheet>
          </Adapt>
          <Select.Content>
            <Select.Viewport testID="multiple-adapt-viewport">
              <FruitItems prefix="multiple-adapt" />
            </Select.Viewport>
          </Select.Content>
        </Select>
      )}
      <StateReadout prefix="multiple-adapt" value={value} entries={entries} open={open} />
    </YStack>
  )
}

function PlainNativeMultiple() {
  const [value, setValue] = React.useState<Fruit[]>([])
  const [open, setOpen] = React.useState(false)

  if (isWeb) return null

  return (
    <YStack gap="$2">
      <Paragraph>Plain React Native multiple Select</Paragraph>
      <Select
        multiple
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={setValue}
      >
        <Select.Trigger testID="multiple-inline-trigger" width={260}>
          <Select.Value placeholder="Choose fruits" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport testID="multiple-inline-viewport">
            <FruitItems prefix="multiple-inline" />
          </Select.Viewport>
        </Select.Content>
      </Select>
      <StateReadout prefix="multiple-inline" value={value} entries={[]} open={open} />
      <Button testID="multiple-inline-close" onPress={() => setOpen(false)}>
        Close
      </Button>
    </YStack>
  )
}

export function SelectMultipleCase() {
  return (
    <YStack padding="$4" gap="$6">
      <FloatingMultiple />
      <NativeWebMultiple />
      <AdaptedMultiple />
      <PlainNativeMultiple />
    </YStack>
  )
}
