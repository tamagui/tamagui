import { useMedia, withStaticProperties } from '@tamagui/core'
import { Drawer, DrawerProvider } from '@tamagui/drawer'
import { cloneElement, useEffect, useMemo, useState } from 'react'
import { Popover, YStack } from 'tamagui'

const MenuItem = (props) => {
  return props.children
}

export const Menu = withStaticProperties(
  ({ children, trigger, onChangeOpen }) => {
    const [show, setShow] = useState(false)
    const media = useMedia()

    useEffect(() => {
      onChangeOpen?.(show)
    }, [show])

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
          {/* <Popover.Arrow /> */}
          <YStack backgroundColor="$bg" borderRadius="$2">
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
