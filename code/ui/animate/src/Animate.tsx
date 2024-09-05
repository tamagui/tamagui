import type { AnimatePresenceProps } from '@tamagui/animate-presence'
import { AnimatePresence, PresenceChild } from '@tamagui/animate-presence'

type BaseProps = {
  children: React.ReactNode
}

type PresenceProps = AnimatePresenceProps & {
  type: 'presence'
  present: boolean
  keepChildrenMounted?: boolean
}

export type AnimateProps = BaseProps & PresenceProps

/**
 * Because mounting and unmounting children can be expensive, this gives us the
 * option to avoid that.
 *
 * type: 'presence' will act just like AnimatePresence, except you use `present`
 * instead of conditional children.
 * Note that this does avoid reconciling the children even when present={false}
 * so no extra cost to perf over AnimatePresence.
 *
 * type: 'presence' with keepChildrenMounted true *always* render the children so you pay
 * the cost up-front to mount them, but then you avoid the mount cost at the start
 * of the animation.
 *
 * There's no "right way" it just depends on the use case, this component just makes
 * it easier to choose the strategy yourself.
 *
 *
 */

export function Animate({ children, type, ...props }: AnimateProps) {
  if (type === 'presence') {
    if (props.keepChildrenMounted) {
      return (
        <PresenceChild
          initial={props.initial ? undefined : false}
          onExitComplete={props.onExitComplete}
          enterVariant={props.enterVariant}
          exitVariant={props.exitVariant}
          enterExitVariant={props.enterExitVariant}
          // BUGFIX: this causes continous re-renders if keepChildrenMounted is true, see HeaderMenu
          // but since we always re-render this component on open changes this should be fine to leave off?
          presenceAffectsLayout={false}
          isPresent={props.present}
          custom={props.custom}
        >
          {children as any}
        </PresenceChild>
      )
    }

    return <AnimatePresence {...props}>{props.present ? children : null}</AnimatePresence>
  }

  return <>{children}</>
}
