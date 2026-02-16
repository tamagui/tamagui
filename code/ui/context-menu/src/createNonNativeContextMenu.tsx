import type BaseMenuTypes from '@tamagui/create-menu'
import { createBaseMenu, type CreateBaseMenuProps } from '@tamagui/create-menu'
import { useControllableState } from '@tamagui/use-controllable-state'
import {
  composeEventHandlers,
  composeRefs,
  createStyledContext,
  isAndroid,
  isWeb,
  Slot,
  type TamaguiElement,
  View,
  type ViewProps,
  withStaticProperties,
} from '@tamagui/web'
import React, { useId } from 'react'

type Direction = 'ltr' | 'rtl'
type Point = { x: number; y: number }

export const CONTEXTMENU_CONTEXT = 'ContextMenuContext'

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { scope?: string }

type BaseMenu = ReturnType<typeof createBaseMenu>['Menu']

type ContextMenuOpenChangeEvent = {
  preventDefault(): void
  defaultPrevented: boolean
}

type ContextMenuContextValue = {
  triggerId: string
  triggerRef: React.RefObject<TamaguiElement | null>
  contentId: string
  open: boolean
  onOpenChange(open: boolean, event?: ContextMenuOpenChangeEvent): void
  modal: boolean
}

interface ContextMenuProps extends BaseMenuTypes.MenuProps {
  children?: React.ReactNode
  onOpenChange?(open: boolean, event?: ContextMenuOpenChangeEvent): void
  dir?: Direction
  modal?: boolean
}

interface ContextMenuTriggerProps extends ViewProps {
  disabled?: boolean
}

type ContextMenuPortalProps = React.ComponentPropsWithoutRef<BaseMenu['Portal']>

type ContextMenuContentElement = React.ComponentRef<BaseMenu['Content']>
interface ContextMenuContentProps extends Omit<
  React.ComponentPropsWithoutRef<BaseMenu['Content']>,
  'onEntryFocus' | 'side' | 'sideOffset' | 'align'
> {}

type ContextMenuGroupProps = React.ComponentPropsWithoutRef<BaseMenu['Group']>
type ContextMenuItemProps = React.ComponentPropsWithoutRef<BaseMenu['Item']>
type ContextMenuItemImageProps = React.ComponentPropsWithoutRef<BaseMenu['ItemImage']>
type ContextMenuItemIconProps = React.ComponentPropsWithoutRef<BaseMenu['ItemIcon']>
type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  BaseMenu['CheckboxItem']
>
type ContextMenuRadioGroupElement = React.ComponentRef<BaseMenu['RadioGroup']>
type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<BaseMenu['RadioGroup']>
type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<BaseMenu['RadioItem']>
type ContextMenuItemIndicatorProps = React.ComponentPropsWithoutRef<
  BaseMenu['ItemIndicator']
>
type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<BaseMenu['Separator']>
type ContextMenuArrowProps = React.ComponentPropsWithoutRef<BaseMenu['Arrow']>

interface ContextMenuSubProps extends BaseMenuTypes.MenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<BaseMenu['SubTrigger']>
type ContextMenuSubContentElement = React.ComponentRef<BaseMenu['Content']>
type ContextMenuSubContentProps = React.ComponentPropsWithoutRef<BaseMenu['SubContent']>

/* -----------------------------------------------------------------------------------------------*/

