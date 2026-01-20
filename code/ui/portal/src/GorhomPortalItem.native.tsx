// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom

import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEvent } from '@tamagui/core'
import { getNativePortalState, NativePortal } from '@tamagui/native-portal'
import { useEffect, useId } from 'react'
import { usePortal } from './GorhomPortal'
import type { PortalItemProps } from './types'

export const GorhomPortalItem = (props: PortalItemProps) => {
  const {
    name: _providedName,
    hostName = 'root',
    handleOnMount: _providedHandleOnMount,
    handleOnUnmount: _providedHandleOnUnmount,
    handleOnUpdate: _providedHandleOnUpdate,
    children,
    passThrough,
  } = props

  const portalState = getNativePortalState()

  // use teleport if available - it preserves context so we can skip the Gorhom system
  if (portalState.type === 'teleport') {
    if (passThrough) {
      return children
    }
    return <NativePortal hostName={hostName}>{children}</NativePortal>
  }

  // fall back to Gorhom portal system
  return (
    <GorhomPortalItemFallback
      name={_providedName}
      hostName={hostName}
      handleOnMount={_providedHandleOnMount}
      handleOnUnmount={_providedHandleOnUnmount}
      handleOnUpdate={_providedHandleOnUpdate}
      passThrough={passThrough}
    >
      {children}
    </GorhomPortalItemFallback>
  )
}

// original Gorhom implementation as fallback
const GorhomPortalItemFallback = (props: PortalItemProps) => {
  const {
    name: _providedName,
    hostName,
    handleOnMount: _providedHandleOnMount,
    handleOnUnmount: _providedHandleOnUnmount,
    handleOnUpdate: _providedHandleOnUpdate,
    children,
    passThrough,
  } = props

  const { addPortal: addUpdatePortal, removePortal } = usePortal(hostName)
  const id = useId()
  const name = _providedName || id

  const handleOnMount = useEvent(() => {
    if (_providedHandleOnMount) {
      _providedHandleOnMount(() => addUpdatePortal(name, children))
    } else {
      addUpdatePortal(name, children)
    }
  })

  const handleOnUnmount = useEvent(() => {
    if (_providedHandleOnUnmount) {
      _providedHandleOnUnmount(() => removePortal(name))
    } else {
      removePortal(name)
    }
  })

  const handleOnUpdate = useEvent(() => {
    if (_providedHandleOnUpdate) {
      _providedHandleOnUpdate(() => addUpdatePortal(name, children))
    } else {
      addUpdatePortal(name, children)
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (passThrough) return

    handleOnMount()
    return () => {
      handleOnUnmount()
    }
  }, [])

  useEffect(() => {
    if (passThrough) return

    handleOnUpdate()
  }, [children])

  return passThrough ? children : null
}
