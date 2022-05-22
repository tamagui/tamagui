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
  ({ children, open: openProp, defaultOpen, trigger, onChangeOpen }: MenuProps) => {
    const media = useMedia()
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange(next) {
        onChangeOpen?.(next)
      },
    })

    const triggerProps = useMemo(() => {
      return {
        onPress: () => {
          setOpen((x) => !x)
        },
      }
    }, [])

    if (media.sm) {
      return (
        <>
          {cloneElement(trigger, triggerProps)}
          <Drawer open={open} onDismiss={() => setOpen(false)}>
            {children}
          </Drawer>
        </>
      )
    }

    return null
    // return (
    //   <Popover
    //     trigger={(props) => cloneElement(trigger, { ...props, ...triggerProps })}
    //     open={open}
    //     onChangeOpen={setOpen}
    //   >
    //     <Popover.Content>
    //       <Popover.Arrow />
    //       <YStack backgroundColor="$background" borderRadius="$2">
    //         {children}
    //       </YStack>
    //     </Popover.Content>
    //   </Popover>
    // )
  },
  {
    Item: MenuItem,
    Provider: DrawerProvider,
  }
)
