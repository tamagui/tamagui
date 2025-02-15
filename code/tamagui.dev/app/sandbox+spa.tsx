import { Theme, useThemeWithState } from '@tamagui/web'
import { memo, useId, useState } from 'react'
import {
  Button,
  Circle,
  type CircleProps,
  Dialog,
  Popover,
  Text,
  XStack,
  YStack,
} from 'tamagui'

export default function Sandbox() {
  return (
    <>
      <Popover open size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button>toggle</Button>
        </Popover.Trigger>

        <Popover.Content
          borderWidth={1}
          bg="red"
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          width={500}
          height={500}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

          <YStack gap="$3"></YStack>
        </Popover.Content>
      </Popover>

      <Dialog modal open>
        <Dialog.Portal>
          <Dialog.Content w={500} h={500} bg="yellow">
            <Dialog.Title>hi</Dialog.Title>
            <Dialog.Description>ok</Dialog.Description>

            <Popover open size="$5" allowFlip>
              <Popover.Trigger asChild>
                <Button>toggle</Button>
              </Popover.Trigger>

              <Popover.Content
                zIndex={100}
                borderWidth={1}
                bg="green"
                borderColor="$borderColor"
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
                elevate
                width={500}
                height={500}
                animation={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
              >
                <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

                <YStack gap="$3"></YStack>
              </Popover.Content>
            </Popover>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}

export function TextThemes() {
  const [name, setName] = useState('dark')

  return (
    <YStack gap="$2">
      {/* <Theme name="blue">
        <Switch>
          <Switch.Thumb animation="quicker" />
        </Switch>
      </Theme> */}

      {/* <ThemeToggle /> */}

      {/* <Link href="/sandbox2">Go to sandbox2</Link> */}

      <Button onPress={() => setName(name === 'dark' ? 'light' : 'dark')}>
        change {name}
      </Button>

      {/* <Circles /> */}
      <SwitchBetweenNull />

      <Theme name={name as any}>
        {/* <TooltipSimple open label="test test">
          <Circle size={10} />
        </TooltipSimple> */}

        <Circles />
      </Theme>
    </YStack>
  )
}

const SwitchBetweenNull = memo(() => {
  const [x, setX] = useState(false)

  return (
    <Theme name={x ? 'red' : null}>
      <Button onPress={() => setX(!x)}>Toggle {x ? 'on' : 'off'}</Button>
      <Circle size={50} bg="$color10" />
    </Theme>
  )
})

const Circles = memo(() => {
  console.warn('cirlcers', useId())

  return (
    <XStack bg="$color1">
      <Theme name="accent">
        <MemoTestCircle size={100} bg="$color10">
          <Slow />
          <Fast />
        </MemoTestCircle>
      </Theme>

      <Theme name="red">
        <MemoTestCircle size={100} bg="$color10" />
      </Theme>

      <Theme name="surface3">
        <MemoTestCircle size={100} bg="$borderColor" />
      </Theme>

      <Theme name="surface2">
        <MemoTestCircle size={100} bg="$borderColor" />
      </Theme>

      <Theme name="surface1">
        <MemoTestCircle size={100} bg="$borderColor" />
      </Theme>

      <MemoTestCircle />
    </XStack>
  )
})

const MemoTestCircle = memo((props: CircleProps) => {
  return <Circle size={100} bg="$color" {...props} />
})

const Slow = () => {
  console.warn('rendering Slow')
  const [theme, state] = useThemeWithState({
    // debug: true,
  })

  console.info('theme.background.val', theme.background.val, state)

  return (
    <Circle size={50} bg={theme.background.val as any}>
      <Text>🐢</Text>
    </Circle>
  )
}

const Fast = () => {
  const [theme, state] = useThemeWithState({})

  console.info('theme.background.get()', theme.background.get(), state)

  return (
    <Circle size={50} bg={theme.background.get() as any}>
      <Text>🐰</Text>
    </Circle>
  )
}