export function createNonNativeContextMenu(params: CreateBaseMenuProps) {
  const { Menu } = createBaseMenu(params)

  /* -------------------------------------------------------------------------------------------------
   * ContextMenu
   * -----------------------------------------------------------------------------------------------*/

  const CONTEXT_MENU_NAME = 'ContextMenu'

  const { Provider: ContextMenuProvider, useStyledContext: useContextMenuContext } =
    createStyledContext<ContextMenuContextValue>()

  const ContextMenuComp = (props: ScopedProps<ContextMenuProps>) => {
    const { scope, children, onOpenChange, dir, modal = true, ...rest } = props
    const [open, setOpen] = React.useState(false)
    const triggerRef = React.useRef<TamaguiElement>(null)

    const handleOpenChange = React.useCallback(
      (open: boolean, event?: ContextMenuOpenChangeEvent) => {
        onOpenChange?.(open, event)
        if (event?.defaultPrevented) return
        setOpen(open)
      },
      [onOpenChange]
    )

    return (
      <ContextMenuProvider
        scope={scope}
        triggerId={useId()}
        triggerRef={triggerRef}
        contentId={useId()}
        open={open}
        onOpenChange={handleOpenChange}
        modal={modal}
      >
        <Menu
          scope={scope || CONTEXTMENU_CONTEXT}
          dir={dir}
          open={open}
          onOpenChange={handleOpenChange}
          modal={modal}
          {...rest}
        >
          {children}
        </Menu>
      </ContextMenuProvider>
    )
  }

  ContextMenuComp.displayName = CONTEXT_MENU_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuTrigger - The only real difference from Menu: uses onContextMenu instead of onClick
   * -----------------------------------------------------------------------------------------------*/

  const TRIGGER_NAME = 'ContextMenuTrigger'

  const ContextMenuTrigger = View.styleable<ScopedProps<ContextMenuTriggerProps>>(
    (props, forwardedRef) => {
      const { scope, style, disabled = false, asChild, children, ...triggerProps } = props
      const context = useContextMenuContext(scope)
      const pointRef = React.useRef<Point>({ x: 0, y: 0 })
      const virtualRef = React.useMemo(
        () => ({
          current: {
            getBoundingClientRect: () => {
              if (isWeb) {
                // Subtract scroll offset because floating-ui adds it back for absolute positioning
                const scrollX = window.scrollX || document.documentElement.scrollLeft
                const scrollY = window.scrollY || document.documentElement.scrollTop
                return DOMRect.fromRect({
                  width: 0,
                  height: 0,
                  x: pointRef.current.x - scrollX,
                  y: pointRef.current.y - scrollY,
                })
              }
              return { width: 0, height: 0, top: 0, left: 0, ...pointRef.current }
            },
            ...(!isWeb && {
              measure: (c: any) => c(pointRef.current.x, pointRef.current.y, 0, 0),
              measureInWindow: (c: any) =>
                c(pointRef.current.x, pointRef.current.y, 0, 0),
            }),
          },
        }),
        [pointRef.current.x, pointRef.current.y]
      )
      const longPressTimerRef = React.useRef(0)
      const clearLongPress = React.useCallback(
        () => window.clearTimeout(longPressTimerRef.current),
        []
      )
      const createOpenChangeEvent = (): ContextMenuOpenChangeEvent => {
        let defaultPrevented = false
        return {
          get defaultPrevented() {
            return defaultPrevented
          },
          preventDefault() {
            defaultPrevented = true
          },
        }
      }

      const handleOpen = (event: React.MouseEvent | React.PointerEvent) => {
        if (isWeb && (event instanceof MouseEvent || event instanceof PointerEvent)) {
          pointRef.current = { x: event.clientX, y: event.clientY }
        } else {
          pointRef.current = {
            x: (event as any).nativeEvent.pageX,
            y: (event as any).nativeEvent.pageY,
          }
        }
        const openChangeEvent = createOpenChangeEvent()
        context.onOpenChange(true, openChangeEvent)
        return openChangeEvent
      }

      React.useEffect(() => clearLongPress, [clearLongPress])
      React.useEffect(
        () => void (disabled && clearLongPress()),
        [disabled, clearLongPress]
      )

      const Comp = asChild ? Slot : View

      return (
        <>
          <Menu.Anchor scope={scope || CONTEXTMENU_CONTEXT} virtualRef={virtualRef} />
          <Comp
            render="span"
            componentName={TRIGGER_NAME}
            id={context.triggerId}
            data-state={context.open ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            {...triggerProps}
            ref={composeRefs(forwardedRef, context.triggerRef)}
            style={isWeb ? { WebkitTouchCallout: 'none', ...(style as object) } : null}
            {...(isWeb && {
              onContextMenu: disabled
                ? props.onContextMenu
                : composeEventHandlers(props.onContextMenu, (event: any) => {
                    clearLongPress()
                    const openChangeEvent = handleOpen(event)
                    if (!openChangeEvent.defaultPrevented) {
                      event.preventDefault()
                    }
                  }),
              onPointerDown: disabled
                ? props.onPointerDown
                : composeEventHandlers(props.onPointerDown, (event: any) => {
                    if (event.pointerType === 'mouse') return
                    clearLongPress()
                    longPressTimerRef.current = window.setTimeout(
                      () => handleOpen(event),
                      700
                    )
                  }),
              onPointerMove: disabled
                ? props.onPointerMove
                : composeEventHandlers(props.onPointerMove, (event: any) => {
                    if (event.pointerType === 'mouse') return
                    clearLongPress()
                  }),
              onPointerCancel: disabled
                ? props.onPointerCancel
                : composeEventHandlers(props.onPointerCancel, (event: any) => {
                    if (event.pointerType === 'mouse') return
                    clearLongPress()
                  }),
              onPointerUp: disabled
                ? props.onPointerUp
                : composeEventHandlers(props.onPointerUp, (event: any) => {
                    if (event.pointerType === 'mouse') return
                    clearLongPress()
                  }),
            })}
            {...(!isWeb && {
              onLongPress: disabled
                ? props.onLongPress
                : composeEventHandlers(props.onLongPress, (event: any) => {
                    clearLongPress()
                    const openChangeEvent = handleOpen(event)
                    if (!openChangeEvent.defaultPrevented) {
                      event.preventDefault()
                    }
                  }),
            })}
          >
            {children}
          </Comp>
        </>
      )
    }
  )

  ContextMenuTrigger.displayName = TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuPortal
   * -----------------------------------------------------------------------------------------------*/

  const PORTAL_NAME = 'ContextMenuPortal'

  const ContextMenuPortal = (props: ScopedProps<ContextMenuPortalProps>) => {
    const { scope, children, ...portalProps } = props
    const context = isAndroid ? useContextMenuContext(scope) : null
    const content = isAndroid ? (
      <ContextMenuProvider {...(context as any)}>{children}</ContextMenuProvider>
    ) : (
      children
    )
    return (
      <Menu.Portal scope={scope || CONTEXTMENU_CONTEXT} {...portalProps}>
        {content}
      </Menu.Portal>
    )
  }

  ContextMenuPortal.displayName = PORTAL_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuContent
   * -----------------------------------------------------------------------------------------------*/

  const CONTENT_NAME = 'ContextMenuContent'

  const ContextMenuContent = React.forwardRef<
    ContextMenuContentElement,
    ScopedProps<ContextMenuContentProps>
  >((props, forwardedRef) => {
    const { scope, ...contentProps } = props
    const context = useContextMenuContext(scope)
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <Menu.Content
        id={context.contentId}
        aria-labelledby={context.triggerId}
        scope={scope || CONTEXTMENU_CONTEXT}
        {...contentProps}
        ref={forwardedRef}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus()
          hasInteractedOutsideRef.current = false
          event.preventDefault()
        })}
        onInteractOutside={composeEventHandlers(props.onInteractOutside, (event) => {
          const originalEvent = event.detail.originalEvent as PointerEvent
          const ctrlLeftClick =
            originalEvent.button === 0 && originalEvent.ctrlKey === true
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick
          if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true
        })}
      />
    )
  })

  ContextMenuContent.displayName = CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuItem
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_NAME = 'ContextMenuItem'

  const ContextMenuItem = React.forwardRef<
    TamaguiElement,
    ScopedProps<ContextMenuItemProps>
  >((props, forwardedRef) => {
    const { scope, ...itemProps } = props
    return (
      <Menu.Item
        componentName={ITEM_NAME}
        scope={scope || CONTEXTMENU_CONTEXT}
        {...itemProps}
        ref={forwardedRef}
      />
    )
  })

  ContextMenuItem.displayName = ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuCheckboxItem
   * -----------------------------------------------------------------------------------------------*/

  const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem'

  const ContextMenuCheckboxItem = React.forwardRef<
    TamaguiElement,
    ScopedProps<ContextMenuCheckboxItemProps>
  >((props, forwardedRef) => {
    const { scope, ...checkboxItemProps } = props
    return (
      <Menu.CheckboxItem
        componentName={CHECKBOX_ITEM_NAME}
        scope={scope || CONTEXTMENU_CONTEXT}
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

  const ContextMenuRadioGroup = React.forwardRef<
    ContextMenuRadioGroupElement,
    ScopedProps<ContextMenuRadioGroupProps>
  >((props, forwardedRef) => {
    const { scope, ...radioGroupProps } = props
    return (
      <Menu.RadioGroup
        scope={scope || CONTEXTMENU_CONTEXT}
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

  const ContextMenuRadioItem = React.forwardRef<
    TamaguiElement,
    ScopedProps<ContextMenuRadioItemProps>
  >((props, forwardedRef) => {
    const { scope, ...radioItemProps } = props
    return (
      <Menu.RadioItem
        componentName={RADIO_ITEM_NAME}
        scope={scope || CONTEXTMENU_CONTEXT}
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

  const ContextMenuItemIndicator = Menu.ItemIndicator.styleable<
    ScopedProps<ContextMenuItemIndicatorProps>
  >((props, forwardedRef) => {
    const { scope, ...itemIndicatorProps } = props
    return (
      <Menu.ItemIndicator
        componentName={INDICATOR_NAME}
        scope={scope || CONTEXTMENU_CONTEXT}
        {...itemIndicatorProps}
        ref={forwardedRef}
      />
    )
  })

  ContextMenuItemIndicator.displayName = INDICATOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuSub
   * -----------------------------------------------------------------------------------------------*/

  const SUB_NAME = 'ContextMenuSub'

  const ContextMenuSub = (props: ScopedProps<ContextMenuSubProps>) => {
    const { scope, children, onOpenChange, open: openProp, defaultOpen, ...rest } = props
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })

    return (
      <Menu.Sub
        scope={scope || CONTEXTMENU_CONTEXT}
        open={open}
        onOpenChange={setOpen}
        {...rest}
      >
        {children}
      </Menu.Sub>
    )
  }

  ContextMenuSub.displayName = SUB_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuSubTrigger
   * -----------------------------------------------------------------------------------------------*/

  const SUB_TRIGGER_NAME = 'ContextMenuSubTrigger'

  const ContextMenuSubTrigger = View.styleable<ScopedProps<ContextMenuSubTriggerProps>>(
    (props, forwardedRef) => {
      const { scope, ...subTriggerProps } = props
      return (
        <Menu.SubTrigger
          componentName={SUB_TRIGGER_NAME}
          scope={scope || CONTEXTMENU_CONTEXT}
          {...subTriggerProps}
          ref={forwardedRef}
        />
      )
    }
  )

  ContextMenuSubTrigger.displayName = SUB_TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuSubContent
   * -----------------------------------------------------------------------------------------------*/

  const SUB_CONTENT_NAME = 'ContextMenuSubContent'

  const ContextMenuSubContent = React.forwardRef<
    ContextMenuSubContentElement,
    ScopedProps<ContextMenuSubContentProps>
  >((props, forwardedRef) => {
    const { scope, ...subContentProps } = props
    return (
      <Menu.SubContent
        scope={scope || CONTEXTMENU_CONTEXT}
        {...subContentProps}
        ref={forwardedRef}
        style={
          isWeb
            ? {
                ...(props.style as object),
                ...({
                  '--tamagui-context-menu-content-transform-origin':
                    'var(--tamagui-popper-transform-origin)',
                  '--tamagui-context-menu-content-available-width':
                    'var(--tamagui-popper-available-width)',
                  '--tamagui-context-menu-content-available-height':
                    'var(--tamagui-popper-available-height)',
                  '--tamagui-context-menu-trigger-width':
                    'var(--tamagui-popper-anchor-width)',
                  '--tamagui-context-menu-trigger-height':
                    'var(--tamagui-popper-anchor-height)',
                } as React.CSSProperties),
              }
            : null
        }
      />
    )
  })

  ContextMenuSubContent.displayName = SUB_CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuArrow
   * -----------------------------------------------------------------------------------------------*/

  const ARROW_NAME = 'ContextMenuArrow'

  const ContextMenuArrow = React.forwardRef<
    TamaguiElement,
    ScopedProps<ContextMenuArrowProps>
  >((props, forwardedRef) => {
    const { scope, ...arrowProps } = props
    return (
      <Menu.Arrow
        componentName={ARROW_NAME}
        scope={scope || CONTEXTMENU_CONTEXT}
        {...arrowProps}
        ref={forwardedRef}
      />
    )
  })

  ContextMenuArrow.displayName = ARROW_NAME

  /* -------------------------------------------------------------------------------------------------
   * Pass-through components (same as Menu)
   * -----------------------------------------------------------------------------------------------*/

  const ContextMenuGroup = Menu.Group
  const ContextMenuLabel = Menu.Label
  const ContextMenuSeparator = Menu.Separator
  const ContextMenuItemTitle = Menu.ItemTitle
  const ContextMenuItemSubTitle = Menu.ItemSubtitle
  const ContextMenuItemImage = Menu.ItemImage
  const ContextMenuItemIcon = Menu.ItemIcon
  const ContextMenuPreview = () => null // No-op on web

  /* -----------------------------------------------------------------------------------------------*/

  return withStaticProperties(ContextMenuComp, {
    Root: ContextMenuComp,
    Trigger: ContextMenuTrigger,
    Portal: ContextMenuPortal,
    Content: ContextMenuContent,
    Group: ContextMenuGroup,
    Label: ContextMenuLabel,
    Item: ContextMenuItem,
    CheckboxItem: ContextMenuCheckboxItem,
    RadioGroup: ContextMenuRadioGroup,
    RadioItem: ContextMenuRadioItem,
    ItemIndicator: ContextMenuItemIndicator,
    Separator: ContextMenuSeparator,
    Arrow: ContextMenuArrow,
    Sub: ContextMenuSub,
    SubTrigger: ContextMenuSubTrigger,
    SubContent: ContextMenuSubContent,
    ItemTitle: ContextMenuItemTitle,
    ItemSubtitle: ContextMenuItemSubTitle,
    ItemIcon: ContextMenuItemIcon,
    ItemImage: ContextMenuItemImage,
    Preview: ContextMenuPreview,
  })
}

export type {
  ContextMenuArrowProps,
  ContextMenuCheckboxItemProps,
  ContextMenuOpenChangeEvent,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemIconProps,
  ContextMenuItemImageProps,
  ContextMenuItemIndicatorProps,
  ContextMenuItemProps,
  ContextMenuPortalProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuSubContentProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
}
