// compile fixture for data/docs/guides/how-to-upgrade.mdx and design-systems.mdx.
// every "after" snippet from the migration guides is reproduced here so a
// typecheck proves the guidance compiles against the real v3 exported APIs.
// typecheck it with tests/fixtures/tsconfig.json (it typechecks against
// tamagui.dev's own complete, CI-validated config).
//
// NOTES:
// - `import { Button } from 'tamagui/button'` is the styled default skin, so
//   `<Button size="5" />` compiles against the token size scale below. The
//   unstyled primitive lives at `tamagui/unstyled` and owns no size scale.
// - a couple of guide snippets use configured values such as the `max-md`
//   media key. they are reproduced here in a config-agnostic form so this
//   fixture stays green against tamagui.dev's own config.

import * as React from 'react'
import {
  Adapt,
  Avatar,
  createStyledHOC,
  createStyledContext,
  getVariableValue,
  GetProps,
  Input,
  Paragraph,
  Popover,
  Select,
  Sheet,
  styled,
  Surface,
  Tabs,
  Text,
  Theme,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { Button } from 'tamagui/button'
import { Toast, toast } from 'tamagui/toast'
import { FocusScope } from '@tamagui/focus-scope'
import { getRadius, getSpace } from '@tamagui/get-token'

// §1 — behavior-only component roots need app-owned visual skins.
export const AppAvatar = styled(Avatar, {
  borderWidth: 1,
  borderColor: 'border-color',
})

export const AppTab = styled(Tabs.Tab, {
  paddingHorizontal: '3',
  paddingVertical: '2',
  activeStyle: { backgroundColor: 'background-press' },
})

// §2 — Sheet anatomy: Frame -> Container + Background
export function SheetAnatomy({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <Sheet.Overlay />
      <Sheet.Container padding="4">
        <Sheet.Background bg="background" borderTopLeftRadius="6" />
        <Sheet.ScrollView>{children}</Sheet.ScrollView>
      </Sheet.Container>
    </Sheet>
  )
}

// §3 — focusable/fullscreen replacements
export const FocusableFullscreen = () => (
  <View tabIndex={0} position="absolute" inset={0} />
)

// §3 — selectable and Select.Item index removals
export const TextAndSelectProps = () => (
  <>
    <Text userSelect="text">Copy me</Text>
    <Select.Item value="first" />
  </>
)

// §3 — createStyledHOC now accepts both arguments in one call.
type CardProps = GetProps<typeof View> & { label?: string }
export const Card = createStyledHOC(View, (props: CardProps, ref) => (
  <View {...props} ref={ref} />
))

// §3 — themeInverse / <Theme inverse>
export const ThemeInverse = () => (
  <Theme name="inverse">
    <View />
  </Theme>
)

// §4 — legacy true-token removal: explicit tokens on space props
export const TrueTokens = () => <XStack gap="4" p="4" />

// §5 — token stepping replacement
export function tokenStepping(sizeToken: any, radiusToken: any) {
  const padding = getVariableValue(getSpace(sizeToken)) * 0.6
  const radius = getVariableValue(getRadius(radiusToken)) * 1.2
  return { padding, radius }
}

// §7 — FocusScope: JSX children + noFocus
export const FocusScopeUsage = () => (
  <>
    <FocusScope trapped>
      <View />
    </FocusScope>
    <FocusScope noFocus>
      <Input placeholder="Cannot receive focus" />
    </FocusScope>
  </>
)

// §8 — Adapt anatomy shared across Popover/Select/Dialog
export const AdaptAnatomy = () => (
  <Popover>
    <Popover.Trigger />
    <Popover.Content>
      <Popover.Arrow />
      <Adapt.Contents />
    </Popover.Content>

    {/* guide uses when="max-md" (v6 default config media key); boolean here
        keeps this fixture config-agnostic */}
    <Adapt when={true} platform="touch">
      <Sheet modal dismissOnSnapToBottom>
        <Sheet.Container padding="4">
          <Sheet.Background />
          <Adapt.Contents />
        </Sheet.Container>
        <Sheet.Overlay />
      </Sheet>
    </Adapt>
  </Popover>
)

// §9 — Select: name backs real web form submission (hidden inputs)
export const SelectForm = () => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      const data = new FormData(e.currentTarget)
      console.log(data.get('fruit'))
    }}
  >
    <Select name="fruit" defaultValue="apple">
      <Select.Trigger>
        <Select.Value placeholder="Fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          <Select.Group>
            <Select.Label>Fruit</Select.Label>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Separator />
            <Select.Item value="orange">
              <Select.ItemText>Orange</Select.ItemText>
            </Select.Item>
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
    <button type="submit">Save</button>
  </form>
)

// §9 — Select content lifecycle props
export const SelectContentProps = () => (
  <Select.Content
    onEscapeKeyDown={(event) => {
      console.log('escape', event)
    }}
    onInteractOutside={(event) => {
      console.log('outside', event)
    }}
  >
    <Select.Viewport />
  </Select.Content>
)

// §12 — onDidAnimate -> typed onTransition
export const OnTransition = () => (
  <View
    transition="quick"
    onTransition={(e) => {
      if (e.phase === 'end' && e.cause === 'exit') {
        // exit finished
      }
    }}
  />
)

// §15 — defaultProps -> createStyledContext for prop propagation
export const SquareContext = createStyledContext({ size: '4' as const })

// design-systems.mdx — Circle size variant with number/Size type keys
const getCircleSize = (size: any, { tokens }: any) => {
  const value = tokens.size[size] ?? size
  return { width: value, height: value }
}

export const Circle = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 100_000_000,
  overflow: 'hidden',

  variants: {
    size: {
      number: getCircleSize,
      Size: getCircleSize,
    },
  } as const,
})

export type CircleProps = GetProps<typeof Circle>

export const CircleUsage = () => <Circle size="10" />

// §6 — numeric vs exact-px font size. the guide also shows fontSize="17px"
// (an exact px passthrough); the numeric
// form below typechecks against any config.
export const Misc = () => (
  <>
    <Paragraph fontSize={17} />
    <Button>ok</Button>
  </>
)

// §4 — the styled `tamagui/button` skin takes size tokens; omitting size uses the
// package-local control policy from @tamagui/size.
export const StyledButtonSize = () => <Button size="5">Save</Button>

// §16 — imperative Toast removed; v3 uses the global toast() + the composable parts.
export function ToastRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toast>
        <Toast.Viewport>
          <Toast.List />
        </Toast.Viewport>
      </Toast>
    </>
  )
}
export const ToastTrigger = () => (
  <Button onPress={() => toast('Saved!', { description: 'All good.' })}>Save</Button>
)

// §17 — ThemeableStack removed: extend YStack, or copy the Surface fixture.
export const Panel = styled(YStack, {
  borderWidth: 1,
  borderColor: 'border-color',
})
export const SurfaceUsage = () => (
  <Surface level={2} filled outlined rounded interactive />
)
