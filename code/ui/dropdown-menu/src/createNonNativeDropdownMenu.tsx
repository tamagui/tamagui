import { Slot, isAndroid, withStaticProperties } from '@tamagui/core'
import { type MenuProps, type MenuSubProps, createMenu } from '@tamagui/menu'
import type { Menu as MenuTypes } from '@tamagui/menu'
import { useId } from 'react'
import * as React from 'react'
import {
  Button,
  type TamaguiElement,
  YStack,
  composeEventHandlers,
  composeRefs,
  createStyledContext,
  isWeb,
  useControllableState,
} from 'tamagui'

type Direction = 'ltr' | 'rtl'

export const DROPDOWN_MENU_CONTEXT = 'DropdownMenuContext'

/* -------------------------------------------------------------------------------------------------
 * DropdownMenu
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { __scopeDropdownMenu?: string }

type DropdownMenuContextValue = {
  triggerId: string
  triggerRef: React.RefObject<HTMLButtonElement>
  contentId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
}

interface DropdownMenuProps extends MenuProps {
  children?: React.ReactNode
  dir?: Direction
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

// type DropdownMenuTriggerElement = React.ElementRef<typeof Button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Button>
interface DropdownMenuTriggerProps extends PrimitiveButtonProps {
  onKeydown?(event: React.KeyboardEvent): void
}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Portal>
interface DropdownMenuPortalProps extends MenuPortalProps {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuContent
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuContentElement = React.ElementRef<typeof MenuTypes.Content>
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Content>
interface DropdownMenuContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuGroup
 * -----------------------------------------------------------------------------------------------*/

