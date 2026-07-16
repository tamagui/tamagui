import { AdaptPortalContents, useAdaptIsActive } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createStyledHOC, styled, View } from '@tamagui/core'
import { needsPortalRepropagation } from '@tamagui/portal'
import { YStack } from '@tamagui/stacks'
import { startTransition } from '@tamagui/start-transition'
import * as React from 'react'
import { VIEWPORT_NAME } from './constants'
import {
  ForwardSelectContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectViewportExtraProps } from './types'
import { getSelectListboxProps } from './selectionController'

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

export const SelectViewportFrame = styled(View, {
  name: VIEWPORT_NAME,
  position: 'relative',
})

const needsRepropagation = needsPortalRepropagation()

export const SelectViewport = createStyledHOC(
  SelectViewportFrame
)<SelectViewportExtraProps>(function SelectViewport(props, forwardedRef) {
  const { scope, children, disableScroll, ...viewportProps } = props
  const context = useSelectContext(scope)
  const itemContext = useSelectItemParentContext(scope)
  const isAdapted = useAdaptIsActive(context.adaptScope)

  // lazy mount: defer mounting children until first open using startTransition
  const [lazyMounted, setLazyMounted] = React.useState(context.lazyMount ? false : true)

  React.useEffect(() => {
    if (!context.lazyMount) return
    if (!context.open) return
    if (lazyMounted) return
    startTransition(() => {
      setLazyMounted(true)
    })
  }, [context.lazyMount, context.open, lazyMounted])

  const composedRefs = useComposedRefs(
    // @ts-ignore react 19 ref type mismatch
    forwardedRef,
    context.floatingContext?.refs.setFloating as any
  )

  useIsomorphicLayoutEffect(() => {
    if (context.update) {
      context.update()
    }
  }, [isAdapted])

  // after lazy children mount, force floating-ui to recompute so inner middleware
  // can position using the now-present list items
  useIsomorphicLayoutEffect(() => {
    if (context.lazyMount && lazyMounted && context.open && context.update) {
      context.update()
    }
  }, [lazyMounted])

  if (itemContext.shouldRenderWebNative) {
    return <YStack position="relative">{children}</YStack>
  }

  if (isAdapted || !isWeb) {
    let content = (
      <SelectViewportFrame
        {...viewportProps}
        {...(isWeb ? (getSelectListboxProps(itemContext.mode) as any) : {})}
        data-select-viewport=""
        ref={composedRefs}
      >
        {lazyMounted ? children : null}
      </SelectViewportFrame>
    )

    if (needsRepropagation) {
      content = (
        <ForwardSelectContext itemContext={itemContext} context={context}>
          {content}
        </ForwardSelectContext>
      )
    }

    return <AdaptPortalContents scope={context.adaptScope}>{content}</AdaptPortalContents>
  }

  if (!itemContext.interactions) {
    return null
  }

  const {
    style,
    // remove this, it was set to "Select" always
    className,
    ...floatingProps
  } = itemContext.interactions.getFloatingProps()

  // FloatingFocusManager removed — SelectContent already wraps with FocusScope
  // that handles focus trapping and auto-focus
  return (
    <>
      {!disableScroll && (
        <style
          dangerouslySetInnerHTML={{
            __html: selectViewportCSS,
          }}
        />
      )}
      <AnimatePresence>
        {context.open ? (
          <SelectViewportFrame
            key="select-viewport"
            data-select-viewport=""
            {...(isWeb && {
              'data-state': context.open ? 'open' : 'closed',
            })}
            {...viewportProps}
            {...style}
            {...floatingProps}
            {...getSelectListboxProps(itemContext.mode)}
            overflowY={disableScroll ? undefined : (style.overflow ?? 'auto')}
            ref={composedRefs}
          >
            {lazyMounted ? children : null}
          </SelectViewportFrame>
        ) : null}
      </AnimatePresence>

      {/* keep in dom to allow for portal to the trigger when renderValue isn't provided */}
      {/* when lazyMount is enabled and renderValue is provided, skip this entirely for performance */}
      {!context.open && !(context.lazyMount && context.renderValue) && lazyMounted && (
        <div style={{ display: 'none' }}>{children}</div>
      )}
    </>
  )
})

const selectViewportCSS = `
[data-select-viewport] {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

[data-select-viewport]::-webkit-scrollbar{
  display:none
}
`
