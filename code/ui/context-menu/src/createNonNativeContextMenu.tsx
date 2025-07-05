import {
  type GestureReponderEvent,
  Stack,
  composeEventHandlers,
  createStyledContext,
  isAndroid,
  isWeb,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import {
  Menu,
  type MenuItemIconProps,
  type MenuItemImageProps,
  type MenuProps,
  type MenuSubProps,
  type createMenu,
} from '@tamagui/menu'
import { YStack } from '@tamagui/stacks'
import { useCallbackRef } from '@tamagui/use-callback-ref'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

type Direction = 'ltr' | 'rtl'
type Point = { x: number; y: number }

type ContextMenuContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  modal: boolean
}

type ScopedProps<P> = P & { __scopeContextMenu?: string }

interface ContextMenuProps extends MenuProps {
  children?: React.ReactNode
  onOpenChange?(open: boolean): void
  dir?: Direction
  modal?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>
interface ContextMenuTriggerProps extends PrimitiveSpanProps {
  disabled?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuPortal
 * -----------------------------------------------------------------------------------------------*/

type MenuPortalProps = React.ComponentPropsWithoutRef<typeof Menu.Portal>
interface ContextMenuPortalProps extends MenuPortalProps {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuContent
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuContentElement = React.ElementRef<typeof Menu.Content>
type MenuContentProps = React.ComponentPropsWithoutRef<typeof Menu.Content>
interface ContextMenuContentProps
  extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuGroup
 * -----------------------------------------------------------------------------------------------*/

type MenuGroupProps = React.ComponentPropsWithoutRef<typeof Menu.Group>
type ContextMenuGroupProps = MenuGroupProps & {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItem
 * -----------------------------------------------------------------------------------------------*/

type MenuItemProps = React.ComponentPropsWithoutRef<typeof Menu.Item>
interface ContextMenuItemProps extends MenuItemProps {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemImage
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuItemImageProps = MenuItemImageProps

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIcon
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuItemIconProps = MenuItemIconProps

/* -------------------------------------------------------------------------------------------------
 * ContextMenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
interface ContextMenuCheckboxItemProps extends MenuCheckboxItemProps {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuRadioGroupElement = React.ElementRef<typeof Menu.RadioGroup>
type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof Menu.RadioGroup>

/* -------------------------------------------------------------------------------------------------
 * ContextMenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof Menu.RadioItem>

/* -------------------------------------------------------------------------------------------------
 * ContextMenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof Menu.ItemIndicator>
interface ContextMenuItemIndicatorProps extends MenuItemIndicatorProps {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSeparator
 * -----------------------------------------------------------------------------------------------*/

type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof Menu.Separator>
type ContextMenuSeparatorProps = MenuSeparatorProps & {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuArrow
 * -----------------------------------------------------------------------------------------------*/

type MenuArrowProps = React.ComponentPropsWithoutRef<typeof Menu.Arrow>
interface ContextMenuArrowProps extends MenuArrowProps {}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSub
 * -----------------------------------------------------------------------------------------------*/

interface ContextMenuSubProps extends MenuSubProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
}

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof Menu.SubTrigger>
type ContextMenuSubTriggerProps = ScopedProps<MenuSubTriggerProps>

/* -------------------------------------------------------------------------------------------------
 * ContextMenuSubContent
 * -----------------------------------------------------------------------------------------------*/

type ContextMenuSubContentElement = React.ElementRef<typeof Menu.Content>
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof Menu.SubContent>
interface ContextMenuSubContentProps extends MenuSubContentProps {}

/* -----------------------------------------------------------------------------------------------*/

function whenTouchOrPen<E>(
  handler: React.PointerEventHandler<E>
): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined)
}

export const CONTEXTMENU_CONTEXT = 'ContextMenuContext'

export function createNonNativeContextMenu(param: Parameters<typeof createMenu>[0]) {
  /* -------------------------------------------------------------------------------------------------
   * ContextMenu
   * -----------------------------------------------------------------------------------------------*/

  const CONTEXT_MENU_NAME = 'ContextMenu'

  const { Provider: ContextMenuProvider, useStyledContext: useContextMenuContext } =
    createStyledContext<ContextMenuContextValue>()

  const ContextMenuComp = (props: ScopedProps<ContextMenuProps>) => {
    const {
      __scopeContextMenu,
      children,
      onOpenChange,
      dir,
      modal = true,
      ...rest
    } = props
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
          {...rest}
        >
          {children}
        </Menu>
      </ContextMenuProvider>
    )
  }

