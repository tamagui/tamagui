import {
  Stack,
  composeEventHandlers,
  createStyledContext,
  isWeb,
  styled,
} from '@tamagui/core'
// TODO: use tamagui style to group all Menu components inside it
import {
  Menu,
  MenuAnchor,
  MenuArrow,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemIndicator,
  MenuLabel,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from '@tamagui/menu'
import { useCallbackRef } from '@tamagui/use-callback-ref'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

type Direction = 'ltr' | 'rtl'
type Point = { x: number; y: number }

/* -------------------------------------------------------------------------------------------------
 * ContextMenu
 * -----------------------------------------------------------------------------------------------*/

const CONTEXT_MENU_NAME = 'ContextMenu'

const CONTEXTMENU_CONTEXT = 'ContextMenu'

type ContextMenuContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  modal: boolean
}

type ScopedProps<P> = P & { __scopeContextMenu?: string }

const { Provider: ContextMenuProvider, useStyledContext: useContextMenuContext } =
  createStyledContext<ContextMenuContextValue>()

interface ContextMenuProps {
  children?: React.ReactNode
  onOpenChange?(open: boolean): void
  dir?: Direction
  modal?: boolean
}

const ContextMenu: React.FC<ScopedProps<ContextMenuProps>> = (
  props: ScopedProps<ContextMenuProps>
) => {
  const { __scopeContextMenu, children, onOpenChange, dir, modal = true } = props
  const [open, setOpen] = React.useState(false)
  const handleOpenChangeProp = useCallbackRef(onOpenChange)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      handleOpenChangeProp(open)
    },
    [handleOpenChangeProp]
  )

  return (
    <ContextMenuProvider
      scope={__scopeContextMenu}
      open={open}
      onOpenChange={handleOpenChange}
      modal={modal}
    >
      <Menu
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        dir={dir}
        open={open}
        onOpenChange={handleOpenChange}
        modal={modal}
      >
        {children}
      </Menu>
    </ContextMenuProvider>
  )
}

ContextMenu.displayName = CONTEXT_MENU_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'ContextMenuTrigger'

type ContextMenuTriggerElement = React.ElementRef<typeof Stack>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
  disabled?: boolean
}

const ContextMenuTriggerFrame = styled(Stack, {
  name: TRIGGER_NAME,
})

const ContextMenuTrigger = ContextMenuTriggerFrame.styleable<
  ScopedProps<ContextMenuTriggerProps>
>((props: ScopedProps<ContextMenuTriggerProps>, forwardedRef) => {
  const { __scopeContextMenu, style, disabled = false, ...triggerProps } = props
  const context = useContextMenuContext(__scopeContextMenu)
  const pointRef = React.useRef<Point>({ x: 0, y: 0 })
  const virtualRef = React.useRef({
    getBoundingClientRect: () =>
      DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
  })
  const longPressTimerRef = React.useRef(0)
  const clearLongPress = React.useCallback(
    () => window.clearTimeout(longPressTimerRef.current),
    []
  )
  const handleOpen = (event: React.MouseEvent | React.PointerEvent) => {
    pointRef.current = { x: event.clientX, y: event.clientY }
    context.onOpenChange(true)
  }

  React.useEffect(() => clearLongPress, [clearLongPress])
  React.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress])

  return (
    <>
      {/* TODO: why it's static here */}
      <MenuAnchor
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        virtualRef={virtualRef}
      />
      <ContextMenuTriggerFrame
        tag="span"
        data-state={context.open ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={forwardedRef}
        // prevent iOS context menu from appearing
        style={isWeb ? { WebkitTouchCallout: 'none', ...(style as Object) } : null}
        // if trigger is disabled, enable the native Context Menu
        // TODO: this only works on web. make it to work on native as well
        {...(isWeb && {
          onContextMenu: disabled
            ? (props as React.HTMLProps<'div'>).onContextMenu
            : composeEventHandlers(
                (props as React.HTMLProps<'div'>).onContextMenu,
                // TODO: fix this any
                (event: any) => {
                  // clearing the long press here because some platforms already support
                  // long press to trigger a `contextmenu` event
                  clearLongPress()
                  handleOpen(event)
                  event.preventDefault()
                }
              ),
        })}
        // TODO: these things only work on web, make them available on native as well
        onPointerDown={
          disabled
            ? props.onPointerDown
            : composeEventHandlers(
                props.onPointerDown,
                // @ts-ignore
                whenTouchOrPen<Element>((event) => {
                  // clear the long press here in case there's multiple touch points
                  clearLongPress()
                  longPressTimerRef.current = window.setTimeout(
                    () => handleOpen(event),
                    700
                  )
                })
              )
        }
        onPointerMove={
          disabled
            ? props.onPointerMove
            : // TODO: resolve these ts-ignores
              // @ts-ignore
              composeEventHandlers(props.onPointerMove, whenTouchOrPen(clearLongPress))
        }
        onPointerCancel={
          disabled
            ? props.onPointerCancel
            : // @ts-ignore
              composeEventHandlers(props.onPointerCancel, whenTouchOrPen(clearLongPress))
        }
        onPointerUp={
          disabled
            ? props.onPointerUp
            : // @ts-ignore
              composeEventHandlers(props.onPointerUp, whenTouchOrPen(clearLongPress))
        }
      />
    </>
  )
})

ContextMenuTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'ContextMenuPortal'

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPortal>
interface ContextMenuPortalProps extends MenuPortalProps {}

const ContextMenuPortal: React.FC<ScopedProps<ContextMenuPortalProps>> = (
  props: ScopedProps<ContextMenuPortalProps>
) => {
  const { __scopeContextMenu, ...portalProps } = props
  return (
    <MenuPortal
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...portalProps}
    />
  )
}

ContextMenuPortal.displayName = PORTAL_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'ContextMenuContent'

type ContextMenuContentElement = React.ElementRef<typeof MenuContent>
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuContent>
interface ContextMenuContentProps
  extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {}

const ContextMenuContent = React.forwardRef<
  ContextMenuContentElement,
  ScopedProps<ContextMenuContentProps>
>((props: ScopedProps<ContextMenuContentProps>, forwardedRef) => {
  const { __scopeContextMenu, ...contentProps } = props
  const context = useContextMenuContext(__scopeContextMenu)
  const hasInteractedOutsideRef = React.useRef(false)

  return (
    <MenuContent
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...contentProps}
      ref={forwardedRef}
      // TODO: these props doesn't exists
      // side="right"
      // sideOffset={2}
      // align="start"
      onCloseAutoFocus={(event) => {
        props.onCloseAutoFocus?.(event)

        if (!event.defaultPrevented && hasInteractedOutsideRef.current) {
          event.preventDefault()
        }

        hasInteractedOutsideRef.current = false
      }}
      onInteractOutside={(event) => {
        props.onInteractOutside?.(event)

        if (!event.defaultPrevented && !context.modal)
          hasInteractedOutsideRef.current = true
      }}
      // TODO: handle this on native as well
      style={
        isWeb && {
          ...(props.style as Object),
          // re-namespace exposed content custom properties
          ...({
            '--tamagui-context-menu-content-transform-origin':
              'var(--tamagui-popper-transform-origin)',
            '--tamagui-context-menu-content-available-width':
              'var(--tamagui-popper-available-width)',
            '--tamagui-context-menu-content-available-height':
              'var(--tamagui-popper-available-height)',
            '--tamagui-context-menu-trigger-width': 'var(--tamagui-popper-anchor-width)',
            '--tamagui-context-menu-trigger-height':
              'var(--tamagui-popper-anchor-height)',
          } as unknown as React.CSSProperties),
        }
      }
    />
  )
})

ContextMenuContent.displayName = CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ContextMenuGroup'

type ContextMenuGroupElement = React.ElementRef<typeof MenuGroup>
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuGroup>
interface ContextMenuGroupProps extends MenuGroupProps {}

const ContextMenuGroupFrame = styled(MenuGroup, {
  name: GROUP_NAME,
})

const ContextMenuGroup = ContextMenuGroupFrame.styleable<
  ScopedProps<ContextMenuGroupProps>
