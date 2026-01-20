import { useWindowDimensions } from 'react-native'
import { Button, H1, Dialog as TDialog, Sheet, YStack } from 'tamagui'

/* Minimal test case for reproducing crashes */
export function TestModal() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  return (
    <TDialog>
      <TDialog.Trigger asChild>
        <Button>hi2</Button>
      </TDialog.Trigger>

      <TDialog.Adapt when="md">
        <Sheet modal snapPoints={[20, 40, 80]}>
          <Sheet.Handle
            h={10}
            bg="$background"
            o={1} // Uncommenting this causes a rare crash on native iOS Safari
            width="25%"
            m="$0"
            mb="$1"
            mt="$5"
            alignSelf="center"
            pos="absolute"
            t={-40}
          />

          <Sheet.Overlay
            height={windowHeight}
            width={windowWidth}
            bg="$background"
          />

          {/* Uncommenting this causes a rare crash on native iOS Safari */}
          <Sheet.Frame theme="red">
            <Sheet.ScrollView>
              <TDialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
        </Sheet>
      </TDialog.Adapt>

      <TDialog.Portal>
        <TDialog.Content>
          <YStack gap="$4" p="$4">
            <H1>
              Esse nulla magna reprehenderit sunt ea elit. Voluptate amet elit
              reprehenderit tempor duis duis. Nostrud adipisicing duis in sunt adipisicing
              nulla culpa. Est cillum esse reprehenderit officia incididunt ea aliquip
              aliqua quis ex cillum.
            </H1>

            <H1>
              Esse nulla magna reprehenderit sunt ea elit. Voluptate amet elit
              reprehenderit tempor duis duis. Nostrud adipisicing duis in sunt adipisicing
              nulla culpa. Est cillum esse reprehenderit officia incididunt ea aliquip
              aliqua quis ex cillum.
            </H1>
          </YStack>
        </TDialog.Content>
      </TDialog.Portal>
    </TDialog>
  )
}

/* Minimal test case for reproducing crashes */
function TestModal10() {
  return (
    <>
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
      <TestModal />
    </>
  )
}

/* Minimal test case for reproducing crashes */
export function CrashAdaptSheet() {
  return (
    <>
      <TestModal10 />
      <TestModal10 />
      <TestModal10 />
      <TestModal10 />
      <TestModal10 />

      <TestModal10 />
      <TestModal10 />
      <TestModal10 />
      <TestModal10 />
      <TestModal10 />
    </>
  )
}
