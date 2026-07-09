import { useEffect, useRef, useState } from 'react'
import type { TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Button,
  Input,
  Paragraph,
  Sheet as TamaguiSheet,
  useWindowDimensions,
  View,
  YStack,
} from 'tamagui'

const sheetBorderRadius = 32
const sheetTopRadius = {
  borderTopLeftRadius: sheetBorderRadius + 1,
  borderTopRightRadius: sheetBorderRadius + 1,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
} as const

/**
 * native regression fixture for the 3PunchConvo "create thread / filter" sheet:
 * a fit-mode modal sheet with moveOnKeyboardChange, a consumer maxHeight, tall
 * content, and an input that focuses on open (raising the keyboard).
 *
 * when the keyboard opens the sheet shifts UP, capped at the top safe-area inset.
 * the regression: the cap read getSafeArea().getInsets().top, which returns 0
 * unless @tamagui/native's safe-area abstraction is enabled against the exact
 * module instance the sheet reads — so the sheet slid under the notch. the fix
 * reads the LIVE inset (react-native-safe-area-context), so the sheet tops out
 * AT the red line below, never above it.
 *
 * the red line marks the top safe-area inset; the sheet must not cross it.
 */
export function SheetFit3pcNativeRepro() {
  const [open, setOpen] = useState(false)
  const dimensions = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const inputRef = useRef<TextInput>(null)
  // matches 3pc's default maxHeightRatio; content is taller so it scrolls and the
  // keyboard shift would otherwise push the top under the notch.
  const resolvedMaxHeight = Math.round(dimensions.height * 0.7)

  // auto-open so `directUseCase` launches straight into the scenario
  useEffect(() => {
    const id = setTimeout(() => setOpen(true), 400)
    return () => clearTimeout(id)
  }, [])

  // 3pc focuses its primary input once the open animation completes, raising the
  // soft keyboard; with moveOnKeyboardChange the sheet then shifts up.
  const handleAnimationComplete = ({ open: didOpen }: { open: boolean }) => {
    if (didOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }

  return (
    <View flex={1} bg="$color3">
      {/* safe-area top marker: the sheet top must never rise above this line */}
      <View
        testID="repro-3pc-native-safearea-marker"
        position="absolute"
        top={insets.top}
        left={0}
        right={0}
        height={2}
        bg="red"
        zIndex={1_000_000}
      />
      <YStack flex={1} padding="$4" gap="$2" justifyContent="center">
        <Button testID="repro-3pc-native-trigger" onPress={() => setOpen(true)}>
          Open 3pc-style fit sheet (tall)
        </Button>
        <Paragraph>
          safe-area top = {insets.top}; maxHeight = {resolvedMaxHeight}
        </Paragraph>
      </YStack>

      <TamaguiSheet
        transition="medium"
        zIndex={250_000}
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        moveOnKeyboardChange
        onAnimationComplete={handleAnimationComplete}
      >
        <TamaguiSheet.Overlay
          testID="repro-3pc-native-overlay"
          bg="$color5"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <TamaguiSheet.Container
          testID="repro-3pc-native-frame"
          overflow="hidden">
          <TamaguiSheet.Background
            borderBottomRightRadius={0}
            borderBottomLeftRadius={0}
            bg="transparent"
            borderRadius={sheetBorderRadius}/>
          {/* decorative absolute layers exactly like 3pc's wrapper */}
          <YStack
            {...sheetTopRadius}
            position="absolute"
            inset={0}
            bg="$color12"
            opacity={0.15}
            borderWidth={2}
            borderBottomWidth={0}
            borderColor="$borderColor"
          />
          <View {...sheetTopRadius} position="absolute" inset={0} bg="$color2" />
          <YStack
            {...sheetTopRadius}
            position="absolute"
            inset={0}
            opacity={0.25}
            borderWidth={1}
            borderBottomWidth={0}
            borderColor="$color12"
          />

          <TamaguiSheet.ScrollView
            testID="repro-3pc-native-scrollview"
            maxHeight={resolvedMaxHeight}
            keyboardShouldPersistTaps="handled"
          >
            <YStack gap="$3" padding="$4">
              <Paragraph fontWeight="bold">Filter by event</Paragraph>
              <Input
                ref={inputRef as any}
                testID="repro-3pc-native-input"
                placeholder="Search events…"
              />
              {Array.from({ length: 30 }).map((_, i) => (
                <View
                  key={i}
                  testID={`repro-3pc-native-item-${i}`}
                  padding="$3"
                  borderRadius="$3"
                  bg="$background"
                  minHeight={56}
                >
                  <Paragraph>Event {i + 1} — Fight night card</Paragraph>
                </View>
              ))}
              <Button testID="repro-3pc-native-close" onPress={() => setOpen(false)}>
                Close
              </Button>
            </YStack>
          </TamaguiSheet.ScrollView>
        </TamaguiSheet.Container>
      </TamaguiSheet>
    </View>
  )
}
