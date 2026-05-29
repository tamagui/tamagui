import { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Button, Input, Sheet, Text, TextArea, XStack, YStack } from 'tamagui'
import { reportSheetLayout, startSheetTracker } from './sheetFrameTracker'

/**
 * Fixture for the mobile-web Sheet + soft-keyboard bugs.
 *
 * A fit-mode modal sheet whose ScrollView maxHeight is sized off window
 * dimensions (mirrors the 3pc create-thread sheet). On mobile web the soft
 * keyboard shrinks window.visualViewport, which react-native-web's Dimensions
 * tracks — so without the fix the sheet COLLAPSES instead of moving up, and
 * gesture handling jitters. With moveOnKeyboardChange the sheet shifts up and
 * keeps its height.
 *
 * Used by SheetWebKeyboard.test.tsx. `?open=1` starts open; `?kb=0` disables
 * moveOnKeyboardChange to reproduce the old behavior.
 */
function ViewportHUD() {
  const [info, setInfo] = useState({ inner: 0, vv: 0, kb: 0 })

  useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null
    const update = () => {
      const inner = window.innerHeight
      const vvh = vv ? Math.round(vv.height) : inner
      setInfo({ inner, vv: vvh, kb: Math.max(0, Math.round(inner - vvh)) })
    }
    update()
    vv?.addEventListener('resize', update)
    window.addEventListener('resize', update)
    return () => {
      vv?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <YStack
      position={'fixed' as any}
      t={0}
      l={0}
      r={0}
      z={9_999_999}
      bg="$red10"
      px="$3"
      py="$2"
      pointerEvents="none"
    >
      <Text color="white" fontSize={14} fontWeight="bold" testID="hud">
        inner={info.inner} vv={info.vv} kb={info.kb}
      </Text>
    </YStack>
  )
}

export function SheetWebKeyboardCase() {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()
  // ?open=1 to start open; otherwise click the trigger (the web driver animates
  // in on the false->true transition)
  const [open, setOpen] = useState(params.get('open') === '1')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  // ?kb=0 disables moveOnKeyboardChange (reproduces old behavior)
  const [moveOnKb, setMoveOnKb] = useState(params.get('kb') !== '0')
  const dimensions = useWindowDimensions()
  const maxHeight = Math.round(dimensions.height * 0.7)
  // ?track=1 turns on the disk-persisted frame+gesture telemetry (see
  // sheetFrameTracker.ts + scripts/sheet-collector.ts) for sim diagnosis.
  const track = params.get('track') === '1'
  useEffect(() => {
    if (track) startSheetTracker()
  }, [track])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-web-kb-screen">
      <ViewportHUD />

      <Text fontSize="$5" fontWeight="bold">
        Sheet + Web Keyboard
      </Text>

      <Button
        testID="sheet-web-kb-toggle"
        theme={moveOnKb ? 'green' : 'red'}
        onPress={() => setMoveOnKb((v) => !v)}
      >
        moveOnKeyboardChange: {moveOnKb ? 'ON (fixed)' : 'OFF (old)'}
      </Button>

      <Button testID="sheet-web-kb-open" theme="blue" onPress={() => setOpen(true)}>
        Open Sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        moveOnKeyboardChange={moveOnKb}
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          testID="sheet-web-kb-frame"
          br="$6"
          onLayout={track ? (e) => reportSheetLayout('frame', e) : undefined}
        >
          <Sheet.ScrollView
            testID="sheet-web-kb-scrollview"
            maxHeight={maxHeight}
            keyboardShouldPersistTaps="handled"
            onLayout={track ? (e) => reportSheetLayout('scroll', e) : undefined}
          >
            <YStack gap="$4" padding="$4">
              <Text fontSize="$6" fontWeight="bold">
                New Thread
              </Text>

              <Input
                testID="sheet-web-kb-title"
                placeholder="Title (top input)"
                value={title}
                onChangeText={setTitle}
              />

              <TextArea
                testID="sheet-web-kb-body"
                placeholder="Body"
                value={body}
                onChangeText={setBody}
                minHeight={120}
              />

              {/* spacer content to make the sheet tall */}
              <YStack height={220} bg="$backgroundHover" br="$4" ai="center" jc="center">
                <Text color="$gray11">filler content</Text>
              </YStack>

              <Input
                testID="sheet-web-kb-bottom"
                placeholder="Bottom input (most occluded)"
                value={body}
                onChangeText={setBody}
              />

              <XStack gap="$3" jc="flex-end">
                <Button testID="sheet-web-kb-cancel" onPress={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button testID="sheet-web-kb-post" theme="green">
                  Post Thread
                </Button>
              </XStack>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
