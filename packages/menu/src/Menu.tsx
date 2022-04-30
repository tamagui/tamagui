import { useMedia, withStaticProperties } from '@tamagui/core'
import { Drawer, DrawerProvider } from '@tamagui/drawer'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { cloneElement, useEffect, useMemo, useState } from 'react'
import { Popover, YStack } from 'tamagui'

const MenuItem = (props) => {
  return props.children
}

type MenuProps = {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  trigger?: any
  onChangeOpen?: (next: boolean) => void
}

export const Menu = withStaticProperties(
  ({ children, open, defaultOpen, trigger, onChangeOpen }: MenuProps) => {
    const media = useMedia()
    const [show, setShow] = useControllableState({
      prop: open,
      defaultProp: defaultOpen || false,
      onChange(next) {
        onChangeOpen?.(next)
      },
    })

    const triggerProps = useMemo(() => {
      return {
        onPress: () => {
          setShow((x) => !x)
        },
      }
    }, [])

    if (media.sm) {
      return (
        <>
          {cloneElement(trigger, triggerProps)}
          <Drawer open={show} onDismiss={() => setShow(false)}>
            {children}
          </Drawer>
        </>
      )
    }

    return (
      <Popover
        trigger={(props) => cloneElement(trigger, { ...props, ...triggerProps })}
        isOpen={show}
        onChangeOpen={setShow}
      >
        <Popover.Content>
          <Popover.Arrow />
          <YStack backgroundColor="$background" borderRadius="$2">
            {children}
          </YStack>
        </Popover.Content>
      </Popover>
    )
  },
  {
    Item: MenuItem,
    Provider: DrawerProvider,
  }
)
