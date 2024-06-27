import { useMedia } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
// import { Drawer, DrawerProvider } from '@tamagui/drawer'
import { useControllableState } from '@tamagui/use-controllable-state'
import type React from 'react'
import { useMemo } from 'react'

const MenuItem = (props) => {
  return props.children
}

type MenuProps = {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  trigger?: any
  onOpenChange?: (next: boolean) => void
}

export const Menu = withStaticProperties(
  ({ children, open: openProp, defaultOpen, trigger, onOpenChange }: MenuProps) => {
    const media = useMedia()
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange(next) {
        onOpenChange?.(next)
      },
    })

    const triggerProps = useMemo(() => {
      return {
        onPress: () => {
          setOpen((x) => !x)
        },
      }
    }, [])

    // if (media.sm) {
    //   return (
    //     <>
    //       {cloneElement(trigger, triggerProps)}
    //       <Drawer open={open} onDismiss={() => setOpen(false)}>
    //         {children}
    //       </Drawer>
    //     </>
    //   )
    // }

    return null
    // return (
    //   <Popover
    //     trigger={(props) => cloneElement(trigger, { ...props, ...triggerProps })}
    //     open={open}
    //     onOpenChange={setOpen}
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
    // Provider: DrawerProvider,
  }
)