>((props: ScopedProps<ContextMenuGroupProps>, forwardedRef) => {
  const { __scopeContextMenu, ...groupProps } = props
  return (
    <ContextMenuGroupFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...groupProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuGroup.displayName = GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'ContextMenuLabel'

type ContextMenuLabelElement = React.ElementRef<typeof MenuLabel>
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuLabel>
interface ContextMenuLabelProps extends MenuLabelProps {}

const ContextMenuLabelFrame = styled(MenuLabel, {
  name: LABEL_NAME,
})
const ContextMenuLabel = ContextMenuLabelFrame.styleable<
  ScopedProps<ContextMenuLabelProps>
>((props: ScopedProps<ContextMenuLabelProps>, forwardedRef) => {
  const { __scopeContextMenu, ...labelProps } = props
  return (
    <ContextMenuLabelFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...labelProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuLabel.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ContextMenuItem'

type ContextMenuItemElement = React.ElementRef<typeof MenuItem>
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuItem>
interface ContextMenuItemProps extends MenuItemProps {}

const ContextMenuItemFrame = styled(MenuItem, {
  name: ITEM_NAME,
})

const ContextMenuItem = ContextMenuItemFrame.styleable<ScopedProps<ContextMenuItemProps>>(
  (props: ScopedProps<ContextMenuItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...itemProps } = props
    return (
      <ContextMenuItemFrame
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        {...itemProps}
        ref={forwardedRef}
      />
    )
  }
)

ContextMenuItem.displayName = ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem'

type ContextMenuCheckboxItemElement = React.ElementRef<typeof MenuCheckboxItem>
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuCheckboxItem>
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

const ContextMenuCheckboxItemFrame = styled(MenuCheckboxItem, {
  name: CHECKBOX_ITEM_NAME,
}) as typeof MenuCheckboxItem
const ContextMenuCheckboxItem = ContextMenuCheckboxItemFrame.styleable<
  ScopedProps<MenuCheckboxItemProps>
>((props: ScopedProps<ContextMenuCheckboxItemProps>, forwardedRef) => {
  const { __scopeContextMenu, ...checkboxItemProps } = props
  return (
    <ContextMenuCheckboxItemFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...checkboxItemProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

const RADIO_GROUP_NAME = 'ContextMenuRadioGroup'

type ContextMenuRadioGroupElement = React.ElementRef<typeof MenuRadioGroup>
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuRadioGroup>
interface ContextMenuRadioGroupProps extends MenuRadioGroupProps {}

const ContextMenuRadioGroupFrame = styled(MenuRadioGroup, {
  name: RADIO_GROUP_NAME,
}) as typeof MenuRadioGroup

const ContextMenuRadioGroup = ContextMenuRadioGroupFrame.styleable<
  ScopedProps<MenuRadioGroupProps>
>((props: ScopedProps<MenuRadioGroupProps>, forwardedRef) => {
  const { __scopeContextMenu, ...radioGroupProps } = props
  return (
    <ContextMenuRadioGroupFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...radioGroupProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuRadioGroup.displayName = RADIO_GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

const RADIO_ITEM_NAME = 'ContextMenuRadioItem'

type ContextMenuRadioItemElement = React.ElementRef<typeof MenuRadioItem>
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuRadioItem>
interface ContextMenuRadioItemProps extends MenuRadioItemProps {}

const MenuRadioItemFrame = styled(MenuRadioItem, {
  name: RADIO_ITEM_NAME,
} as any)

const MenuRadioItemFrameTs = MenuRadioItemFrame as typeof MenuRadioItem

const ContextMenuRadioItem = MenuRadioItemFrame.styleable<
  ScopedProps<MenuRadioItemProps>
>((props: ScopedProps<MenuRadioItemProps>, forwardedRef) => {
  const { __scopeContextMenu, ...radioItemProps } = props
  return (
    <MenuRadioItemFrameTs
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...radioItemProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuRadioItem.displayName = RADIO_ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'ContextMenuItemIndicator'

type ContextMenuItemIndicatorElement = React.ElementRef<typeof MenuItemIndicator>
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuItemIndicator>
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

const MenuItemIndicatorFrame = styled(MenuItemIndicator, {
  name: INDICATOR_NAME,
})

const ContextMenuItemIndicator = MenuItemIndicatorFrame.styleable<
  ScopedProps<ContextMenuItemIndicatorProps>
>((props: ScopedProps<ContextMenuItemIndicatorProps>, forwardedRef) => {
  const { __scopeContextMenu, ...itemIndicatorProps } = props
  return (
    <MenuItemIndicatorFrame
      {...itemIndicatorProps}
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      ref={forwardedRef}
    />
  )
})

ContextMenuItemIndicator.displayName = INDICATOR_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'ContextMenuSeparator'

type ContextMenuSeparatorElement = React.ElementRef<typeof MenuSeparator>
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuSeparator>
interface ContextMenuSeparatorProps extends MenuSeparatorProps {}

const ContextMenuSeparatorFrame = styled(MenuSeparator, {
  name: SEPARATOR_NAME,
})

const ContextMenuSeparator = ContextMenuSeparatorFrame.styleable<
  ScopedProps<ContextMenuSeparatorProps>
>((props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) => {
  const { __scopeContextMenu, ...separatorProps } = props
  return (
    <ContextMenuSeparatorFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...separatorProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuSeparator.displayName = SEPARATOR_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'ContextMenuArrow'

type ContextMenuArrowElement = React.ElementRef<typeof MenuArrow>
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuArrow>
interface ContextMenuArrowProps extends MenuArrowProps {}

const ContextMenuArrowFrame = styled(MenuArrow, {
  name: ARROW_NAME,
})

const ContextMenuArrow = ContextMenuArrowFrame.styleable<
  ScopedProps<ContextMenuArrowProps>
>((props: ScopedProps<ContextMenuArrowProps>, forwardedRef) => {
  const { __scopeContextMenu, ...arrowProps } = props
  return (
    <ContextMenuArrowFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...arrowProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuArrow.displayName = ARROW_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSub
 * -----------------------------------------------------------------------------------------------*/

const SUB_NAME = 'ContextMenuSub'

interface ContextMenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

const ContextMenuSub: React.FC<ScopedProps<ContextMenuSubProps>> = (
  props: ScopedProps<ContextMenuSubProps>
) => {
  const {
    __scopeContextMenu,
    children,
    onOpenChange,
    open: openProp,
    defaultOpen,
  } = props
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen!,
    onChange: onOpenChange,
  })

  return (
    <MenuSub
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      open={open}
      onOpenChange={setOpen}
    >
      {children}
    </MenuSub>
  )
}

ContextMenuSub.displayName = SUB_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

const SUB_TRIGGER_NAME = 'ContextMenuSubTrigger'

type ContextMenuSubTriggerElement = React.ElementRef<typeof MenuSubTrigger>
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuSubTrigger>
interface ContextMenuSubTriggerProps extends MenuSubTriggerProps {}

const ContextMenuSubTriggerFrame = styled(MenuSubTrigger, {
  name: SUB_TRIGGER_NAME,
})

const ContextMenuSubTrigger = ContextMenuSubTriggerFrame.styleable<
  ScopedProps<ContextMenuSubTriggerProps>
>((props: ScopedProps<ContextMenuSubTriggerProps>, forwardedRef) => {
  const { __scopeContextMenu, ...triggerItemProps } = props
  return (
    <ContextMenuSubTriggerFrame
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...triggerItemProps}
      ref={forwardedRef}
    />
  )
})

ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

const SUB_CONTENT_NAME = 'ContextMenuSubContent'

type ContextMenuSubContentElement = React.ElementRef<typeof MenuContent>
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuSubContent>
interface ContextMenuSubContentProps extends MenuSubContentProps {}

const ContextMenuSubContent = React.forwardRef<
  ContextMenuSubContentElement,
  ScopedProps<ContextMenuSubContentProps>
>((props: ScopedProps<ContextMenuSubContentProps>, forwardedRef) => {
  const { __scopeContextMenu, ...subContentProps } = props

  return (
    <MenuSubContent
      __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
      {...subContentProps}
      ref={forwardedRef}
      // TODO: handle native as well
      style={
        isWeb && {
          ...(props.style as Object),
          // re-namespace exposed content custom properties
          ...({
            '--tamagui-context-menu-content-transform-origin':
              'var(--tamagui-popper-transform-origin)',
            '--tamagui-context-menu-content-available-width':
              'var(--tamagui-popper-available-width)',
            '--tamagui-context-menu-content-available-height':
              'var(--tamagui-popper-available-height)',
            '--tamagui-context-menu-trigger-width': 'var(--tamagui-popper-anchor-width)',
            '--tamagui-context-menu-trigger-height':
              'var(--tamagui-popper-anchor-height)',
          } as React.CSSProperties),
        }
      }
    />
  )
})

ContextMenuSubContent.displayName = SUB_CONTENT_NAME

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(
  handler: React.PointerEventHandler<E>
): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined)
}

const Root = ContextMenu
const Trigger = ContextMenuTrigger
const Portal = ContextMenuPortal
const Content = ContextMenuContent
const Group = ContextMenuGroup
const Label = ContextMenuLabel
const Item = ContextMenuItem
const CheckboxItem = ContextMenuCheckboxItem
const RadioGroup = ContextMenuRadioGroup
const RadioItem = ContextMenuRadioItem
const ItemIndicator = ContextMenuItemIndicator
const Separator = ContextMenuSeparator
const Arrow = ContextMenuArrow
const Sub = ContextMenuSub
const SubTrigger = ContextMenuSubTrigger
const SubContent = ContextMenuSubContent

export {
  //
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuItemIndicator,
  ContextMenuSeparator,
  ContextMenuArrow,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  //
  Root,
  Trigger,
  Portal,
  Content,
  Group,
  Label,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  ItemIndicator,
  Separator,
  Arrow,
  Sub,
  SubTrigger,
  SubContent,
}
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuItemIndicatorProps,
  ContextMenuSeparatorProps,
  ContextMenuArrowProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
}
