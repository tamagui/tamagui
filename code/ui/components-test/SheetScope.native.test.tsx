import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'
import { SheetProvider, useSheetContext } from '../sheet/src/SheetContext'
import { SheetController } from '../sheet/src/SheetController'
import type { SheetProps } from '../sheet/src/types'
import type { SheetContextValue } from '../sheet/src/useSheetProviderProps'
import { useSheetOpenState } from '../sheet/src/useSheetOpenState'
import { useSheetController } from '../sheet/src/useSheetController'

function createSheetContextValue(open: boolean): SheetContextValue {
  return {
    screenSize: 800,
    maxSnapPoint: 80,
    disableRemoveScroll: false,
    scrollBridge: {} as any,
    modal: true,
    open,
    setOpen: () => {},
    hidden: false,
    contentRef: { current: null },
    handleRef: { current: null },
    frameSize: 320,
    setFrameSize: () => {},
    dismissOnOverlayPress: true,
    dismissOnSnapToBottom: false,
    onOverlayComponent: undefined,
    scope: '',
    hasFit: false,
    position: 0,
    snapPoints: [80],
    snapPointsMode: 'percent',
    setMaxContentSize: () => {},
    setPosition: () => {},
    setPositionImmediate: () => {},
    onlyShowFrame: false,
    keyboardOccludedHeight: 0,
    isKeyboardVisible: false,
    keyboardStableFrameHeight: 0,
    setHasScrollView: () => {},
  }
}

describe('Sheet scope', () => {
  test('isolates double-sheet context values by scope', async () => {
    const seen: string[] = []

    function Probe({ label, scope }: { label: string; scope?: string }) {
      const context = useSheetContext(scope)
      seen.push(`${label}:${context.open ? 'open' : 'closed'}`)
      return null
    }

    await act(async () => {
      TestRenderer.create(
        <>
          <SheetProvider {...createSheetContextValue(true)} scope="left">
            <Probe label="left-implicit" />
            <SheetProvider {...createSheetContextValue(false)} scope="right">
              <Probe label="right-implicit" />
              <Probe label="left-explicit" scope="left" />
              <Probe label="right-explicit" scope="right" />
            </SheetProvider>
          </SheetProvider>
        </>
      )
    })

    expect(seen).toEqual([
      'left-implicit:open',
      'right-implicit:closed',
      'left-explicit:open',
      'right-explicit:closed',
    ])
  })

  test('binds sheet open state to the matching scoped controller', async () => {
    const seen: string[] = []

    function ControllerProbe({ label, scope }: { label: string; scope?: string }) {
      const { controller } = useSheetController(scope)
      seen.push(`${label}:${controller?.open ? 'open' : 'closed'}`)
      return null
    }

    function OpenStateProbe({ label, scope }: { label: string; scope?: string }) {
      const state = useSheetOpenState({
        scope,
        open: false,
        preferAdaptParentOpenState: true,
      } as SheetProps)
      seen.push(`${label}:${state.open ? 'open' : 'closed'}`)
      return null
    }

    await act(async () => {
      TestRenderer.create(
        <SheetController scope="adapt" open hidden={false}>
          <ControllerProbe label="controller-implicit" />
          <ControllerProbe label="controller-explicit" scope="adapt" />
          <OpenStateProbe label="open-state-matching" scope="adapt" />
          <OpenStateProbe label="open-state-other" scope="other" />
        </SheetController>
      )
    })

    expect(seen).toEqual([
      'controller-implicit:open',
      'controller-explicit:open',
      'open-state-matching:open',
      'open-state-other:closed',
    ])
  })
})
