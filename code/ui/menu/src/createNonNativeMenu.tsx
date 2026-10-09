import { createStyledHOC, createRefComponent } from '@tamagui/core'
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

type TriggerGroupEntry = {
  id: string
  ref: React.RefObject<TamaguiElement | null>
  openRef: React.RefObject<boolean>
  disabled: boolean
  activate(): void
  focusContent(): void
  onOpenChange(open: boolean): void
}

type TriggerGroupContextValue = {
  dir: Direction
  tabStopId: string | null
  register(entry: TriggerGroupEntry): () => void
  activate(entry: TriggerGroupEntry): void
  isOpen(): boolean
  isActive(openRef: React.RefObject<boolean>): boolean
  contains(target: EventTarget | null): boolean
  move(id: string, key: string, open: boolean): void
  onFocus(id: string): void
}

type MenuTriggerGroupProps = ViewProps & { dir?: Direction }

const TriggerGroupContext = React.createContext<TriggerGroupContextValue | null>(null)

const MenuTriggerGroup = createStyledHOC(
  View,
  ({ children, dir = 'ltr', ...props }: MenuTriggerGroupProps, forwardedRef) => {
    const entries = React.useRef(new Map<string, TriggerGroupEntry>())
    const active = React.useRef<TriggerGroupEntry | null>(null)
    const [tabStopId, setTabStopId] = React.useState<string | null>(null)
    const register = useEvent((entry: TriggerGroupEntry) => {
      entries.current.set(entry.id, entry)
      if (!entry.disabled) setTabStopId((id) => id ?? entry.id)
      return () => {
        entries.current.delete(entry.id)
        if (active.current === entry) active.current = null
        setTabStopId((id) =>
          id === entry.id
            ? ([...entries.current.values()].find((item) => !item.disabled)?.id ?? null)
            : id
        )
      }
    })
    const activate = useEvent((entry: TriggerGroupEntry) => {
      const previous = active.current
      active.current = entry
      setTabStopId(entry.id)
      if (previous && previous.openRef !== entry.openRef && previous.openRef.current) {
        previous.onOpenChange(false)
      }
      entry.activate()
    })
    const isOpen = useEvent(() => Boolean(active.current?.openRef.current))
    const isActive = useEvent(
      (openRef: React.RefObject<boolean>) => active.current?.openRef === openRef
    )
    const contains = useEvent((target: EventTarget | null) =>
      [...entries.current.values()].some((entry) =>
        (entry.ref.current as HTMLElement | null)?.contains(target as Node)
      )
    )
    const move = useEvent((id: string, key: string, open: boolean) => {
      const ordered = [...entries.current.values()]
        .filter((entry) => !entry.disabled)
        .sort((a, b) => {
          const first = a.ref.current as HTMLElement | null
          const second = b.ref.current as HTMLElement | null
          return first && second && first.compareDocumentPosition(second) & 2 ? 1 : -1
        })
      const index = ordered.findIndex((entry) => entry.id === id)
      if (index === -1) return
      const step = (key === 'ArrowRight') === (dir === 'ltr') ? 1 : -1
      const next = ordered[(index + step + ordered.length) % ordered.length]
      next.ref.current?.focus?.()
      if (open) {
        activate(next)
        next.onOpenChange(true)
        requestAnimationFrame(() => next.focusContent())
      }
    })
    const onFocus = useEvent((id: string) => setTabStopId(id))
    const value = React.useMemo(
      () => ({
        dir,
        tabStopId,
        register,
        activate,
        isOpen,
        isActive,
        contains,
        move,
        onFocus,
      }),
      [dir, tabStopId, register, activate, isOpen, isActive, contains, move, onFocus]
    )
    return (
      <TriggerGroupContext.Provider value={value}>
        <View
          flexDirection="row"
          role="menubar"
          {...props}
          {...(isWeb && { dir })}
          ref={forwardedRef}
        >
          {children}
        </View>
      </TriggerGroupContext.Provider>
    )
  }
)
MenuTriggerGroup.displayName = 'MenuTriggerGroup'

type MenuContextValue = {
  triggerId: string
  triggerRef: React.RefObject<TamaguiElement | null>
  contentId: string
  openRef: React.RefObject<boolean>
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
  setActiveTrigger(id: string | null): void
  registerTrigger(
    id: string,
    setOpen: MenuTriggerStateSetter,
    group: TriggerGroupContextValue | null
  ): void
  unregisterTrigger(id: string): void
  activeTriggerIdRef: React.RefObject<string | null>
  activeGroupRef: React.RefObject<TriggerGroupContextValue | null>
}

function useMenuTriggerSetup(open: boolean) {
  const triggerStateSettersRef = React.useRef(new Map<string, MenuTriggerStateSetter>())
  const activeTriggerIdRef = React.useRef<string | null>(null)
  const triggerGroupsRef = React.useRef(
    new Map<string, TriggerGroupContextValue | null>()
  )
  const activeGroupRef = React.useRef<TriggerGroupContextValue | null>(null)
  const [activeGroup, setActiveGroup] = React.useState<TriggerGroupContextValue | null>(
    null
  )

  const setActiveTrigger = useEvent((id: string | null) => {
    const prevId = activeTriggerIdRef.current
    if (prevId === id) return
    if (prevId) {
      triggerStateSettersRef.current.get(prevId)?.(false)
    }
    activeTriggerIdRef.current = id
    activeGroupRef.current = id ? (triggerGroupsRef.current.get(id) ?? null) : null
    setActiveGroup(activeGroupRef.current)
    if (id && open) {
      triggerStateSettersRef.current.get(id)?.(true)
    }
  })

  const registerTrigger = useEvent(
    (
      id: string,
      setOpenState: MenuTriggerStateSetter,
      group: TriggerGroupContextValue | null
    ) => {
      triggerGroupsRef.current.set(id, group)
      triggerStateSettersRef.current.set(id, setOpenState)
      setOpenState(activeTriggerIdRef.current === id && open)
    }
  )

  const unregisterTrigger = useEvent((id: string) => {
    triggerStateSettersRef.current.delete(id)
    triggerGroupsRef.current.delete(id)
    if (activeTriggerIdRef.current === id) {
      activeTriggerIdRef.current = null
      activeGroupRef.current = null
      setActiveGroup(null)
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

  return {
    setActiveTrigger,
    registerTrigger,
    unregisterTrigger,
    activeTriggerIdRef,
    activeGroupRef,
    activeGroup,
  }
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
  /** @deprecated misspelled, use `onKeyDown` (this alias is honored when `onKeyDown` is absent) */
  onKeydown?(event: React.KeyboardEvent): void
}

/* -------------------------------------------------------------------------------------------------
 * MenuPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = BaseMenuPortalProps

/* -------------------------------------------------------------------------------------------------
 * MenuContent
 * -----------------------------------------------------------------------------------------------*/

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

type MenuSubContentProps = BaseMenuSubContentProps

/* -------------------------------------------------------------------------------------------------
 * MenuScrollView
 * -----------------------------------------------------------------------------------------------*/

type MenuScrollViewProps = ScrollViewProps

/* -----------------------------------------------------------------------------------------------*/

export function createNonNativeMenu() {
  const { Menu } = createBaseMenu()

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
    const outerGroup = React.useContext(TriggerGroupContext)
    const triggerRef = React.useRef<TamaguiElement>(null)
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })
    const openRef = React.useRef(open)
    openRef.current = open
    const {
      setActiveTrigger,
      registerTrigger,
      unregisterTrigger,
      activeTriggerIdRef,
      activeGroupRef,
      activeGroup,
    } = useMenuTriggerSetup(open)
    const effectiveModal = outerGroup || activeGroup ? false : modal

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
        modal={effectiveModal}
        setActiveTrigger={setActiveTrigger}
        registerTrigger={registerTrigger}
        unregisterTrigger={unregisterTrigger}
        activeTriggerIdRef={activeTriggerIdRef}
        activeGroupRef={activeGroupRef}
      >
        <Menu
          scope={scope || DROPDOWN_MENU_CONTEXT}
          open={open}
          onOpenChange={setOpen}
          dir={dir ?? outerGroup?.dir}
          modal={effectiveModal}
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

  const MenuTrigger = createStyledHOC(
    View,
    (props: ScopedProps<MenuTriggerProps>, forwardedRef) => {
      const {
        scope,
        asChild,
        children,
        disabled = false,
        onKeydown,
        onKeyDown = onKeydown,
        ...triggerProps
      } = props
      const context = useMenuContext(scope)
      const group = React.useContext(TriggerGroupContext)
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
        registerTrigger(triggerId, setTriggerOpen, group)
        return () => unregisterTrigger(triggerId)
      }, [registerTrigger, unregisterTrigger, triggerId, group?.register])

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

      const activate = useEvent(activateSelf)
      const focusContent = useEvent(() => {
        document
          .getElementById(context.contentId)
          ?.querySelector<HTMLElement>('[role^="menuitem"]:not([data-disabled])')
          ?.focus()
      })
      const entry = React.useRef<TriggerGroupEntry>(null!)
      if (!entry.current) {
        entry.current = {
          id: triggerId,
          ref: triggerElRef,
          openRef: context.openRef,
          disabled,
          activate,
          focusContent,
          onOpenChange: context.onOpenChange,
        }
      }
      entry.current.disabled = disabled
      entry.current.onOpenChange = context.onOpenChange
      const registerGroup = group?.register
      React.useEffect(() => registerGroup?.(entry.current), [registerGroup])
      const openSelf = () => {
        if (group) group.activate(entry.current)
        else activateSelf()
      }

      const shouldRejectHover = () =>
        disabled ||
        (context.openRef.current &&
          context.activeTriggerIdRef.current !== triggerId &&
          !group?.isActive(context.openRef))

      // Use onClick for touch devices to avoid race condition with Dismissable
      // Use onPointerDown for mouse for faster feedback
      const pressEvent = isWeb ? (isTouchDevice ? 'onClick' : 'onPointerDown') : 'onPress'

      return (
        <MenuTriggerFrame
          asChild
          className={`is_${TRIGGER_NAME}`}
          scope={scope || DROPDOWN_MENU_CONTEXT}
        >
          <Comp
            role={group ? 'menuitem' : 'button'}
            tabIndex={group ? (group.tabStopId === triggerId ? 0 : -1) : undefined}
            id={context.triggerId}
            aria-haspopup="menu"
            aria-expanded={triggerOpen}
            aria-controls={triggerOpen ? context.contentId : undefined}
            data-state={triggerOpen ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            aria-disabled={disabled || undefined}
            ref={composeRefs(
              forwardedRef,
              group ? undefined : context.triggerRef,
              triggerElRef
            )}
            // caller props come first: the composed handlers below already call
            // the caller's own handler, so spreading them after would let a
            // caller's onPointerDown/onClick/onPress or onKeyDown replace the
            // one that opens the menu. the press prop stays read off `props`
            // because which of the three opens the menu is decided at runtime.
            {...triggerProps}
            onFocus={composeEventHandlers(props.onFocus, () => {
              if (!disabled) group?.onFocus(triggerId)
            })}
            onPointerEnter={(event) => {
              // popper checks this child handler before changing its reference.
              if (shouldRejectHover()) {
                event.preventDefault()
                return
              }
              props.onPointerEnter?.(event)
            }}
            onMouseEnter={(event) => {
              // reject before caller handlers can change the shared descriptor.
              if (shouldRejectHover()) {
                event.preventDefault()
                return
              }
              composeEventHandlers(props.onMouseEnter, () => {
                if (group?.isOpen() && !triggerOpen) {
                  triggerElRef.current?.focus?.()
                  openSelf()
                  context.onOpenChange(true)
                }
              })?.(event)
            }}
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
                      openSelf()
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
              onKeyDown: composeEventHandlers(onKeyDown, (event) => {
                if (disabled) return
                if (group && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                  group.move(triggerId, event.key, group.isOpen())
                  event.preventDefault()
                  return
                }
                if (['Enter', ' '].includes(event.key)) {
                  if (context.openRef.current) {
                    context.setActiveTrigger(null)
                  } else {
                    openSelf()
                  }
                  context.onOpenToggle()
                }
                if (event.key === 'ArrowDown') {
                  openSelf()
                  context.onOpenChange(true)
                }
                // prevent keydown from scrolling window / first focused item to execute
                // that keydown (inadvertently closing the menu)
                if (['Enter', ' ', 'ArrowDown'].includes(event.key))
                  event.preventDefault()
              }),
            })}
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

  const MenuContent = createStyledHOC(
    Menu.Content,
    (props: ScopedProps<MenuContentProps>, forwardedRef) => {
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
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            const group = context.activeGroupRef.current
            if (!group || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
            // submenu handlers own their open/close keys, including portal bubbling
            const target = event.target as HTMLElement
            if (target.closest('[data-tamagui-menu-content]') !== event.currentTarget)
              return
            if (
              target.closest('[aria-haspopup="menu"]') &&
              event.key === (group.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')
            )
              return
            const id = context.activeTriggerIdRef.current
            if (id) {
              group.move(id, event.key, true)
              event.preventDefault()
            }
          })}
          onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
            const group = context.activeGroupRef.current
            if (group && !group.isActive(context.openRef)) {
              event.cancel()
              return
            }
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
            event.cancel()
          })}
          onInteractOutside={composeEventHandlers(props.onInteractOutside, (event) => {
            if (context.activeGroupRef.current?.contains(event.event?.target ?? null)) {
              event.cancel()
              return
            }
            if (event.interaction !== 'pointer' || !event.event) return
            const originalEvent = event.event
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

  const MenuSubContent = createStyledHOC(
    Menu.SubContent,
    (props: ScopedProps<MenuSubContentProps>, forwardedRef) => {
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
                    '--tamagui-menu-trigger-height':
                      'var(--tamagui-popper-anchor-height)',
                  } as React.CSSProperties),
                }
              : null
          }
        />
      )
    }
  )

  MenuSubContent.displayName = SUB_CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuScrollView
   * -----------------------------------------------------------------------------------------------*/

  const MenuScrollView = styled(ScrollView, {
    flexShrink: 1,
    alignSelf: 'stretch',
    maxHeight: 'web:var(--tamagui-menu-content-available-height)',
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
  })

  /* -----------------------------------------------------------------------------------------------*/

  // direct pass-through from base menu preserves the wrapped styled components
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
    TriggerGroup: MenuTriggerGroup,
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
  MenuTriggerGroupProps,
}
