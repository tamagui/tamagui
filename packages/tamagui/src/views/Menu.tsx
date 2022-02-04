import { useMedia } from '@tamagui/core'
import { cloneElement, useEffect, useMemo, useState } from 'react'

import { withStaticProperties } from '../helpers/withStaticProperties'
import { Drawer } from './Drawer'
import { DrawerProvider } from './DrawerProvider'
import { Popover } from './Popover/Popover'
import { YStack } from './Stacks'

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
