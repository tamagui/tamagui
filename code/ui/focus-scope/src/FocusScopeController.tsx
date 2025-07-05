import { createContextScope } from '@tamagui/create-context'
import { useEvent } from '@tamagui/use-event'
import * as React from 'react'
import type { FocusScopeProps } from './types'
import type { ScopedProps } from './types'

const FOCUS_SCOPE_CONTROLLER_NAME = 'FocusScopeController'

const [createFocusScopeControllerContext, createFocusScopeControllerScope] =
  createContextScope(FOCUS_SCOPE_CONTROLLER_NAME)

type FocusScopeControllerContextValue = Omit<FocusScopeProps, 'children'>

const [FocusScopeControllerProvider, useFocusScopeControllerContext] =
  createFocusScopeControllerContext<FocusScopeControllerContextValue>(
    FOCUS_SCOPE_CONTROLLER_NAME
  )

/* -------------------------------------------------------------------------------------------------
 * FocusScopeController
 * -----------------------------------------------------------------------------------------------*/

export interface FocusScopeControllerProps extends FocusScopeControllerContextValue {
  children?: React.ReactNode
}

function FocusScopeController(props: ScopedProps<FocusScopeControllerProps>) {
  const {
    __scopeFocusScope,
    children,
    enabled,
    loop,
    trapped,
    onMountAutoFocus,
    onUnmountAutoFocus,
    forceUnmount,
    focusOnIdle,
  } = props

  const stableOnMountAutoFocus = useEvent(onMountAutoFocus)
  const stableOnUnmountAutoFocus = useEvent(onUnmountAutoFocus)

  const contextValue = React.useMemo(
    () => ({
      enabled,
      loop,
      trapped,
      onMountAutoFocus: stableOnMountAutoFocus,
      onUnmountAutoFocus: stableOnUnmountAutoFocus,
      forceUnmount,
      focusOnIdle,
    }),
    [
      enabled,
      loop,
      trapped,
      stableOnMountAutoFocus,
      stableOnUnmountAutoFocus,
      forceUnmount,
      focusOnIdle,
    ]
  )

  return (
    <FocusScopeControllerProvider scope={__scopeFocusScope} {...contextValue}>
      {children}
    </FocusScopeControllerProvider>
  )
}

const FocusScopeControllerComponent = FocusScopeController

export {
  createFocusScopeControllerScope,
  FocusScopeControllerComponent as FocusScopeController,
  FocusScopeControllerProvider,
  useFocusScopeControllerContext,
}
