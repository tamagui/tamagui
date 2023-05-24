/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useWindowDimensions } from 'react-native'
import { Button, Dialog as TDialog } from 'tamagui'

/* Minimal test case for reproducing crashes */
function TestModal() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  return (
    <TDialog>
      <TDialog.Trigger asChild>
        <Button>hi2</Button>
      </TDialog.Trigger>

      <TDialog.Adapt when="md">
        <TDialog.Sheet modal>
          <TDialog.Sheet.Handle
            h="$0.5"
            bc="$core8"
            o={1} // Uncommenting this causes a rare crash on native iOS Safari
            width="25%"
            maxWidth="$5"
            m="$0"
            mb="$1"
            mt="$5"
            alignSelf="center"
          />
          {/* Uncommenting this causes a rare crash on native iOS Safari */}
          <TDialog.Sheet.Frame theme="red" minWidth="$40" />
          <TDialog.Sheet.ScrollView>
            <TDialog.Adapt.Contents />
          </TDialog.Sheet.ScrollView>
          <TDialog.Sheet.Overlay h={windowHeight} w={windowWidth} bc="$background" />
        </TDialog.Sheet>
      </TDialog.Adapt>
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
export function TestModal100() {
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