  ContextMenuComp.displayName = CONTEXT_MENU_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuTrigger
   * -----------------------------------------------------------------------------------------------*/

  const TRIGGER_NAME = 'ContextMenuTrigger'

  const ContextMenuTrigger = Stack.styleable(
    (props: ScopedProps<ContextMenuTriggerProps>, forwardedRef) => {
      const { __scopeContextMenu, style, disabled = false, ...triggerProps } = props
      const context = useContextMenuContext(__scopeContextMenu)
      const pointRef = React.useRef<Point>({ x: 0, y: 0 })
      const virtualRef = React.useMemo(
        () => ({
          current: {
            getBoundingClientRect: () =>
              isWeb
                ? DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current })
                : {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    ...pointRef.current,
                  },

            ...(!isWeb && {
              measure: (c) => c(pointRef.current.x, pointRef.current.y, 0, 0),
              measureInWindow: (c) => c(pointRef.current.x, pointRef.current.y, 0, 0),
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
      const handleOpen = (
        event: React.MouseEvent | React.PointerEvent | GestureReponderEvent
      ) => {
        if (isWeb && (event instanceof MouseEvent || event instanceof PointerEvent)) {
          pointRef.current = { x: event.clientX, y: event.clientY }
        } else {
          pointRef.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY }
        }
        context.onOpenChange(true)
      }

      React.useEffect(() => clearLongPress, [clearLongPress])
      React.useEffect(
        () => void (disabled && clearLongPress()),
        [disabled, clearLongPress]
      )

      return (
        <>
          <Menu.Anchor
            __scopePopper={__scopeContextMenu || CONTEXTMENU_CONTEXT}
            virtualRef={virtualRef}
          />
          <Stack
            tag="span"
            componentName={TRIGGER_NAME}
            data-state={context.open ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            {...triggerProps}
            ref={forwardedRef}
            // prevent iOS context menu from appearing
            style={isWeb ? { WebkitTouchCallout: 'none', ...(style as Object) } : null}
            // if trigger is disabled, enable the native Context Menu
            {...(isWeb && {
              onContextMenu: disabled
                ? (props as React.HTMLProps<'div'>).onContextMenu
                : composeEventHandlers(
                    (props as React.HTMLProps<'div'>).onContextMenu,
                    (event: any) => {
                      // clearing the long press here because some platforms already support
                      // long press to trigger a `contextmenu` event
                      clearLongPress()
                      handleOpen(event)
                      event.preventDefault()
                    }
                  ),
            })}
            {...(isWeb && {
              onPointerDown: disabled
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
                  ),
              onPointerMove: disabled
                ? props.onPointerMove
                : composeEventHandlers(
                    props.onPointerMove,
                    whenTouchOrPen(clearLongPress) as any
                  ),
              onPointerCancel: disabled
                ? props.onPointerCancel
                : composeEventHandlers(
                    props.onPointerCancel,
                    whenTouchOrPen(clearLongPress) as any
                  ),
              onPointerUp: disabled
                ? props.onPointerUp
                : composeEventHandlers(
                    props.onPointerUp,
                    whenTouchOrPen(clearLongPress) as any
                  ),
            })}
            {...(!isWeb && {
              onLongPress: disabled
                ? props.onLongPress
                : composeEventHandlers(props.onLongPress, (event) => {
                    clearLongPress()
                    handleOpen(event)
                    event.preventDefault()
                  }),
            })}
          />
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
    const {
      __scopeContextMenu,
      // TODO: fix this children type error
      // @ts-ignore
      children,
      ...portalProps
    } = props

    const context = isAndroid ? useContextMenuContext(__scopeContextMenu) : null

    const content = isAndroid ? (
      <ContextMenuProvider {...context}>{children}</ContextMenuProvider>
    ) : (
      children
    )
    return (
      <Menu.Portal
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        {...portalProps}
      >
        {children}
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
    const { __scopeContextMenu, ...contentProps } = props
    const context = useContextMenuContext(__scopeContextMenu)
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <Menu.Content
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        {...contentProps}
        ref={forwardedRef}
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
        // TODO: we should probably expose these evn variables at some point
        // style={
        //   isWeb && {
        //     ...(props.style as Object),
        //     // re-namespace exposed content custom properties
        //     ...({
        //       '--tamagui-context-menu-content-transform-origin':
        //         'var(--tamagui-popper-transform-origin)',
        //       '--tamagui-context-menu-content-available-width':
        //         'var(--tamagui-popper-available-width)',
        //       '--tamagui-context-menu-content-available-height':
        //         'var(--tamagui-popper-available-height)',
        //       '--tamagui-context-menu-trigger-width': 'var(--tamagui-popper-anchor-width)',
        //       '--tamagui-context-menu-trigger-height':
        //         'var(--tamagui-popper-anchor-height)',
        //     } as unknown as React.CSSProperties),
        //   }
        // }
      />
    )
  })

  ContextMenuContent.displayName = CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuGroup
   * -----------------------------------------------------------------------------------------------*/

  const GROUP_NAME = 'ContextMenuGroup'

  const ContextMenuGroup = Menu.Group.styleable(
    (props: ScopedProps<ContextMenuGroupProps>, forwardedRef) => {
      const { __scopeContextMenu, ...groupProps } = props
      return <Menu.Group componentName={GROUP_NAME} {...groupProps} ref={forwardedRef} />
    }
  )

  ContextMenuGroup.displayName = GROUP_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuLabel
   * -----------------------------------------------------------------------------------------------*/

  const LABEL_NAME = 'ContextMenuLabel'

  const ContextMenuLabel = Menu.Label

  ContextMenuLabel.displayName = LABEL_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuItem
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_NAME = 'ContextMenuItem'

  const ContextMenuItem = Menu.Item.styleable<ScopedProps<ContextMenuItemProps>>(
    (props: ScopedProps<ContextMenuItemProps>, forwardedRef) => {
      const { __scopeContextMenu, ...itemProps } = props
      return (
        <Menu.Item
          componentName={ITEM_NAME}
          __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
          {...itemProps}
          ref={forwardedRef}
        />
      )
    }
  )

  ContextMenuItem.displayName = ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuItemTitle
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_TITLE_NAME = 'ContextMenuItemTitle'
  const ContextMenuItemTitle = Menu.ItemTitle
  ContextMenuItemTitle.displayName = ITEM_TITLE_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuItemSubTitle
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_SUB_TITLE_NAME = 'ContextMenuItemSubTitle'
  const ContextMenuItemSubTitle = Menu.ItemSubtitle
  ContextMenuItemSubTitle.displayName = ITEM_SUB_TITLE_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuItemImage
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_IMAGE_NAME = 'ContextMenuItemImage'
  const ContextMenuItemImage = Menu.ItemImage
  ContextMenuItemImage.displayName = ITEM_IMAGE_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuItemIcon
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_ICON_NAME = 'ContextMenuItemIcon'
  const ContextMenuItemIcon = Menu.ItemIcon
  ContextMenuItemIcon.displayName = ITEM_ICON_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuPreview
   * -----------------------------------------------------------------------------------------------*/

  const PREVIEW_NAME = 'ContextMenuPreview'
  const ContextMenuPreview = () => null
  ContextMenuPreview.displayName = PREVIEW_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuCheckboxItem
   * -----------------------------------------------------------------------------------------------*/

  const CHECKBOX_ITEM_NAME = 'ContextMenuCheckboxItem'

  const ContextMenuCheckboxItem = Menu.CheckboxItem.styleable(
    (props: ScopedProps<ContextMenuCheckboxItemProps>, forwardedRef) => {
      const { __scopeContextMenu, ...checkboxItemProps } = props
      return (
        <Menu.CheckboxItem
          componentName={CHECKBOX_ITEM_NAME}
          __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
          {...checkboxItemProps}
          ref={forwardedRef}
        />
      )
    }
  )

  ContextMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuRadioGroup
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_GROUP_NAME = 'ContextMenuRadioGroup'

  const ContextMenuRadioGroup = React.forwardRef<
    ContextMenuRadioGroupElement,
    ScopedProps<ContextMenuRadioGroupProps>
  >((props, forwardedRef) => {
    const { __scopeContextMenu, ...radioGroupProps } = props
    return (
      <Menu.RadioGroup
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        data-bro
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

  const ContextMenuRadioItem = Menu.RadioItem.styleable<
    ScopedProps<ContextMenuRadioItemProps>
  >((props: ScopedProps<ContextMenuRadioItemProps>, forwardedRef) => {
    const { __scopeContextMenu, ...radioItemProps } = props
    return (
      <Menu.RadioItem
        componentName={RADIO_ITEM_NAME}
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

  const MenuItemIndicatorFrame = styled(Menu.ItemIndicator, {
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

  const ContextMenuSeparator = Menu.Separator.styleable<
    ScopedProps<ContextMenuSeparatorProps>
  >((props: ScopedProps<ContextMenuSeparatorProps>, forwardedRef) => {
    const { __scopeContextMenu, ...separatorProps } = props
    return (
      <Menu.Separator
        componentName={SEPARATOR_NAME}
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

  const ContextMenuArrow = Menu.Arrow.styleable<ScopedProps<ContextMenuArrowProps>>(
    (props, forwardedRef) => {
      const { __scopeContextMenu, ...arrowProps } = props
      return (
        <Menu.Arrow
          __scopePopper={__scopeContextMenu || CONTEXTMENU_CONTEXT}
          {...arrowProps}
          ref={forwardedRef}
        />
      )
    }
  )

  ContextMenuArrow.displayName = ARROW_NAME

  /* -------------------------------------------------------------------------------------------------
   * ContextMenuSub
   * -----------------------------------------------------------------------------------------------*/

  const SUB_NAME = 'ContextMenuSub'

  const ContextMenuSub: React.FC<ScopedProps<ContextMenuSubProps>> = (
    props: ScopedProps<ContextMenuSubProps>
  ) => {
    const {
      __scopeContextMenu,
      children,
      onOpenChange,
      open: openProp,
      defaultOpen,
      ...rest
    } = props
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen!,
      onChange: onOpenChange,
    })

    return (
      <Menu.Sub
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
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

  const ContextMenuSubTrigger = YStack.styleable<ContextMenuSubTriggerProps>(
    (props, forwardedRef) => {
      const { __scopeContextMenu, ...triggerItemProps } = props
      return (
        <Menu.SubTrigger
          componentName={SUB_CONTENT_NAME}
          __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
          {...triggerItemProps}
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
    ScopedProps<React.PropsWithChildren<ContextMenuSubContentProps>>
  >((props, forwardedRef) => {
    const { __scopeContextMenu, ...subContentProps } = props

    return (
      <Menu.SubContent
        __scopeMenu={__scopeContextMenu || CONTEXTMENU_CONTEXT}
        {...subContentProps}
        ref={forwardedRef}
        // TODO: handle native as well
        style={
          isWeb && {
            // TODO: fix style prop doesn't exists type error
            // @ts-ignore
            ...(props.style as Object),
            // re-namespace exposed content custom properties
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

  const Root = ContextMenuComp
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
  const ItemTitle = ContextMenuItemTitle
  const ItemSubtitle = ContextMenuItemSubTitle
  const ItemIcon = ContextMenuItemIcon
  const ItemImage = ContextMenuItemImage
  const Preview = ContextMenuPreview
  const ContextMenu = withStaticProperties(ContextMenuComp, {
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
    ItemIcon,
    ItemImage,
    Preview,
  })

  return ContextMenu
}

export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuPortalProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
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
  ContextMenuItemImageProps,
  ContextMenuItemIconProps,
}
