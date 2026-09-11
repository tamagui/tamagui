import { AdaptPortalContents, useAdaptIsActive } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createStyledHOC, styled, View } from '@tamagui/style'
import { needsPortalRepropagation } from '@tamagui/portal'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { VIEWPORT_NAME } from './constants'
import {
  ForwardSelectContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectViewportProps } from './types'
import { getSelectListboxProps } from './selectionController'

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

export const SelectViewportFrame = styled(View, {
  displayName: VIEWPORT_NAME,
  position: 'relative',
})

const needsRepropagation = needsPortalRepropagation()

export const SelectViewport = createStyledHOC(
  SelectViewportFrame,
  function SelectViewport(props: SelectViewportProps, forwardedRef) {
    const { scope, children, disableScroll, ...viewportProps } = props
    const context = useSelectContext(scope)
    const itemContext = useSelectItemParentContext(scope)
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const viewportRef = React.useRef<any>(null)
    const registeredItemCount = itemContext.registry.getItems().length

    // lazy mount keeps the items out of the tree until the first open, but it
    // has to happen in the render that opens, not in an effect after it: mounting
    // a frame later paints an empty popover, then floating-ui positions that empty
    // box and has to jump once the real height arrives. once mounted it stays.
    const hasOpenedRef = React.useRef(!context.lazyMount)
    if (context.open) hasOpenedRef.current = true
    const lazyMounted = hasOpenedRef.current

    React.useEffect(() => {
      if (!isWeb || !isAdapted || !context.open) return
      const frame = requestAnimationFrame(() => {
        const index =
          context.activeIndexRef.current ?? itemContext.registry.firstEnabledIndex()
        const activeItem =
          (viewportRef.current?.querySelector(
            '[role="option"][tabindex="0"]'
          ) as HTMLElement | null) ??
          (index >= 0 ? itemContext.listRef?.current[index] : null)
        activeItem?.focus()
      })
      return () => cancelAnimationFrame(frame)
    }, [context.open, isAdapted, registeredItemCount])

    const composedRefs = useComposedRefs(
      // @ts-ignore react 19 ref type mismatch
      forwardedRef,
      viewportRef,
      context.floatingContext?.refs.setFloating as any
    )

    useIsomorphicLayoutEffect(() => {
      if (context.update) {
        context.update()
      }
    }, [isAdapted])

    // items register in layout effects, so the inner middleware can only position
    // against the selected one once the registry has settled
    React.useEffect(() => {
      if (context.lazyMount && context.open && context.update) {
        const frame = requestAnimationFrame(context.update)
        return () => cancelAnimationFrame(frame)
      }
    }, [context.open, registeredItemCount])

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

      return (
        <AdaptPortalContents scope={context.adaptScope}>{content}</AdaptPortalContents>
      )
    }

    if (!context.interactions) {
      return null
    }

    const floatingProps = context.interactions.getFloatingProps()

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
        {/* every styled item reads the presence context, and the default
            (layout-affecting) presence hands out a new context per render, so
            each viewport render would re-render the whole list */}
        <AnimatePresence presenceAffectsLayout={false}>
          {context.open ? (
            <SelectViewportFrame
              key="select-viewport"
              data-select-viewport=""
              {...(isWeb && {
                'data-state': context.open ? 'open' : 'closed',
              })}
              {...viewportProps}
              {...context.floatingPosition}
              outlineWidth={0}
              {...floatingProps}
              {...getSelectListboxProps(itemContext.mode)}
              overflowY={disableScroll ? undefined : 'auto'}
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
  }
)

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
