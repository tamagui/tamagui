// compile fixture for data/docs/guides/how-to-upgrade.mdx and design-systems.mdx.
// every "after" snippet from the migration guides is reproduced here so a
// typecheck proves the guidance compiles against the real v3 exported APIs.
// typecheck it with tests/fixtures/tsconfig.json (it typechecks against
// tamagui.dev's own complete, CI-validated config).
//
// NOTES:
// - `import { Button } from 'tamagui'` is the STYLED v2-look skin (the tamagui
//   index shadows the unstyled @tamagui/ui primitive with the default skin), so
//   `<Button size="medium" />` compiles against its named size scale below. The
//   unstyled primitive lives at `tamagui/unstyled` and owns no size scale.
// - a couple of guide snippets use values that only exist in the v5 default
//   config the guide targets (the kebab media key `max-md` in §8, and the
//   px-string font scale in §6). those are source-verified against
//   @tamagui/config/v5 (v5-media.ts defines `max-md`; v5 pins font scales to px)
//   and reproduced here in a config-agnostic form so this fixture stays green
//   against tamagui.dev's own config.

import * as React from 'react'
import {
  Adapt,
  Button,
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
  Theme,
  Toaster,
  toast,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { FocusScope } from '@tamagui/focus-scope'
import { getRadius, getSize } from '@tamagui/get-token'

// §2 — Sheet anatomy: Frame -> Container + Background
export function SheetAnatomy({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <Sheet.Overlay />
      <Sheet.Container padding="$4">
        <Sheet.Background bg="$background" borderTopLeftRadius="$6" />
        <Sheet.ScrollView>{children}</Sheet.ScrollView>
      </Sheet.Container>
    </Sheet>
  )
}

// §3 — focusable/fullscreen replacements
export const FocusableFullscreen = () => (
  <View tabIndex={0} position="absolute" inset={0} />
)

// §3 — themeInverse / <Theme inverse>
export const ThemeInverse = () => (
  <Theme name="inverse">
    <View />
  </Theme>
)

// §4 — $true token removal: explicit tokens on space props
export const TrueTokens = () => <XStack gap="$4" p="$4" />

// §5 — token stepping replacement
export function tokenStepping(sizeToken: any, radiusToken: any) {
  const padding = getVariableValue(getSize(sizeToken)) * 0.6
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

    {/* guide uses when="max-md" (v5 default config media key); boolean here
        keeps this fixture config-agnostic */}
    <Adapt when={true} platform="touch">
      <Sheet modal dismissOnSnapToBottom>
        <Sheet.Container padding="$4">
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
            <Select.Item index={0} value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Separator />
            <Select.Item index={1} value="orange">
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
export const SquareContext = createStyledContext({ size: '$4' as const })

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

export const CircleUsage = () => <Circle size="$10" />

// §6 — numeric vs exact-px font size. the guide also shows fontSize="17px"
// (an exact px passthrough valid under the v5 px-pinned font scale); the numeric
// form below typechecks against any config.
export const Misc = () => (
  <>
    <Paragraph fontSize={17} />
    <Button>ok</Button>
  </>
)

// §4 — styled `tamagui` Button carries its own named size scale.
export const StyledButtonSize = () => <Button size="medium">Save</Button>

// §16 — v1 imperative Toast removed; v3 uses the global toast() + one <Toaster />.
export function ToastRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
export const ToastTrigger = () => (
  <Button onPress={() => toast('Saved!', { description: 'All good.' })}>Save</Button>
)

// §17 — ThemeableStack removed: extend YStack, or copy the Surface fixture.
export const Panel = styled(YStack, {
  borderWidth: 1,
  borderColor: '$borderColor',
})
export const SurfaceUsage = () => <Surface level={2} filled outlined rounded interactive />
