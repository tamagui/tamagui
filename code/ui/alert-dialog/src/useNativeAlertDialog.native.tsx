import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { isTamaguiElement } from '@tamagui/core'
import type { DialogProps } from '@tamagui/dialog'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { Alert } from 'react-native'

import type { AlertDialogPartStaticConfig } from './alertDialogPart'
import { ALERT_DIALOG_PART } from './alertDialogPart'

/**
 * With `native`, the dialog is the platform's own alert: the children are never
 * rendered, they are read for their title, description and buttons and handed
 * to `Alert.alert`, and only the trigger stays in the tree.
 */
export const useNativeAlertDialog = (
  props: DialogProps & { native?: boolean }
): React.ReactElement | null => {
  const { native } = props

  const [open, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen || false,
    onChange: props.onOpenChange,
    transition: true,
  })

  let triggerElement: any = null
  let title = ''
  let description = ''
  const buttons: {
    text: string
    onPress: (value?: string | undefined) => void
    style?: 'default' | 'cancel' | 'destructive'
  }[] = []

  forEachChildDeep(React.Children.toArray(props.children), (child) => {
    if (!React.isValidElement(child)) return false
    const part = isTamaguiElement(child)
      ? (child.type.staticConfig as AlertDialogPartStaticConfig)[ALERT_DIALOG_PART]
      : undefined
    switch (part) {
      case 'trigger': {
        triggerElement = React.cloneElement(child as any, {
          __native: true,
        })
        return false
      }
      case 'title': {
        title = getStringChildren(child)
        return false
      }
      case 'description': {
        description = getStringChildren(child)
        return false
      }
      case 'action':
      case 'destructive':
      case 'cancel': {
        const style =
          part === 'action'
            ? 'default'
            : part === 'destructive'
              ? 'destructive'
              : 'cancel'
        const text = getStringChildren(child)
        const onPress = () => {
          const childProps = child.props as any
          childProps?.onPress?.({ native: true })
          setOpen(false)
        }
        buttons.push({
          style,
          text,
          // @ts-ignore
          onPress,
        })
        return false
      }
      default: {
        return true
      }
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (!open || !native) return
    if (title || description) {
      Alert.alert(title, description, buttons)
    }
  }, [native, open])

  if (native) {
    return React.cloneElement(triggerElement, {
      __onPress: () => {
        setOpen(true)
      },
    })
  }

  return null
}

function forEachChildDeep(
  children: React.ReactNode[],
  onChild: (el: React.ReactElement) => boolean
) {
  for (const child of children) {
    if (!React.isValidElement(child)) continue
    if (!onChild(child)) continue
    // TODO react 19 doesn't like child.props
    const childProps = child.props as unknown as any
    if (childProps.children) {
      forEachChildDeep(React.Children.toArray(childProps.children), onChild)
    }
  }
}

function getStringChildren(child: React.ReactElement) {
  let string = ''
  forEachChildDeep(React.Children.toArray(child), (child) => {
    if (typeof (child.props as Record<string, any>).children === 'string') {
      string = (child.props as Record<string, any>).children
      return false
    }
    return true
  })
  return string
}
