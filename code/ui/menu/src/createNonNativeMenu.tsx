import type BaseMenuTypes from '@tamagui/create-menu'
import type { CreateBaseMenuProps } from '@tamagui/create-menu'
import { useControllableState } from '@tamagui/use-controllable-state'
import {
  Slot,
  type TamaguiElement,
  View,
  type ViewProps,
  composeEventHandlers,
  composeRefs,
  createStyledContext,
  isAndroid,
  isWeb,
  withStaticProperties,
} from '@tamagui/web'
import * as React from 'react'
import { useId } from 'react'

type Direction = 'ltr' | 'rtl'

export const DROPDOWN_MENU_CONTEXT = 'MenuContext'

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { scope?: string }

type MenuContextValue = {
  triggerId: string
  triggerRef: React.RefObject<HTMLButtonElement>
  contentId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
}

interface MenuProps extends BaseMenuTypes.MenuProps {
  children?: React.ReactNode
  dir?: Direction
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * MenuTrigger
 * -----------------------------------------------------------------------------------------------*/

interface MenuTriggerProps extends ViewProps {
  onKeydown?(event: React.KeyboardEvent): void
}

/* -------------------------------------------------------------------------------------------------
 * MenuPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof BaseMenuTypes.Portal>
interface MenuPortalProps extends MenuPortalProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuContent
 * -----------------------------------------------------------------------------------------------*/

type MenuContentElement = React.ElementRef<typeof MenuTypes.Content>
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Content>
interface MenuContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {}

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Group>
type MenuGroupProps = MenuGroupProps & {}

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Label>
type MenuLabelProps = MenuLabelProps & {}

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Item>
interface MenuItemProps extends MenuItemProps {}

type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.CheckboxItem>

interface MenuCheckboxItemProps extends MenuCheckboxItemProps {}

type MenuRadioGroupElement = React.ElementRef<typeof MenuTypes.RadioGroup>
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioGroup>
interface MenuRadioGroupProps extends MenuRadioGroupProps {}

type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuTypes.RadioItem>
interface MenuRadioItemProps extends MenuRadioItemProps {}

type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<
  typeof MenuTypes.ItemIndicator
>
interface MenuItemIndicatorProps extends MenuItemIndicatorProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Separator>

/* -------------------------------------------------------------------------------------------------
 * MenuArrow
 * -----------------------------------------------------------------------------------------------*/

type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuTypes.Arrow>
type MenuArrowProps = MenuArrowProps & {}

/* -------------------------------------------------------------------------------------------------
 * MenuSub
 * -----------------------------------------------------------------------------------------------*/

interface MenuSubProps extends MenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

/* -------------------------------------------------------------------------------------------------
 * MenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubTrigger>
interface MenuSubTriggerProps extends MenuSubTriggerProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuSubContent
 * -----------------------------------------------------------------------------------------------*/

type MenuSubContentElement = React.ElementRef<typeof MenuTypes.Content>
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuTypes.SubContent>
interface MenuSubContentProps extends MenuSubContentProps {}

/* -----------------------------------------------------------------------------------------------*/

export function createNonNativeMenu(params: CreateBaseMenuProps) {
  const { Menu } = createBaseMenu(params)

  /* -------------------------------------------------------------------------------------------------
   * Menu
   * -----------------------------------------------------------------------------------------------*/

  const DROPDOWN_MENU_NAME = 'Menu'

  const { Provider: MenuProvider, useStyledContext: useMenuContext } =
    createStyledContext<MenuContextValue>()

  const MenuComp = (props: ScopedProps<MenuProps>) => {
    const {
      scope,
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
      <MenuProvider
        scope={scope}
        triggerId={useId()}
        // TODO
        triggerRef={triggerRef as any}
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
          scope={scope || DROPDOWN_MENU_CONTEXT}
          open={open}
          onOpenChange={setOpen}
          dir={dir}
          modal={modal}
          {...rest}
        >
          {children}
        </Menu>
      </MenuProvider>
    )
  }

  MenuComp.displayName = DROPDOWN_MENU_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuTrigger
   * -----------------------------------------------------------------------------------------------*/

  const TRIGGER_NAME = 'MenuTrigger'

  const MenuTriggerFrame = Menu.Anchor

  const MenuTrigger = View.styleable<ScopedProps<MenuTriggerProps>>(
    (props, forwardedRef) => {
      const {
        scope,
        asChild,
        children,
        disabled = false,
        onKeydown,
        ...triggerProps
      } = props
      const context = useMenuContext(scope)
      const Comp = asChild ? Slot : View
      return (
        <MenuTriggerFrame
          asChild
          componentName={TRIGGER_NAME}
          scope={scope || DROPDOWN_MENU_CONTEXT}
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
        </MenuTriggerFrame>
      )
    }
  )

  MenuTrigger.displayName = TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuPortal
   * -----------------------------------------------------------------------------------------------*/

  const PORTAL_NAME = 'MenuPortal'

  const MenuPortal = (props: ScopedProps<MenuPortalProps>) => {
    const { scope, children, ...portalProps } = props

    const context = isAndroid ? useMenuContext(scope) : null

    const content = isAndroid ? (
      <MenuProvider {...context}>{children}</MenuProvider>
    ) : (
      children
    )
    return (
      <Menu.Portal scope={scope || DROPDOWN_MENU_CONTEXT} {...portalProps}>
        {content}
      </Menu.Portal>
    )
  }

  MenuPortal.displayName = PORTAL_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuContent
   * -----------------------------------------------------------------------------------------------*/

  const CONTENT_NAME = 'MenuContent'

  const MenuContent = React.forwardRef<MenuContentElement, ScopedProps<MenuContentProps>>(
    (props, forwardedRef) => {
      const { scope, ...contentProps } = props
      const context = useMenuContext(scope)
      const hasInteractedOutsideRef = React.useRef(false)

      return (
        <Menu.Content
          id={context.contentId}
          aria-labelledby={context.triggerId}
          scope={scope || DROPDOWN_MENU_CONTEXT}
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
    }
  )

  MenuContent.displayName = CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuGroup
   * -----------------------------------------------------------------------------------------------*/

  const GROUP_NAME = 'MenuGroup'

  const MenuGroup = Menu.Group

  MenuGroup.displayName = GROUP_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuLabel
   * -----------------------------------------------------------------------------------------------*/

  const LABEL_NAME = 'MenuLabel'

  const MenuLabel = Menu.Label

  MenuLabel.displayName = LABEL_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItem
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_NAME = 'MenuItem'

  const MenuItemFrame = Menu.Item

  const MenuItem = MenuItemFrame.styleable<ScopedProps<MenuItemProps>>(
    (props, forwardedRef) => {
      const { scope, ...itemProps } = props
      return (
        <MenuItemFrame
          componentName={ITEM_NAME}
          scope={scope || DROPDOWN_MENU_CONTEXT}
          {...itemProps}
          ref={forwardedRef}
        />
      )
    }
  )

  MenuItem.displayName = ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemTitle
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_TITLE_NAME = 'MenuItemTitle'
  const MenuItemTitle = Menu.ItemTitle
  MenuItemTitle.displayName = ITEM_TITLE_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemSubTitle
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_SUB_TITLE_NAME = 'MenuItemSubTitle'
  const MenuItemSubTitle = Menu.ItemSubtitle
  MenuItemSubTitle.displayName = ITEM_SUB_TITLE_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemImage
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_IMAGE_NAME = 'MenuItemImage'
  const MenuItemImage = Menu.ItemImage
  MenuItemImage.displayName = ITEM_IMAGE_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemIcon
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_ICON_NAME = 'MenuItemIcon'
  const MenuItemIcon = Menu.ItemIcon
  MenuItemIcon.displayName = ITEM_ICON_NAME
  /* -------------------------------------------------------------------------------------------------
   * MenuCheckboxItem
   * -----------------------------------------------------------------------------------------------*/

  const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem'

  const MenuCheckboxItemFrame = Menu.CheckboxItem

  const MenuCheckboxItem = MenuCheckboxItemFrame.styleable<
    ScopedProps<MenuCheckboxItemProps>
  >((props, forwardedRef) => {
    const { scope, ...checkboxItemProps } = props
    return (
      <MenuCheckboxItemFrame
        componentName={CHECKBOX_ITEM_NAME}
        scope={scope || DROPDOWN_MENU_CONTEXT}
        {...checkboxItemProps}
        ref={forwardedRef}
      />
    )
  })

  MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuRadioGroup
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_GROUP_NAME = 'MenuRadioGroup'

  const MenuRadioGroup = React.forwardRef<
    MenuRadioGroupElement,
    ScopedProps<MenuRadioGroupProps>
  >((props, forwardedRef) => {
    const { scope, ...radioGroupProps } = props
    return (
      <Menu.RadioGroup
        scope={scope || DROPDOWN_MENU_CONTEXT}
        {...radioGroupProps}
        ref={forwardedRef}
      />
    )
  })

  MenuRadioGroup.displayName = RADIO_GROUP_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuRadioItem
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_ITEM_NAME = 'MenuRadioItem'

  const MenuRadioItemFrame = Menu.RadioItem

  const MenuRadioItem = MenuRadioItemFrame.styleable<ScopedProps<MenuRadioItemProps>>(
    (props, forwardedRef) => {
      const { scope, ...radioItemProps } = props
      return (
        // @ts-ignore explanation: deeply nested types typescript limitation
        <MenuRadioItemFrame
          componentName={RADIO_ITEM_NAME}
          scope={scope || DROPDOWN_MENU_CONTEXT}
          {...radioItemProps}
          ref={forwardedRef}
        />
      )
    }
  )

  MenuRadioItem.displayName = RADIO_ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemIndicator
   * -----------------------------------------------------------------------------------------------*/

  const INDICATOR_NAME = 'MenuItemIndicator'

  const MenuItemIndicatorFrame = Menu.ItemIndicator

  const MenuItemIndicator = MenuItemIndicatorFrame.styleable<
    ScopedProps<MenuItemIndicatorProps>
  >((props, forwardedRef) => {
    const { scope, ...itemIndicatorProps } = props
    return (
      <MenuItemIndicatorFrame
        componentName={INDICATOR_NAME}
        scope={scope || DROPDOWN_MENU_CONTEXT}
        {...itemIndicatorProps}
        ref={forwardedRef}
      />
    )
  })

  MenuItemIndicator.displayName = INDICATOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuSeparator
   * -----------------------------------------------------------------------------------------------*/

  const SEPARATOR_NAME = 'MenuSeparator'

  const MenuSeparator = Menu.Separator

  MenuSeparator.displayName = SEPARATOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuArrow
   * -----------------------------------------------------------------------------------------------*/

  const ARROW_NAME = 'MenuArrow'

  const MenuArrow = React.forwardRef<TamaguiElement, ScopedProps<MenuArrowProps>>(
    (props, forwardedRef) => {
      const { scope, ...arrowProps } = props
      return (
        <Menu.Arrow
          componentName={ARROW_NAME}
          scope={scope || DROPDOWN_MENU_CONTEXT}
          {...arrowProps}
          ref={forwardedRef}
        />
      )
    }
  )

  MenuArrow.displayName = ARROW_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuSub
   * -----------------------------------------------------------------------------------------------*/

  const DROPDOWN_MENU_SUB_NAME = 'MenuSub'
  const MenuSub = (props: ScopedProps<MenuSubProps>) => {
    const { scope, children, open: openProp, onOpenChange, defaultOpen, ...rest } = props
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })

    return (
      <Menu.Sub
        scope={scope || DROPDOWN_MENU_CONTEXT}
        open={open}
        onOpenChange={setOpen}
        {...rest}
      >
        {children}
      </Menu.Sub>
    )
  }

