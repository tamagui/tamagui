import { FloatingFocusManager } from '@floating-ui/react-dom-interactions'
import { TamaguiElement, isWeb } from '@tamagui/core'
import { styled } from '@tamagui/core'
import { PortalItem } from '@tamagui/portal'
import { ThemeableStack } from '@tamagui/stacks'
import * as React from 'react'

import { VIEWPORT_NAME } from './constants'
import { useSelectContext } from './context'
import { useSelectBreakpointActive } from './Select'
import { ScopedProps, SelectViewportProps } from './types'

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

export const SelectViewportFrame = styled(ThemeableStack, {
  name: VIEWPORT_NAME,
  backgroundColor: '$background',
  elevate: true,
  bordered: true,
  overflow: 'scroll',
  userSelect: 'none',

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          borderRadius: tokens.radius[val] ?? val,
        }
      },
    },
  },

  defaultVariants: {
    size: '$2',
  },
})

export const SelectViewport = React.forwardRef<TamaguiElement, SelectViewportProps>(
  (props: ScopedProps<SelectViewportProps>, forwardedRef) => {
    const { __scopeSelect, children, ...viewportProps } = props
    const context = useSelectContext(VIEWPORT_NAME, __scopeSelect)
    const breakpointActive = useSelectBreakpointActive(context.sheetBreakpoint)

    if (breakpointActive || !isWeb) {
      return <PortalItem hostName={`${context.scopeKey}SheetContents`}>{children}</PortalItem>
    }

    if (!context.floatingContext) {
      return null
    }

    if (!context.open) {
      return children
    }

    const {
      style: { scrollbarWidth, listStyleType, ...restStyle },
      ...floatingProps
    } = context.interactions!.getFloatingProps()

    return (
      <>
        {/* Hide scrollbars cross-browser and enable momentum scroll for touch devices */}
        <style
          dangerouslySetInnerHTML={{
            __html: disableScrollbarCSS,
          }}
        />
        <FloatingFocusManager context={context.floatingContext} preventTabbing>
          <SelectViewportFrame
            size={context.size}
            data-tamagui-select-viewport=""
            // @ts-ignore
            role="presentation"
            {...viewportProps}
            ref={forwardedRef}
            {...floatingProps}
            {...restStyle}
          >
            {children}
          </SelectViewportFrame>
        </FloatingFocusManager>
      </>
    )
  }
)

SelectViewport.displayName = VIEWPORT_NAME

const disableScrollbarCSS = `[data-tamagui-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-tamagui-select-viewport]::-webkit-scrollbar{display:none}`
