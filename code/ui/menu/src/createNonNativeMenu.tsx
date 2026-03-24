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
import { usePopperContextSlow } from '@tamagui/popper'
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
  useEvent,
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

type MenuTriggerStateSetter = React.Dispatch<React.SetStateAction<boolean>>

type MenuContextValue = {
  triggerId: string
  triggerRef: React.RefObject<TamaguiElement | null>
  contentId: string
  openRef: React.RefObject<boolean>
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
  setActiveTrigger(id: string | null): void
  registerTrigger(id: string, setOpen: MenuTriggerStateSetter): void
  unregisterTrigger(id: string): void
}

function useMenuTriggerSetup(open: boolean) {
  const triggerStateSettersRef = React.useRef(new Map<string, MenuTriggerStateSetter>())
  const activeTriggerIdRef = React.useRef<string | null>(null)

  const setActiveTrigger = useEvent((id: string | null) => {
    const prevId = activeTriggerIdRef.current
    if (prevId === id) return
    if (prevId) {
      triggerStateSettersRef.current.get(prevId)?.(false)
    }
    activeTriggerIdRef.current = id
    if (id && open) {
      triggerStateSettersRef.current.get(id)?.(true)
    }
  })

  const registerTrigger = useEvent((id: string, setOpenState: MenuTriggerStateSetter) => {
    triggerStateSettersRef.current.set(id, setOpenState)
    setOpenState(activeTriggerIdRef.current === id && open)
  })

  const unregisterTrigger = useEvent((id: string) => {
    triggerStateSettersRef.current.delete(id)
    if (activeTriggerIdRef.current === id) {
      activeTriggerIdRef.current = null
    }
  })

  React.useEffect(() => {
    if (!open) {
      setActiveTrigger(null)
      return
    }
    const activeId = activeTriggerIdRef.current
    if (activeId) {
      triggerStateSettersRef.current.get(activeId)?.(true)
    }
  }, [open, setActiveTrigger])

  return { setActiveTrigger, registerTrigger, unregisterTrigger }
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
    const openRef = React.useRef(open)
    openRef.current = open
    const { setActiveTrigger, registerTrigger, unregisterTrigger } =
      useMenuTriggerSetup(open)

    return (
      <MenuProvider
        scope={scope}
        triggerId={useId()}
        triggerRef={triggerRef}
        contentId={useId()}
        openRef={openRef}
        onOpenChange={React.useCallback(
          (nextOpen: boolean) => setOpen(nextOpen),
          [setOpen]
        )}
        onOpenToggle={React.useCallback(
          () => setOpen((prevOpen) => !prevOpen),
          [setOpen]
        )}
        modal={modal}
        setActiveTrigger={setActiveTrigger}
        registerTrigger={registerTrigger}
        unregisterTrigger={unregisterTrigger}
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
      const popperCtx = usePopperContextSlow(scope || DROPDOWN_MENU_CONTEXT)
      const Comp = asChild ? Slot : View
      const isTouchDevice = useIsTouchDevice()
      const triggerElRef = React.useRef<TamaguiElement>(null)

      // multi-trigger: per-trigger open state
      const triggerId = React.useId()
      const [triggerOpen, setTriggerOpen] = React.useState(false)

      // extract stable refs so re-registration doesn't happen when context object changes
      const { registerTrigger, unregisterTrigger } = context
      React.useEffect(() => {
        registerTrigger(triggerId, setTriggerOpen)
        return () => unregisterTrigger(triggerId)
      }, [registerTrigger, unregisterTrigger, triggerId])

      // activate this trigger: set popper reference and update shared triggerRef for close-auto-focus
      const activateSelf = React.useCallback(() => {
        context.setActiveTrigger(triggerId)
        const el = triggerElRef.current
        if (el) {
          // update shared ref so close-auto-focus returns to the active trigger
          context.triggerRef.current = el
          if (el instanceof HTMLElement) {
            popperCtx.refs?.setReference(el)
            requestAnimationFrame(() => popperCtx.update?.())
          }
        }
      }, [context, triggerId, popperCtx])

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
            aria-expanded={triggerOpen}
            aria-controls={triggerOpen ? context.contentId : undefined}
            data-state={triggerOpen ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            aria-disabled={disabled || undefined}
            ref={composeRefs(forwardedRef, context.triggerRef, triggerElRef)}
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
                    if (context.openRef.current) {
                      context.setActiveTrigger(null)
                    } else {
                      activateSelf()
                    }
                    context.onOpenToggle()
                    // prevent trigger focusing when opening
                    // this allows the content to be given focus without competition
                    if (!context.openRef.current) event.preventDefault()
                  }
                }
              ),
            }}
            {...(isWeb && {
              onKeyDown: composeEventHandlers(onKeydown, (event) => {
                if (disabled) return
                if (['Enter', ' '].includes(event.key)) {
                  if (context.openRef.current) {
                    context.setActiveTrigger(null)
                  } else {
                    activateSelf()
                  }
                  context.onOpenToggle()
                }
                if (event.key === 'ArrowDown') {
                  activateSelf()
                  context.onOpenChange(true)
                }
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
              // delay to let React render new components and run their autoFocus effects
              requestAnimationFrame(() => {
                const activeEl = document.activeElement
                if (!activeEl || activeEl === document.body) {
                  context.triggerRef.current?.focus()
                }
              })
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
