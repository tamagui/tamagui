import type { AnimatePresenceProps } from '@tamagui/animate-presence'
import { AnimatePresence, ResetPresence } from '@tamagui/animate-presence'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import type { ThemeableStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { GetProps, StackProps } from '@tamagui/web'
import { Stack, createStyledContext, styled } from '@tamagui/web'
import * as React from 'react'

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = 'Collapsible'

type ScopedProps<P> = P & { __scopeCollapsible?: string }

type CollapsibleContextValue = {
  contentId: string
  disabled?: boolean
  open: boolean
  onOpenToggle(): void
}

const { Provider: CollapsibleProvider, useStyledContext: useCollapsibleContext } =
  createStyledContext<CollapsibleContextValue>()

interface CollapsibleProps extends StackProps {
  defaultOpen?: boolean
  open?: boolean
  disabled?: boolean
  onOpenChange?(open: boolean): void
}

const _Collapsible = React.forwardRef<Stack, ScopedProps<CollapsibleProps>>(
  (props, forwardedRef) => {
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
        onOpenToggle={React.useCallback(
          () => setOpen((prevOpen) => !prevOpen),
          [setOpen]
        )}
      >
        <Stack
          data-state={getState(open)}
          data-disabled={disabled ? '' : undefined}
          {...collapsibleProps}
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

type CollapsibleTriggerProps = GetProps<typeof Stack>

const CollapsibleTriggerFrame = styled(Stack, {
  name: TRIGGER_NAME,
  tag: 'button',
})

const CollapsibleTrigger = CollapsibleTriggerFrame.styleable(
  (props: ScopedProps<CollapsibleTriggerProps>, forwardedRef) => {
    const { __scopeCollapsible, children, ...triggerProps } = props
    const context = useCollapsibleContext(__scopeCollapsible)

    return (
      <CollapsibleTriggerFrame
        aria-controls={context.contentId}
        aria-expanded={context.open || false}
        data-state={getState(context.open)}
        data-disabled={context.disabled ? '' : undefined}
        disabled={context.disabled}
        {...(triggerProps as any)}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
      >
        {typeof children === 'function' ? children({ open: context.open }) : children}
      </CollapsibleTriggerFrame>
    )
  }
)

CollapsibleTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

export interface CollapsibleContentExtraProps extends AnimatePresenceProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

interface CollapsibleContentProps
  extends CollapsibleContentExtraProps,
    ThemeableStackProps {}

const CONTENT_NAME = 'CollapsibleContent'

const CollapsibleContentFrame = styled(Stack, {
  name: CONTENT_NAME,
})

const CollapsibleContent =
  CollapsibleContentFrame.styleable<CollapsibleContentExtraProps>(
    (props, forwardedRef) => {
      const {
        forceMount,
        children,
        // @ts-expect-error
        __scopeCollapsible,
        ...contentProps
      } = props
      const context = useCollapsibleContext(__scopeCollapsible)

      return (
        <AnimatePresence {...contentProps}>
          {forceMount || context.open ? (
            <CollapsibleContentFrame ref={forwardedRef} {...contentProps}>
              <ResetPresence>{children}</ResetPresence>
            </CollapsibleContentFrame>
          ) : null}
        </AnimatePresence>
      )
    }
  )

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
}

export type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps }
