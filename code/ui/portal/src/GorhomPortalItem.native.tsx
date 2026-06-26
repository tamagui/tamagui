// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom

import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEvent } from '@tamagui/core'
import { getPortal, NativePortal } from '@tamagui/native'
import { Theme, useThemeName } from '@tamagui/web'
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

  const portalState = getPortal().state

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

  // the gorhom host renders registered children in a separate flush, outside
  // this subtree's theme context — so carry the theme as data: capture the
  // resolved name here (reliable: this item renders at its definition site)
  // and re-establish it with an absolute <Theme name> on the other side. that
  // resolves themes[name] without needing the parent state, which the host
  // flush can't see. mirrors the web Portal's repropagation (Portal.tsx).
  const themeName = useThemeName()
  const themedChildren = passThrough ? (
    children
  ) : (
    <Theme name={themeName}>{children}</Theme>
  )

  const handleOnMount = useEvent(() => {
    if (_providedHandleOnMount) {
      _providedHandleOnMount(() => addUpdatePortal(name, themedChildren))
    } else {
      addUpdatePortal(name, themedChildren)
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
      _providedHandleOnUpdate(() => addUpdatePortal(name, themedChildren))
    } else {
      addUpdatePortal(name, themedChildren)
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
  }, [children, themeName])

  return passThrough ? children : null
}
