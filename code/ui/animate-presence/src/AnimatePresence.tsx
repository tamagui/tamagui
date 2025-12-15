import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useConstant } from '@tamagui/use-constant'
import { useForceUpdate } from '@tamagui/use-force-update'
import type { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { Children, isValidElement, useContext, useMemo, useRef, useState } from 'react'
import { LayoutGroupContext } from './LayoutGroupContext'
import { PresenceChild } from './PresenceChild'
import type { AnimatePresenceProps } from './types'

type ComponentKey = string | number

const getChildKey = (child: ReactElement<any>): ComponentKey => {
  return (
    child.key ||
    (() => {
      // we can help a bit by falling back to tamagui name or component name
      const ct = child.type
      const defaultName = ct['displayName'] || ct['name'] || ''
      if (ct && typeof ct === 'object' && 'staticConfig' in ct) {
        // @ts-expect-error
        return ct.staticConfig.componentName || defaultName
      }
      return defaultName
    })()
  )
}

function onlyElements(children: ReactNode): ReactElement<any>[] {
  const filtered: ReactElement<any>[] = []
  // We use forEach here instead of map as map mutates the component key by preprending `.$`
  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child)
  })
  return filtered
}

export const AnimatePresence: FunctionComponent<
  PropsWithChildren<AnimatePresenceProps>
> = ({
  children,
  enterVariant,
  exitVariant,
  enterExitVariant,
  initial = true,
  onExitComplete,
  exitBeforeEnter,
  mode,
  presenceAffectsLayout = true,
  custom,
  passThrough,
}) => {
  // Determine effective mode: mode prop takes precedence, then exitBeforeEnter for backwards compatibility
  const effectiveMode = mode ?? (exitBeforeEnter ? 'wait' : 'sync')

  /**
   * Filter any children that aren't ReactElements. We can only track components
   * between renders with a props.key.
   * IMPORTANT: useMemo ensures reference stability for the comparison below
   */
  const presentChildren = useMemo(() => onlyElements(children), [children])

  /**
   * Track the keys of the currently rendered children.
   */
  const presentKeys = presentChildren.map(getChildKey)

  /**
   * If `initial={false}` we only want to pass this to components in the first render.
   */
  const isInitialRender = useRef(true)

  /**
   * A ref containing the currently present children. When all exit animations
   * are complete, we use this to re-render with the latest children *committed*
   * rather than the latest children *rendered*.
   */
  const pendingPresentChildren = useRef(presentChildren)

  /**
   * Track which exiting children have finished animating out.
   */
  const exitComplete = useConstant(() => new Map<ComponentKey, boolean>())

  /**
   * Save children to render as React state. To ensure this component is concurrent-safe,
   * we check for exiting children via an effect.
   */
  const [diffedChildren, setDiffedChildren] = useState(presentChildren)
  const [renderedChildren, setRenderedChildren] = useState(presentChildren)

  /**
   * If we've been provided a forceRender function by the LayoutGroupContext,
   * we can use it to force a re-render amongst all surrounding components once
   * all components have finished animating out.
   */
  const forceRender = useContext(LayoutGroupContext).forceRender ?? useForceUpdate()

  if (passThrough) {
    return <>{children}</>
  }

  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false
    pendingPresentChildren.current = presentChildren

    /**
     * Update complete status of exiting children.
     */
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i])

      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false)
        }
      } else {
        exitComplete.delete(key)
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join('-')])

  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren]

    /**
     * Loop through all the currently rendered components and decide which
     * are exiting.
     */
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i]
      const key = getChildKey(child)

      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child)
      }
    }

    /**
     * If we're in "wait" mode, and we have exiting children, we want to
     * only render these until they've all exited.
     */
    const exitingChildren = renderedChildren.filter(
      (child) => !presentKeys.includes(getChildKey(child))
    )
    if (effectiveMode === 'wait' && exitingChildren.length) {
      nextChildren = exitingChildren
    }

    setRenderedChildren(onlyElements(nextChildren))
    setDiffedChildren(presentChildren)

    /**
     * Early return to ensure once we've set state with the latest diffed
     * children, we can immediately re-render.
     */
    return null
  }

  return (
    <>
      {renderedChildren.map((child) => {
        const key = getChildKey(child)
        const isPresent =
          presentChildren === renderedChildren || presentKeys.includes(key)

        const onExit = () => {
          if (exitComplete.has(key)) {
            exitComplete.set(key, true)
          } else {
            return
          }

          let isEveryExitComplete = true
          exitComplete.forEach((isExitComplete) => {
            if (!isExitComplete) isEveryExitComplete = false
          })

          if (isEveryExitComplete) {
            forceRender?.()
            setRenderedChildren(pendingPresentChildren.current)
            onExitComplete?.()
          }
        }

        return (
          <PresenceChild
            key={key}
            isPresent={isPresent}
            initial={!isInitialRender.current || initial ? undefined : false}
            custom={custom}
            presenceAffectsLayout={presenceAffectsLayout}
            enterExitVariant={enterExitVariant}
            enterVariant={enterVariant}
            exitVariant={exitVariant}
            onExitComplete={isPresent ? undefined : onExit}
          >
            {child}
          </PresenceChild>
        )
      })}
    </>
  )
}

AnimatePresence.displayName = 'AnimatePresence'
