import { FloatingFocusManager } from '@floating-ui/react'
import { AdaptPortalContents, useAdaptIsActive } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { styled } from '@tamagui/core'
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

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

export const SelectViewportFrame = styled(YStack, {
  name: VIEWPORT_NAME,

  variants: {
    unstyled: {
      false: {
        size: '$2',
        backgroundColor: '$background',
        elevate: true,
        bordered: true,
        userSelect: 'none',
        outlineWidth: 0,
      },
    },

    size: {
      '...size': (val, { tokens }) => {
        return {
          borderRadius: tokens.radius[val] ?? val,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const needsRepropagation = needsPortalRepropagation()

export const SelectViewport = SelectViewportFrame.styleable<SelectViewportExtraProps>(
  function SelectViewport(props, forwardedRef) {
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
      // @ts-ignore TODO react 19 type needs fix
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
      let content = children

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

    if (!itemContext.interactions) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`No interactions provided to Select, potentially missing Adapt`)
      }

      return null
    }

    const {
      style,
      // remove this, it was set to "Select" always
      className,
      ...floatingProps
    } = itemContext.interactions.getFloatingProps()

    return (
      <>
        {!disableScroll && !props.unstyled && (
          <style
            dangerouslySetInnerHTML={{
              __html: selectViewportCSS,
            }}
          />
        )}
        <AnimatePresence>
          {context.open ? (
            <FloatingFocusManager
              context={context.floatingContext!}
              modal={false}
              initialFocus={-1}
            >
              <SelectViewportFrame
                key="select-viewport"
                size={itemContext.size}
                role="presentation"
                {...viewportProps}
                {...style}
                {...floatingProps}
                {...(!props.unstyled && {
                  overflowY: disableScroll ? undefined : (style.overflow ?? 'auto'),
                })}
                ref={composedRefs}
              >
                {lazyMounted ? children : null}
              </SelectViewportFrame>
            </FloatingFocusManager>
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
.is_SelectViewport {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.is_SelectViewport::-webkit-scrollbar{
  display:none
}
`
