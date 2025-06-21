import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { withStaticProperties } from '@tamagui/helpers'
import { useEvent } from '@tamagui/use-event'
import * as React from 'react'

import { FocusScope } from './FocusScope'
import type { FocusScopeProps } from './FocusScopeProps'

const FOCUS_SCOPE_CONTROLLER_NAME = 'FocusScopeController'

type ScopedProps<P> = P & { __scopeFocusScopeController?: Scope }

const [createFocusScopeControllerContext, createFocusScopeControllerScope] =
  createContextScope(FOCUS_SCOPE_CONTROLLER_NAME)

type FocusScopeControllerContextValue = Omit<FocusScopeProps, 'children'>

const [FocusScopeControllerProvider, useFocusScopeControllerContext] =
  createFocusScopeControllerContext<FocusScopeControllerContextValue>(
    FOCUS_SCOPE_CONTROLLER_NAME,
    {}
  )

/* -------------------------------------------------------------------------------------------------
 * FocusScopeController
 * -----------------------------------------------------------------------------------------------*/

export interface FocusScopeControllerProps extends FocusScopeControllerContextValue {
  children?: React.ReactNode
}

function FocusScopeController(props: ScopedProps<FocusScopeControllerProps>) {
  const {
    __scopeFocusScopeController,
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
    <FocusScopeControllerProvider scope={__scopeFocusScopeController} {...contextValue}>
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
