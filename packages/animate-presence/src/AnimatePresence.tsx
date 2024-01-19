import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useForceUpdate } from '@tamagui/use-force-update'
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useRef,
} from 'react'

import { LayoutGroupContext } from './LayoutGroupContext'
import { PresenceChild } from './PresenceChild'
import { AnimatePresenceProps } from './types'

type ComponentKey = string | number

const getChildKey = (child: ReactElement<any>): ComponentKey => child.key || ''

function updateChildLookup(
  children: ReactElement<any>[],
  allChildren: Map<ComponentKey, ReactElement<any>>
) {
  children.forEach((child) => {
    const key = getChildKey(child)
    allChildren.set(key, child)
  })
}

function onlyElements(children: ReactNode): ReactElement<any>[] {
  const filtered: ReactElement<any>[] = []

  // We use forEach here instead of map as map mutates the component key by preprending `.$`
  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child)
  })

  return filtered
}

/**
 * `AnimatePresence` enables the animation of components that have been removed from the tree.
 *
 * When adding/removing more than a single child, every child **must** be given a unique `key` prop.
 *
 * Any `motion` components that have an `exit` property defined will animate out when removed from
 * the tree.
 *
 * ```tsx
 * import { motion, AnimatePresence } from 'framer-motion'
 *
 * export const Items = ({ items }) => (
 *   <AnimatePresence>
 *     {items.map(item => (
 *       <motion.div
 *         key={item.id}
 *         initial={{ opacity: 0 }}
 *         animate={{ opacity: 1 }}
 *         exit={{ opacity: 0 }}
 *       />
 *     ))}
 *   </AnimatePresence>
 * )
 * ```
 *
 * You can sequence exit animations throughout a tree using variants.
 *
 * If a child contains multiple `motion` components with `exit` props, it will only unmount the child
 * once all `motion` components have finished animating out. Likewise, any components using
 * `usePresence` all need to call `safeToRemove`.
 *
 * @public
 */
export const AnimatePresence: React.FunctionComponent<
  React.PropsWithChildren<AnimatePresenceProps>
> = ({
  children,
  enterVariant,
  exitVariant,
  enterExitVariant,
  initial = true,
  onExitComplete,
  exitBeforeEnter,
  presenceAffectsLayout = true,
  custom,
}) => {
  // We want to force a re-render once all exiting animations have finished. We
  // either use a local forceRender function, or one from a parent context if it exists.
  let forceRender = useContext(LayoutGroupContext).forceRender ?? useForceUpdate()

  const isMounted = useRef(false)

  // Filter out any children that aren't ReactElements. We can only track ReactElements with a props.key
  const filteredChildren = onlyElements(children)
  let childrenToRender = filteredChildren

  const exitingChildren = useRef(
    new Map<ComponentKey, ReactElement<any> | undefined>()
  ).current

  // Keep a living record of the children we're actually rendering so we
  // can diff to figure out which are entering and exiting
  const presentChildren = useRef(childrenToRender)

  // A lookup table to quickly reference components by key
  const allChildren = useRef(new Map<ComponentKey, ReactElement<any>>()).current

  // If this is the initial component render, just deal with logic surrounding whether
  // we play onMount animations or not.
  const isInitialRender = useRef(true)

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true
    isInitialRender.current = false
    updateChildLookup(filteredChildren, allChildren)
    presentChildren.current = childrenToRender
  })

  useEffect(() => {
    return () => {
      isMounted.current = false
      isInitialRender.current = true
      allChildren.clear()
      exitingChildren.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isInitialRender.current) {
    return (
      <>
        {childrenToRender.map((child) => (
          <PresenceChild
            key={getChildKey(child)}
            isPresent
            enterExitVariant={enterExitVariant}
            exitVariant={exitVariant}
            enterVariant={enterVariant}
            initial={initial ? undefined : false}
            presenceAffectsLayout={presenceAffectsLayout}
            custom={custom}
          >
            {child}
          </PresenceChild>
        ))}
      </>
    )
  }

  // If this is a subsequent render, deal with entering and exiting children
  childrenToRender = [...childrenToRender]

  // Diff the keys of the currently-present and target children to update our
  // exiting list.
  const presentKeys = presentChildren.current.map(getChildKey)
  const targetKeys = filteredChildren.map(getChildKey)

  // Diff the present children with our target children and mark those that are exiting
  const numPresent = presentKeys.length
  for (let i = 0; i < numPresent; i++) {
    const key = presentKeys[i]
    if (targetKeys.indexOf(key) === -1 && !exitingChildren.has(key)) {
      exitingChildren.set(key, undefined)
    }
  }

  // If we currently have exiting children, and we're deferring rendering incoming children
  // until after all current children have exiting, empty the childrenToRender array
  if (exitBeforeEnter && exitingChildren.size) {
    childrenToRender = []
  }

  // Loop through all currently exiting components and clone them to overwrite `animate`
  // with any `exit` prop they might have defined.
  exitingChildren.forEach((component, key) => {
    // If this component is actually entering again, early return
    if (targetKeys.indexOf(key) !== -1) return

    const child = allChildren.get(key)
    if (!child) return

    const insertionIndex = presentKeys.indexOf(key)

    let exitingComponent = component
    if (!exitingComponent) {
      const onExit = () => {
        // clean up the exiting children map
        exitingChildren.delete(key)

        // compute the keys of children that were rendered once but are no longer present
        // this could happen in case of too many fast consequent renderings
        // @link https://github.com/framer/motion/issues/2023
        const leftOverKeys = Array.from(allChildren.keys()).filter(
          (childKey) => !targetKeys.includes(childKey)
        )

        // clean up the all children map
        leftOverKeys.forEach((leftOverKey) => allChildren.delete(leftOverKey))

        // make sure to render only the children that are actually visible
        presentChildren.current = filteredChildren.filter((presentChild) => {
          const presentChildKey = getChildKey(presentChild)

          return (
            // filter out the node exiting
            presentChildKey === key ||
            // filter out the leftover children
            leftOverKeys.includes(presentChildKey)
          )
        })

        // Defer re-rendering until all exiting children have indeed left
        if (!exitingChildren.size) {
          if (isMounted.current === false) return

          forceRender()
          onExitComplete && onExitComplete()
        }
      }

      exitingComponent = (
        <PresenceChild
          key={getChildKey(child)}
          isPresent={false}
          onExitComplete={onExit}
          presenceAffectsLayout={presenceAffectsLayout}
          enterExitVariant={enterExitVariant}
          enterVariant={enterVariant}
          exitVariant={exitVariant}
          custom={custom}
        >
          {child}
        </PresenceChild>
      )

      exitingChildren.set(key, exitingComponent)
    }

    childrenToRender.splice(insertionIndex, 0, exitingComponent)
  })

  // Add `MotionContext` even to children that don't need it to ensure we're rendering
  // the same tree between renders
  childrenToRender = childrenToRender.map((child) => {
    const key = child.key as string | number
    return exitingChildren.has(key) ? (
      child
    ) : (
      <PresenceChild
        key={getChildKey(child)}
        isPresent
        exitVariant={exitVariant}
        enterVariant={enterVariant}
        enterExitVariant={enterExitVariant}
        presenceAffectsLayout={presenceAffectsLayout}
        custom={custom}
      >
        {child}
      </PresenceChild>
    )
  })

  console.warn('AnimatePresence render', childrenToRender)

  return (
    <>
      {exitingChildren.size
        ? childrenToRender
        : childrenToRender.map((child) => cloneElement(child))}
    </>
  )
}

AnimatePresence.displayName = 'AnimatePresence'