type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Group>
type DropdownMenuGroupProps = MenuGroupProps & {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuLabel
 * -----------------------------------------------------------------------------------------------*/

type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Label>
type DropdownMenuLabelProps = MenuLabelProps & {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuItem
 * -----------------------------------------------------------------------------------------------*/

type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Item>
interface DropdownMenuItemProps extends MenuItemProps {}

type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.CheckboxItem>

interface DropdownMenuCheckboxItemProps extends MenuCheckboxItemProps {}

type DropdownMenuRadioGroupElement = React.ElementRef<typeof MenuTypes.RadioGroup>
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioGroup>
interface DropdownMenuRadioGroupProps extends MenuRadioGroupProps {}

type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioItem>
interface DropdownMenuRadioItemProps extends MenuRadioItemProps {}

type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<
  typeof MenuTypes.ItemIndicator
>
interface DropdownMenuItemIndicatorProps extends MenuItemIndicatorProps {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Separator>

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuArrow
 * -----------------------------------------------------------------------------------------------*/

type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Arrow>
type DropdownMenuArrowProps = MenuArrowProps & {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSub
 * -----------------------------------------------------------------------------------------------*/

interface DropdownMenuSubProps extends MenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubTrigger>
interface DropdownMenuSubTriggerProps extends MenuSubTriggerProps {}

/* -------------------------------------------------------------------------------------------------
 * DropdownMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

type DropdownMenuSubContentElement = React.ElementRef<typeof MenuTypes.Content>
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubContent>
interface DropdownMenuSubContentProps extends MenuSubContentProps {}

/* -----------------------------------------------------------------------------------------------*/

export function createNonNativeDropdownMenu(params: Parameters<typeof createMenu>[0]) {
  const { Menu } = createMenu(params)
  /* -------------------------------------------------------------------------------------------------
   * DropdownMenu
   * -----------------------------------------------------------------------------------------------*/

  const DROPDOWN_MENU_NAME = 'DropdownMenu'

  const { Provider: DropdownMenuProvider, useStyledContext: useDropdownMenuContext } =
    createStyledContext<DropdownMenuContextValue>()

  const DropdownMenuComp = (props: ScopedProps<DropdownMenuProps>) => {
    const {
      __scopeDropdownMenu,
      children,
      dir,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = true,
      ...rest
    } = props
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })

    return (
      <DropdownMenuProvider
        scope={__scopeDropdownMenu}
        triggerId={useId()}
        triggerRef={triggerRef}
        contentId={useId()}
        open={open}
        onOpenChange={setOpen}
        onOpenToggle={React.useCallback(
          () => setOpen((prevOpen) => !prevOpen),
          [setOpen]
        )}
        modal={modal}
      >
        <Menu
          __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
          open={open}
          onOpenChange={setOpen}
          dir={dir}
          modal={modal}
          {...rest}
        >
          {children}
        </Menu>
      </DropdownMenuProvider>
    )
  }

  DropdownMenuComp.displayName = DROPDOWN_MENU_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuTrigger
   * -----------------------------------------------------------------------------------------------*/

  const TRIGGER_NAME = 'DropdownMenuTrigger'

  const DropdownMenuTriggerFrame = Menu.Anchor

  const DropdownMenuTrigger = YStack.styleable<ScopedProps<DropdownMenuTriggerProps>>(
    (props, forwardedRef) => {
      const {
        __scopeDropdownMenu,
        asChild,
        children,
        disabled = false,
        onKeydown,
        ...triggerProps
      } = props
      const context = useDropdownMenuContext(__scopeDropdownMenu)
      const Comp = asChild ? Slot : Button
      return (
        <DropdownMenuTriggerFrame
          asChild
          componentName={TRIGGER_NAME}
          __scopePopper={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        >
          <Comp
            tag="button"
            id={context.triggerId}
            aria-haspopup="menu"
            aria-expanded={context.open}
            aria-controls={context.open ? context.contentId : undefined}
            data-state={context.open ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            disabled={disabled}
            ref={composeRefs(forwardedRef, context.triggerRef)}
            {...{
              [isWeb ? 'onPointerDown' : 'onPress']: composeEventHandlers(
                //@ts-ignore
                props[isWeb ? 'onPointerDown' : 'onPress'],
                (event) => {
                  // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
                  // but not when the control key is pressed (avoiding MacOS right click)
                  if (!disabled) {
                    if (
                      isWeb &&
                      event instanceof PointerEvent &&
                      event.button !== 0 &&
                      event.ctrlKey === true
                    )
                      return
                    context.onOpenToggle()
                    // prevent trigger focusing when opening
                    // this allows the content to be given focus without competition
                    if (!context.open) event.preventDefault()
                  }
                }
              ),
            }}
            {...(isWeb && {
              onKeyDown: composeEventHandlers(onKeydown, (event) => {
                if (disabled) return
                if (['Enter', ' '].includes(event.key)) context.onOpenToggle()
                if (event.key === 'ArrowDown') context.onOpenChange(true)
                // prevent keydown from scrolling window / first focused item to execute
                // that keydown (inadvertently closing the menu)
                if (['Enter', ' ', 'ArrowDown'].includes(event.key))
                  event.preventDefault()
              }),
            })}
            {...triggerProps}
          >
            {children}
          </Comp>
        </DropdownMenuTriggerFrame>
      )
    }
  )

  DropdownMenuTrigger.displayName = TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuPortal
   * -----------------------------------------------------------------------------------------------*/

  const PORTAL_NAME = 'DropdownMenuPortal'

  const DropdownMenuPortal = (props: ScopedProps<DropdownMenuPortalProps>) => {
    const { __scopeDropdownMenu, children, ...portalProps } = props

    const context = isAndroid ? useDropdownMenuContext(__scopeDropdownMenu) : null

    const content = isAndroid ? (
      <DropdownMenuProvider {...context}>{children}</DropdownMenuProvider>
    ) : (
      children
    )
    return (
      <Menu.Portal
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...portalProps}
      >
        {children}
      </Menu.Portal>
    )
  }

  DropdownMenuPortal.displayName = PORTAL_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuContent
   * -----------------------------------------------------------------------------------------------*/

  const CONTENT_NAME = 'DropdownMenuContent'

  const DropdownMenuContent = React.forwardRef<
    DropdownMenuContentElement,
    ScopedProps<DropdownMenuContentProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...contentProps } = props
    const context = useDropdownMenuContext(__scopeDropdownMenu)
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <Menu.Content
        id={context.contentId}
        aria-labelledby={context.triggerId}
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...contentProps}
        ref={forwardedRef}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus()
          hasInteractedOutsideRef.current = false
          // Always prevent auto focus because we either focus manually or want user agent focus
          event.preventDefault()
        })}
        onInteractOutside={composeEventHandlers(props.onInteractOutside, (event) => {
          const originalEvent = event.detail.originalEvent as PointerEvent
          const ctrlLeftClick =
            originalEvent.button === 0 && originalEvent.ctrlKey === true
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick
          if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true
        })}
        {...(props.style as Object)}
      />
    )
  })

  DropdownMenuContent.displayName = CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuGroup
   * -----------------------------------------------------------------------------------------------*/

  const GROUP_NAME = 'DropdownMenuGroup'

  const DropdownMenuGroup = Menu.Group

  DropdownMenuGroup.displayName = GROUP_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuLabel
   * -----------------------------------------------------------------------------------------------*/

  const LABEL_NAME = 'DropdownMenuLabel'

  const DropdownMenuLabel = Menu.Label

  DropdownMenuLabel.displayName = LABEL_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuItem
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_NAME = 'DropdownMenuItem'

  const DropdownMenuItemFrame = Menu.Item

  const DropdownMenuItem = DropdownMenuItemFrame.styleable<
    ScopedProps<DropdownMenuItemProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemProps } = props
    return (
      <DropdownMenuItemFrame
        componentName={ITEM_NAME}
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...itemProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuItem.displayName = ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuItemTitle
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_TITLE_NAME = 'DropdownMenuItemTitle'
  const DropdownMenuItemTitle = Menu.ItemTitle
  DropdownMenuItemTitle.displayName = ITEM_TITLE_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuItemSubTitle
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_SUB_TITLE_NAME = 'DropdownMenuItemSubTitle'
  const DropdownMenuItemSubTitle = Menu.ItemSubtitle
  DropdownMenuItemSubTitle.displayName = ITEM_SUB_TITLE_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuItemImage
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_IMAGE_NAME = 'DropdownMenuItemImage'
  const DropdownMenuItemImage = Menu.ItemImage
  DropdownMenuItemImage.displayName = ITEM_IMAGE_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuItemIcon
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_ICON_NAME = 'DropdownMenuItemIcon'
  const DropdownMenuItemIcon = Menu.ItemIcon
  DropdownMenuItemIcon.displayName = ITEM_ICON_NAME
  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuCheckboxItem
   * -----------------------------------------------------------------------------------------------*/

  const CHECKBOX_ITEM_NAME = 'DropdownMenuCheckboxItem'

  const DropdownMenuCheckboxItemFrame = Menu.CheckboxItem

  const DropdownMenuCheckboxItem = DropdownMenuCheckboxItemFrame.styleable<
    ScopedProps<DropdownMenuCheckboxItemProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...checkboxItemProps } = props
    return (
      <DropdownMenuCheckboxItemFrame
        componentName={CHECKBOX_ITEM_NAME}
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...checkboxItemProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuRadioGroup
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_GROUP_NAME = 'DropdownMenuRadioGroup'

  const DropdownMenuRadioGroup = React.forwardRef<
    DropdownMenuRadioGroupElement,
    ScopedProps<DropdownMenuRadioGroupProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioGroupProps } = props
    return (
      <Menu.RadioGroup
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...radioGroupProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuRadioItem
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_ITEM_NAME = 'DropdownMenuRadioItem'

  const DropdownMenuRadioItemFrame = Menu.RadioItem

  const DropdownMenuRadioItem = DropdownMenuRadioItemFrame.styleable<
    ScopedProps<DropdownMenuRadioItemProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioItemProps } = props
    return (
      // @ts-ignore explanation: deeply nested types typescript limitation
      <DropdownMenuRadioItemFrame
        componentName={RADIO_ITEM_NAME}
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...radioItemProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuItemIndicator
   * -----------------------------------------------------------------------------------------------*/

  const INDICATOR_NAME = 'DropdownMenuItemIndicator'

  const DropdownMenuItemIndicatorFrame = Menu.ItemIndicator

  const DropdownMenuItemIndicator = DropdownMenuItemIndicatorFrame.styleable<
    ScopedProps<DropdownMenuItemIndicatorProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemIndicatorProps } = props
    return (
      <DropdownMenuItemIndicatorFrame
        componentName={INDICATOR_NAME}
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...itemIndicatorProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuItemIndicator.displayName = INDICATOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuSeparator
   * -----------------------------------------------------------------------------------------------*/

  const SEPARATOR_NAME = 'DropdownMenuSeparator'

  const DropdownMenuSeparator = Menu.Separator

  DropdownMenuSeparator.displayName = SEPARATOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuArrow
   * -----------------------------------------------------------------------------------------------*/

  const ARROW_NAME = 'DropdownMenuArrow'

  const DropdownMenuArrow = React.forwardRef<
    TamaguiElement,
    ScopedProps<DropdownMenuArrowProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...arrowProps } = props
    return (
      <Menu.Arrow
        componentName={ARROW_NAME}
        __scopePopper={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...arrowProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuArrow.displayName = ARROW_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuSub
   * -----------------------------------------------------------------------------------------------*/

  const DROPDOWN_MENU_SUB_NAME = 'DropdownMenuSub'
  const DropdownMenuSub = (props: ScopedProps<DropdownMenuSubProps>) => {
    const {
      __scopeDropdownMenu,
      children,
      open: openProp,
      onOpenChange,
      defaultOpen,
      ...rest
    } = props
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })

    return (
      <Menu.Sub
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        open={open}
        onOpenChange={setOpen}
        {...rest}
      >
        {children}
      </Menu.Sub>
    )
  }

  DropdownMenuSub.displayName = DROPDOWN_MENU_SUB_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuSubTrigger
   * -----------------------------------------------------------------------------------------------*/

  const SUB_TRIGGER_NAME = 'DropdownMenuSubTrigger'

  const DropdownMenuSubTrigger = YStack.styleable<
    ScopedProps<DropdownMenuSubTriggerProps>
  >((props, forwardedRef) => {
    // TODO: having asChild will create a problem, find a fix for that
    const { __scopeDropdownMenu, asChild, ...subTriggerProps } = props
    return (
      <Menu.SubTrigger
        componentName={SUB_TRIGGER_NAME}
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...subTriggerProps}
        ref={forwardedRef}
      />
    )
  })

  DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * DropdownMenuSubContent
   * -----------------------------------------------------------------------------------------------*/

  const SUB_CONTENT_NAME = 'DropdownMenuSubContent'

  const DropdownMenuSubContent = React.forwardRef<
    DropdownMenuSubContentElement,
    ScopedProps<DropdownMenuSubContentProps>
  >((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...subContentProps } = props

    return (
      <Menu.SubContent
        __scopeMenu={__scopeDropdownMenu || DROPDOWN_MENU_CONTEXT}
        {...subContentProps}
        ref={forwardedRef}
        style={
          isWeb
            ? {
                ...(props.style as Object),
                // re-namespace exposed content custom properties
                // TODO: find a better way to do this, or maybe not do it at all
                ...({
                  '--tamagui-dropdown-menu-content-transform-origin':
                    'var(--tamagui-popper-transform-origin)',
                  '--tamagui-dropdown-menu-content-available-width':
                    'var(--tamagui-popper-available-width)',
                  '--tamagui-dropdown-menu-content-available-height':
                    'var(--tamagui-popper-available-height)',
                  '--tamagui-dropdown-menu-trigger-width':
                    'var(--tamagui-popper-anchor-width)',
                  '--tamagui-dropdown-menu-trigger-height':
                    'var(--tamagui-popper-anchor-height)',
                } as React.CSSProperties),
              }
            : null
        }
      />
    )
  })

  DropdownMenuSubContent.displayName = SUB_CONTENT_NAME

  /* -----------------------------------------------------------------------------------------------*/

  const Root = DropdownMenuComp
  const Trigger = DropdownMenuTrigger
  const Portal = DropdownMenuPortal
  const Content = DropdownMenuContent
  const Group = DropdownMenuGroup
  const Label = DropdownMenuLabel
  const Item = DropdownMenuItem
  const CheckboxItem = DropdownMenuCheckboxItem
  const RadioGroup = DropdownMenuRadioGroup
  const RadioItem = DropdownMenuRadioItem
  const ItemIndicator = DropdownMenuItemIndicator
  const Separator = DropdownMenuSeparator
  const Arrow = DropdownMenuArrow
  const Sub = DropdownMenuSub
  const SubTrigger = DropdownMenuSubTrigger
  const SubContent = DropdownMenuSubContent
  const ItemTitle = DropdownMenuItemTitle
  const ItemSubtitle = DropdownMenuItemSubTitle
  const ItemImage = DropdownMenuItemImage
  const ItemIcon = DropdownMenuItemIcon

  const DropdownMenu = withStaticProperties(DropdownMenuComp, {
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
    ItemTitle,
    ItemSubtitle,
    ItemImage,
    ItemIcon,
  })

  return DropdownMenu
}

export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuPortalProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuItemIndicatorProps,
  DropdownMenuArrowProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
}
