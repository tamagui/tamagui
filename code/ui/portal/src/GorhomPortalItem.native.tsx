// from https://github.com/gorhom/react-native-portal
// MIT License Copyright (c) 2020 Mo Gorhom

import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEvent } from '@tamagui/core'
import { useEffect, useId } from 'react'
import { usePortal } from './GorhomPortal'
import type { PortalItemProps } from './types'

export const GorhomPortalItem = (props: PortalItemProps) => {
  const {
    name: _providedName,
    hostName,
    handleOnMount: _providedHandleOnMount,
    handleOnUnmount: _providedHandleOnUnmount,
    handleOnUpdate: _providedHandleOnUpdate,
    children,
    passthrough,
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
    if (passthrough) return

    handleOnMount()
    return () => {
      handleOnUnmount()
    }
  }, [])

  useEffect(() => {
    if (passthrough) return

    handleOnUpdate()
  }, [children])

  return passthrough ? children : null
}
