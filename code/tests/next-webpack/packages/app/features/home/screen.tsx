import {
  Adapt,
  Anchor,
  Button,
  type FontSizeTokens,
  getFontSize,
  H1,
  Label,
  Paragraph,
  Select,
  type SelectProps,
  Separator,
  Sheet,
  useToastController,
  XStack,
  YStack,
} from '@my/ui'
import { SwitchRouterButton } from '@my/ui/components/SwitchRouterButton'
import { SwitchThemeButton } from '@my/ui/components/SwitchThemeButton'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Activity, Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'

export function SelectDemo() {
  return (
    <YStack gap="$4">
      <XStack width={'100%'} items="center" gap="$4">
        <Label htmlFor="select-demo-1" flex={1} minW={80}>
          Custom
        </Label>
        <SelectDemoItem id="select-demo-1" />
      </XStack>

      <XStack width={'100%'} items="center" gap="$4">
        <Label htmlFor="select-demo-2" flex={1} minW={80}>
          Native
        </Label>
        <SelectDemoItem id="select-demo-2" native />
      </XStack>
    </YStack>
  )
}

export function SelectDemoItem(props: SelectProps & { trigger?: React.ReactNode }) {
  const [val, setVal] = React.useState('apple')

  return (
    <Select value={val} onValueChange={setVal} disablePreventBodyScroll {...props}>
      {props?.trigger || (
        <Select.Trigger maxWidth={220} iconAfter={ChevronDown}>
          <Select.Value placeholder="Something" />
        </Select.Trigger>
      )}

      <Adapt when="maxMd" platform="touch">
        <Sheet native={!!props.native} modal dismissOnSnapToBottom transition="medium">
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // transition="quick"
          // transitionOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minW={200}
        >
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                }),
              [items]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              r={0}
              t={0}
              b={0}
              items="center"
              justify="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown
                size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
              />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          items="center"
          justify="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack z={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
  { name: 'Honeydew' },
  { name: 'Starfruit' },
  { name: 'Blueberry' },
  { name: 'Raspberry' },
  { name: 'Strawberry' },
  { name: 'Mango' },
  { name: 'Pineapple' },
  { name: 'Lime' },
  { name: 'Lemon' },
  { name: 'Coconut' },
  { name: 'Guava' },
  { name: 'Papaya' },
  { name: 'Orange' },
  { name: 'Grape' },
  { name: 'Jackfruit' },
  { name: 'Durian' },
]

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const linkTarget = pagesMode ? '/pages-example-user' : '/user'
  const linkProps = useLink({
    href: `${linkTarget}/nate`,
  })

  return (
    <YStack flex={1} justify="center" items="center" gap="$8" p="$4" bg="$background">
      <XStack
        position="absolute"
        width="100%"
        t="$6"
        gap="$6"
        justify="center"
        flexWrap="wrap"
        $sm={{ position: 'relative', t: 0 }}
      >
        {Platform.OS === 'web' && (
          <>
            <SwitchRouterButton pagesMode={pagesMode} />
            <SwitchThemeButton />
          </>
        )}
      </XStack>

      <SelectDemo />

      <XStack gap="$2">
        <Button
          size="$3"
          iconAfter={
            <Button.Icon>
              <Activity />
            </Button.Icon>
          }
        >
          <Button.Text>Inverse</Button.Text>
        </Button>
      </XStack>
      <YStack gap="$4">
        <H1 text="center" color="$color12">
          Welcome to Tamagui.
        </H1>
        <Paragraph color="$color10" text="center">
          Here's a basic starter to show navigating from one screen to another.
        </Paragraph>
        <Separator />
        <Paragraph text="center">
          This screen uses the same code on Next.js and React Native.
        </Paragraph>
        <Separator />
      </YStack>

      <Button {...linkProps} theme={'dark'}>
        Link to user
      </Button>

      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        transition="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg="$shadow4"
          transition="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$color8" />
        <Sheet.Frame items="center" justify="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph text="center">Made by</Paragraph>
            <Anchor
              color="$blue10"
              href="https://twitter.com/natebirdman"
              target="_blank"
            >
              @natebirdman,
            </Anchor>
            <Anchor
              color="$blue10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
