import { useForceUpdate } from '@tamagui/use-force-update'
import type { ReactElement, ReactNode } from 'react'
import type { FunctionComponent, PropsWithChildren } from 'react'
import { Children, cloneElement, isValidElement, useContext, useRef } from 'react'

import { LayoutGroupContext } from './LayoutGroupContext'
import { PresenceChild } from './PresenceChild'
import type { AnimatePresenceProps } from './types'

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
  presenceAffectsLayout = true,
  custom,
}) => {
  // We want to force a re-render once all exiting animations have finished. We
  // either use a local forceRender function, or one from a parent context if it exists.
  let forceRender = useContext(LayoutGroupContext).forceRender ?? useForceUpdate()

  // Filter out any children that aren't ReactElements. We can only track ReactElements with a props.key
  const filteredChildren = onlyElements(children)

  // Keep a living record of the children we're actually rendering so we
  // can diff to figure out which are entering and exiting
  const presentChildren = useRef(filteredChildren)

  // A lookup table to quickly reference components by key
  const allChildren = useRef(new Map<ComponentKey, ReactElement<any>>()).current

  const exiting = useRef(new Set<ComponentKey>()).current
  updateChildLookup(filteredChildren, allChildren)

  // If this is the initial component render, just deal with logic surrounding whether
  // we play onMount animations or not.
  const isInitialRender = useRef(true)

  if (isInitialRender.current) {
    isInitialRender.current = false
    return (
      <>
        {filteredChildren.map((child) => (
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

  let childrenToRender = [...filteredChildren]

  // Diff the keys of the currently-present and target children to update our
  // exiting list.
  const presentKeys = presentChildren.current.map(getChildKey)
  const targetKeys = filteredChildren.map(getChildKey)

  // Diff the present children with our target children and mark those that are exiting
  const numPresent = presentKeys.length
  for (let i = 0; i < numPresent; i++) {
    const key = presentKeys[i]
    if (targetKeys.indexOf(key) === -1) {
      exiting.add(key)
    } else {
      // In case this key has re-entered, remove from the exiting list
      exiting.delete(key)
    }
  }

  // If we currently have exiting children, and we're deferring rendering incoming children
  // until after all current children have exiting, empty the childrenToRender array
  if (exitBeforeEnter && exiting.size) {
    childrenToRender = []
  }

  // Loop through all currently exiting components and clone them to overwrite `animate`
  // with any `exit` prop they might have defined.
  exiting.forEach((key) => {
    // If this component is actually entering again, early return
    if (targetKeys.indexOf(key) !== -1) return

    const child = allChildren.get(key)
    if (!child) return

    const insertionIndex = presentKeys.indexOf(key)

    const onExit = () => {
      allChildren.delete(key)
      exiting.delete(key)
      const removeIndex = presentChildren.current.findIndex(
        (presentChild) => presentChild.key === key
      )
      presentChildren.current.splice(removeIndex, 1)

      if (!exiting.size) {
        presentChildren.current = filteredChildren
        forceRender()
        onExitComplete?.()
      }
    }

    const exitingComponent = (
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

    childrenToRender.splice(insertionIndex, 0, exitingComponent)
  })

  // Add `MotionContext` even to children that don't need it to ensure we're rendering
  // the same tree between renders
  childrenToRender = childrenToRender.map((child) => {
    const key = child.key as ComponentKey
    return exiting.has(key) ? (
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

  presentChildren.current = childrenToRender

  return (
    <>
      {exiting.size
        ? childrenToRender
        : // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
          childrenToRender.map((child) => cloneElement(child))}
    </>
  )
}

AnimatePresence.displayName = 'AnimatePresence'