  MenuSub.displayName = DROPDOWN_MENU_SUB_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuSubTrigger
   * -----------------------------------------------------------------------------------------------*/

  const SUB_TRIGGER_NAME = 'MenuSubTrigger'

  const MenuSubTrigger = View.styleable<ScopedProps<MenuSubTriggerProps>>(
    (props, forwardedRef) => {
      // TODO: having asChild will create a problem, find a fix for that
      const { scope, asChild, ...subTriggerProps } = props
      return (
        <Menu.SubTrigger
          componentName={SUB_TRIGGER_NAME}
          scope={scope || DROPDOWN_MENU_CONTEXT}
          {...subTriggerProps}
          ref={forwardedRef}
        />
      )
    }
  )

  MenuSubTrigger.displayName = SUB_TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuSubContent
   * -----------------------------------------------------------------------------------------------*/

  const SUB_CONTENT_NAME = 'MenuSubContent'

  const MenuSubContent = React.forwardRef<
    MenuSubContentElement,
    ScopedProps<MenuSubContentProps>
  >((props, forwardedRef) => {
    const { scope, ...subContentProps } = props

    return (
      <Menu.SubContent
        scope={scope || DROPDOWN_MENU_CONTEXT}
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

  MenuSubContent.displayName = SUB_CONTENT_NAME

  /* -----------------------------------------------------------------------------------------------*/

  const Root = MenuComp
  const Trigger = MenuTrigger
  const Portal = MenuPortal
  const Content = MenuContent
  const Group = MenuGroup
  const Label = MenuLabel
  const Item = MenuItem
  const CheckboxItem = MenuCheckboxItem
  const RadioGroup = MenuRadioGroup
  const RadioItem = MenuRadioItem
  const ItemIndicator = MenuItemIndicator
  const Separator = MenuSeparator
  const Arrow = MenuArrow
  const Sub = MenuSub
  const SubTrigger = MenuSubTrigger
  const SubContent = MenuSubContent
  const ItemTitle = MenuItemTitle
  const ItemSubtitle = MenuItemSubTitle
  const ItemImage = MenuItemImage
  const ItemIcon = MenuItemIcon

  return withStaticProperties(MenuComp, {
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
}

export type {
  MenuArrowProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuGroupProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuLabelProps,
  MenuPortalProps,
  MenuProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuTriggerProps,
}
