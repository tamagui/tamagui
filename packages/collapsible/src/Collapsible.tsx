import { AnimatePresenceProps } from '@tamagui/animate-presence/types/types'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { ThemeableStack, ThemeableStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import {
  Stack,
  StackProps,
  composeEventHandlers,
  styled,
  withStaticProperties,
} from '@tamagui/web'
import type { ReactNode } from 'react'
import * as React from 'react'
import { AnimatePresence } from 'tamagui'

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible'

type ScopedProps<P> = P & { __scopeCollapsible?: Scope }
const [createCollapsibleContext, createCollapsibleScope] =
  createContextScope(COLLAPSIBLE_NAME)

type CollapsibleContextValue = {
  contentId: string
  disabled?: boolean
  open: boolean
  onOpenToggle(): void
}

const [CollapsibleProvider, useCollapsibleContext] =
  createCollapsibleContext<CollapsibleContextValue>(COLLAPSIBLE_NAME)

interface CollapsibleProps extends StackProps {
  defaultOpen?: boolean
  open?: boolean
  disabled?: boolean
  onOpenChange?(open: boolean): void
}

const _Collapsible = React.forwardRef<
  React.Component<StackProps>,
  ScopedProps<CollapsibleProps>
>((props, forwardedRef) => {
  const {
    __scopeCollapsible,
    open: openProp,
    defaultOpen,
    disabled,
    onOpenChange,
    ...collapsibleProps
  } = props

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen!,
    onChange: onOpenChange,
  })

  return (
    <CollapsibleProvider
      scope={__scopeCollapsible}
      disabled={disabled}
      contentId={React.useId()}
      open={open}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
    >
      <Stack
        data-state={getState(open)}
        data-disabled={disabled ? '' : undefined}
        {...collapsibleProps}
        ref={forwardedRef}
      />
    </CollapsibleProvider>
  )
})

_Collapsible.displayName = COLLAPSIBLE_NAME

/* -------------------------------------------------------------------------------------------------
 * CollapsibleTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'CollapsibleTrigger'

interface CollapsibleTriggerProps extends StackProps {
  children: ReactNode | ((props: { open: boolean }) => ReactNode)
  unstyled?: boolean
}

const CollapsibleTriggerFrame = styled(ThemeableStack, {
  name: TRIGGER_NAME,
  tag: 'button',
  variants: {
    unstyled: {
      false: {
        hoverTheme: true,
        focusTheme: true,
        pressTheme: true,
        padded: true,
        backgrounded: true,
        bordered: true,
        cursor: 'pointer',
      },
    },
  } as const,
})

const CollapsibleTrigger = CollapsibleTriggerFrame.styleable<
  ScopedProps<CollapsibleTriggerProps>
>((props, forwardedRef) => {
  const { __scopeCollapsible, children, unstyled, ...triggerProps } = props
  const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible)

  return (
    <CollapsibleTriggerFrame
      aria-controls={context.contentId}
      aria-expanded={context.open || false}
      data-state={getState(context.open)}
      data-disabled={context.disabled ? '' : undefined}
      disabled={context.disabled}
      unstyled={!!unstyled}
      {...triggerProps}
      ref={forwardedRef}
      onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
    >
      {typeof children === 'function' ? children({ open: context.open }) : children}
    </CollapsibleTriggerFrame>
  )
})

CollapsibleTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

interface CollapsibleContentProps extends AnimatePresenceProps, ThemeableStackProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
  unstyled?: boolean
}

const CONTENT_NAME = 'CollapsibleContent'

const CollapsibleContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
  variants: {
    unstyled: {
      false: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        padded: true,
        focusable: true,
      },
    },
  } as const,
})

const CollapsibleContent = CollapsibleContentFrame.styleable<
  ScopedProps<CollapsibleContentProps>
>((props, forwardedRef) => {
  const { forceMount, children, __scopeCollapsible, unstyled, ...contentProps } = props
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible)

  return (
    <AnimatePresence {...contentProps}>
      {forceMount || context.open ? (
        <CollapsibleContentFrame
          ref={forwardedRef}
          unstyled={!!unstyled}
          {...contentProps}
        >
          {children}
        </CollapsibleContentFrame>
      ) : null}
    </AnimatePresence>
  )
})

CollapsibleContent.displayName = CONTENT_NAME

/* -----------------------------------------------------------------------------------------------*/
function getState(open?: boolean) {
  return open ? 'open' : 'closed'
}

const Collapsible = withStaticProperties(_Collapsible, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})

export {
  Collapsible,
  CollapsibleContent,
  CollapsibleContentFrame,
  CollapsibleTrigger,
  CollapsibleTriggerFrame,
  createCollapsibleScope,
}
export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps }
