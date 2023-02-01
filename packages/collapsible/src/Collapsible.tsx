import { AnimatePresenceProps } from '@tamagui/animate-presence/types/types'
import {
  Stack,
  StackProps,
  TamaguiElement,
  composeEventHandlers,
  styled,
  useComposedRefs,
  useId,
  withStaticProperties,
} from '@tamagui/core'
import { createContextScope } from '@tamagui/create-context'
import type { Scope } from '@tamagui/create-context'
import { ThemeableStack, ThemeableStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
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

type CollapsibleElement = TamaguiElement
interface CollapsibleProps extends StackProps {
  defaultOpen?: boolean
  open?: boolean
  disabled?: boolean
  onOpenChange?(open: boolean): void
}

const _Collapsible = React.forwardRef<CollapsibleElement, CollapsibleProps>(
  (props: ScopedProps<CollapsibleProps>, forwardedRef) => {
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
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    return (
      <CollapsibleProvider
        scope={__scopeCollapsible}
        disabled={disabled}
        contentId={useId()}
        open={open}
        onOpenToggle={React.useCallback(
          () => setOpen((prevOpen) => !prevOpen),
          [setOpen]
        )}
      >
        <Stack
          data-state={getState(open)}
          data-disabled={disabled ? '' : undefined}
          {...collapsibleProps}
          // @ts-ignore
          ref={forwardedRef}
        />
      </CollapsibleProvider>
    )
  }
)

_Collapsible.displayName = COLLAPSIBLE_NAME

/* -------------------------------------------------------------------------------------------------
 * CollapsibleTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'CollapsibleTrigger'

type CollapsibleTriggerElement = TamaguiElement
interface CollapsibleTriggerProps extends StackProps {}

const CollapsibleTriggerFrame = styled(ThemeableStack, {
  name: TRIGGER_NAME,
})

const CollapsibleTrigger = React.forwardRef<
  CollapsibleTriggerElement,
  CollapsibleTriggerProps
>((props: ScopedProps<CollapsibleTriggerProps>, forwardedRef) => {
  const { __scopeCollapsible, ...triggerProps } = props
  const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible)

  return (
    <CollapsibleTriggerFrame
      tag="button"
      aria-controls={context.contentId}
      aria-expanded={context.open || false}
      data-state={getState(context.open)}
      data-disabled={context.disabled ? '' : undefined}
      disabled={context.disabled}
      {...triggerProps}
      ref={forwardedRef}
      onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
    />
  )
})

CollapsibleTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

// TODO: there might be something wrong with these two types
type CollapsibleContentElement = TamaguiElement
interface CollapsibleContentProps extends AnimatePresenceProps, ThemeableStackProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const CONTENT_NAME = 'CollapsibleContent'

const CollapsibleContentFrame = styled(ThemeableStack, {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  backgrounded: true,
})

const CollapsibleContent = React.forwardRef<
  CollapsibleContentElement,
  CollapsibleContentProps
>((props: ScopedProps<CollapsibleContentProps>, forwardedRef) => {
  const { forceMount, children, ...contentProps } = props
  const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible)

  return (
    <AnimatePresence {...contentProps}>
      {forceMount || context.open ? (
        <CollapsibleContentFrame {...contentProps}>{children}</CollapsibleContentFrame>
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

export { Collapsible, CollapsibleContent, CollapsibleTrigger, createCollapsibleScope }
export type { CollapsibleProps, CollapsibleContentProps, CollapsibleTriggerProps }
