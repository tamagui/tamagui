import type * as BaseMenuTypes from '@tamagui/create-menu'
import {
  type MenuArrowProps as BaseMenuArrowProps,
  type MenuCheckboxItemProps as BaseMenuCheckboxItemProps,
  type MenuContentProps as BaseMenuContentProps,
  type MenuGroupProps as BaseMenuGroupProps,
  type MenuItemIndicatorProps as BaseMenuItemIndicatorProps,
  type MenuItemProps as BaseMenuItemProps,
  type MenuLabelProps as BaseMenuLabelProps,
  type MenuPortalProps as BaseMenuPortalProps,
  type MenuRadioGroupProps as BaseMenuRadioGroupProps,
  type MenuRadioItemProps as BaseMenuRadioItemProps,
  type MenuSeparatorProps as BaseMenuSeparatorProps,
  type MenuSubContentProps as BaseMenuSubContentProps,
  type MenuSubTriggerProps as BaseMenuSubTriggerProps,
  createBaseMenu,
  type CreateBaseMenuProps,
} from '@tamagui/create-menu'
import { ScrollView, type ScrollViewProps } from '@tamagui/scroll-view'
import { useControllableState } from '@tamagui/use-controllable-state'
import {
  composeEventHandlers,
  composeRefs,
  createStyledContext,
  isAndroid,
  isWeb,
  Slot,
  styled,
  type TamaguiElement,
  useIsTouchDevice,
  View,
  type ViewProps,
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
  triggerRef: React.RefObject<TamaguiElement | null>
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

type MenuPortalProps = BaseMenuPortalProps

/* -------------------------------------------------------------------------------------------------
 * MenuContent
 * -----------------------------------------------------------------------------------------------*/

type MenuContentElement = TamaguiElement
interface MenuContentProps extends Omit<BaseMenuContentProps, 'onEntryFocus'> {}

/* -------------------------------------------------------------------------------------------------
 * MenuGroup
 * -----------------------------------------------------------------------------------------------*/

type MenuGroupProps = BaseMenuGroupProps

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

type MenuLabelProps = BaseMenuLabelProps

/* -------------------------------------------------------------------------------------------------
 * MenuItem
 * -----------------------------------------------------------------------------------------------*/

type MenuItemProps = BaseMenuItemProps

type MenuCheckboxItemProps = BaseMenuCheckboxItemProps

type MenuRadioGroupElement = TamaguiElement
type MenuRadioGroupProps = BaseMenuRadioGroupProps
type MenuRadioItemProps = BaseMenuRadioItemProps
type MenuItemIndicatorProps = BaseMenuItemIndicatorProps

/* -------------------------------------------------------------------------------------------------
 * MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

type MenuSeparatorProps = BaseMenuSeparatorProps

/* -------------------------------------------------------------------------------------------------
 * MenuArrow
 * -----------------------------------------------------------------------------------------------*/

type MenuArrowProps = BaseMenuArrowProps

/* -------------------------------------------------------------------------------------------------
 * MenuSub
 * -----------------------------------------------------------------------------------------------*/

type MenuSubProps = BaseMenuTypes.MenuSubProps & {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

/* -------------------------------------------------------------------------------------------------
 * MenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type MenuSubTriggerProps = BaseMenuSubTriggerProps

/* -------------------------------------------------------------------------------------------------
 * MenuSubContent
 * -----------------------------------------------------------------------------------------------*/

type MenuSubContentElement = TamaguiElement
type MenuSubContentProps = BaseMenuSubContentProps

/* -------------------------------------------------------------------------------------------------
 * MenuScrollView
 * -----------------------------------------------------------------------------------------------*/

type MenuScrollViewProps = ScrollViewProps

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
    const triggerRef = React.useRef<TamaguiElement>(null)
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })

    return (
      <MenuProvider
        scope={scope}
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
      const isTouchDevice = useIsTouchDevice()

      // Use onClick for touch devices to avoid race condition with Dismissable
      // Use onPointerDown for mouse for faster feedback
      const pressEvent = isWeb ? (isTouchDevice ? 'onClick' : 'onPointerDown') : 'onPress'

      return (
        <MenuTriggerFrame
          asChild
          componentName={TRIGGER_NAME}
          scope={scope || DROPDOWN_MENU_CONTEXT}
        >
          <Comp
            role="button"
            id={context.triggerId}
            aria-haspopup="menu"
            aria-expanded={context.open}
            aria-controls={context.open ? context.contentId : undefined}
            data-state={context.open ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            aria-disabled={disabled || undefined}
            ref={composeRefs(forwardedRef, context.triggerRef)}
            {...{
              [pressEvent]: composeEventHandlers(
                //@ts-ignore
                props[pressEvent],
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
            if (!hasInteractedOutsideRef.current) {
              // check if something else already has focus
              const activeEl = document.activeElement
              if (!activeEl || activeEl === document.body) {
                context.triggerRef.current?.focus()
              }
            }
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
          style={
            isWeb
              ? {
                  ...(props.style as object),
                  ...({
                    '--tamagui-menu-content-transform-origin':
                      'var(--tamagui-popper-transform-origin)',
                    '--tamagui-menu-content-available-width':
                      'var(--tamagui-popper-available-width)',
                    '--tamagui-menu-content-available-height':
                      'var(--tamagui-popper-available-height)',
                    '--tamagui-menu-trigger-width': 'var(--tamagui-popper-anchor-width)',
                    '--tamagui-menu-trigger-height':
                      'var(--tamagui-popper-anchor-height)',
                  } as React.CSSProperties),
                }
              : props.style
          }
        />
      )
    }
  )

  MenuContent.displayName = CONTENT_NAME

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
                ...(props.style as object),
                ...({
                  '--tamagui-menu-content-transform-origin':
                    'var(--tamagui-popper-transform-origin)',
                  '--tamagui-menu-content-available-width':
                    'var(--tamagui-popper-available-width)',
                  '--tamagui-menu-content-available-height':
                    'var(--tamagui-popper-available-height)',
                  '--tamagui-menu-trigger-width': 'var(--tamagui-popper-anchor-width)',
                  '--tamagui-menu-trigger-height': 'var(--tamagui-popper-anchor-height)',
                } as React.CSSProperties),
              }
            : null
        }
      />
    )
  })

  MenuSubContent.displayName = SUB_CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuScrollView
   * -----------------------------------------------------------------------------------------------*/

  const MenuScrollView = styled(ScrollView, {
    flexShrink: 1,
    alignSelf: 'stretch',
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,

    '$platform-web': {
      maxHeight: 'var(--tamagui-menu-content-available-height)',
    },
  })

  /* -----------------------------------------------------------------------------------------------*/

  // direct pass-through from base menu (preserves styleable)
  const Group = Menu.Group
  const Label = Menu.Label
  const Item = Menu.Item
  const CheckboxItem = Menu.CheckboxItem
  const RadioGroup = Menu.RadioGroup
  const RadioItem = Menu.RadioItem
  const ItemIndicator = Menu.ItemIndicator
  const Separator = Menu.Separator
  const Arrow = Menu.Arrow
  const SubTrigger = Menu.SubTrigger
  const ItemTitle = Menu.ItemTitle
  const ItemSubtitle = Menu.ItemSubtitle
  const ItemImage = Menu.ItemImage
  const ItemIcon = Menu.ItemIcon

  return withStaticProperties(MenuComp, {
    Root: MenuComp,
    Trigger: MenuTrigger,
    Portal: MenuPortal,
    Content: MenuContent,
    Group,
    Label,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    ItemIndicator,
    Separator,
    Arrow,
    Sub: MenuSub,
    SubTrigger,
    SubContent: MenuSubContent,
    ItemTitle,
    ItemSubtitle,
    ItemImage,
    ItemIcon,
    ScrollView: MenuScrollView,
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
  MenuScrollViewProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
  MenuTriggerProps,
}
