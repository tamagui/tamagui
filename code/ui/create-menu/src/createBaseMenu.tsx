import { Animate } from '@tamagui/animate'
import { AnimatePresence as Presence } from '@tamagui/animate-presence'
import { createCollection } from '@tamagui/collection'
import {
  Dismissable as DismissableLayer,
  dispatchDiscreteCustomEvent,
} from '@tamagui/dismissable'
import { useFocusGuards } from '@tamagui/focus-guard'
import { FocusScope } from '@tamagui/focus-scope'
import type { PopperContentProps } from '@tamagui/popper'
import * as PopperPrimitive from '@tamagui/popper'
import { needsPortalRepropagation, Portal as PortalPrimitive } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import type { RovingFocusGroupProps } from '@tamagui/roving-focus'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { useCallbackRef } from '@tamagui/use-callback-ref'
import { useDirection } from '@tamagui/use-direction'
import type { TextProps } from '@tamagui/web'
import {
  type ViewProps,
  composeEventHandlers,
  composeRefs,
  createStyledContext,
  isWeb,
  styled,
  Text,
  Theme,
  useComposedRefs,
  useIsTouchDevice,
  useThemeName,
  View,
  withStaticProperties,
} from '@tamagui/web'
import type { TamaguiElement } from '@tamagui/web/types'
import * as React from 'react'
import { useId } from 'react'
import type { Image, ImageProps } from 'react-native'

import { MenuPredefined } from './MenuPredefined'

type Direction = 'ltr' | 'rtl'

function whenMouse<E>(
  handler: React.PointerEventHandler<E>
): React.PointerEventHandler<E> {
  return (event) => (event.pointerType === 'mouse' ? handler(event) : undefined)
}

const SELECTION_KEYS = ['Enter', ' ']
const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home']
const LAST_KEYS = ['ArrowUp', 'PageDown', 'End']
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS]
const SUB_OPEN_KEYS: Record<Direction, string[]> = {
  ltr: [...SELECTION_KEYS, 'ArrowRight'],
  rtl: [...SELECTION_KEYS, 'ArrowLeft'],
}
const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowLeft'],
  rtl: ['ArrowRight'],
}

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const MENU_NAME = 'Menu'

type ItemData = { disabled: boolean; textValue: string }

type ScopedProps<P> = P & { scope?: string }

type MenuContextValue = {
  open: boolean
  onOpenChange(open: boolean): void
  content: MenuContentElement | null
  onContentChange(content: MenuContentElement | null): void
}

type MenuRootContextValue = {
  open: boolean
  onClose(): void
  isUsingKeyboardRef: React.RefObject<boolean>
  dir: Direction
  modal: boolean
}

interface MenuBaseProps extends PopperPrimitive.PopperProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?(open: boolean): void
  dir?: Direction
  modal?: boolean
  native?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * MenuAnchor
 * -----------------------------------------------------------------------------------------------*/

// type MenuAnchorElement = React.ElementRef<typeof PopperPrimitive.PopperAnchor>
type PopperAnchorProps = React.ComponentPropsWithoutRef<
  typeof PopperPrimitive.PopperAnchor
>
interface MenuAnchorProps extends PopperAnchorProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuPortal
 * -----------------------------------------------------------------------------------------------*/

type PortalContextValue = { forceMount?: boolean }

interface MenuPortalProps {
  children?: React.ReactNode
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
  zIndex?: number
}

/* -------------------------------------------------------------------------------------------------
 * MenuContent
 * -----------------------------------------------------------------------------------------------*/

type MenuContentContextValue = {
  onItemEnter(event: React.PointerEvent): void
  onItemLeave(event: React.PointerEvent): void
  onTriggerLeave(event: React.PointerEvent): void
  searchRef: React.RefObject<string>
  pointerGraceTimerRef: React.MutableRefObject<number>
  onPointerGraceIntentChange(intent: GraceIntent | null): void
}

type MenuContentElement = MenuRootContentTypeElement
/**
 * We purposefully don't union MenuRootContent and MenuSubContent props here because
 * they have conflicting prop types. We agreed that we would allow MenuSubContent to
 * accept props that it would just ignore.
 */
interface MenuContentProps extends MenuRootContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

/* ---------------------------------------------------------------------------------------------- */

type MenuRootContentTypeElement = MenuContentImplElement
interface MenuRootContentTypeProps extends Omit<
  MenuContentImplProps,
  keyof MenuContentImplPrivateProps
> {}

/* ---------------------------------------------------------------------------------------------- */

type MenuContentImplElement = React.ElementRef<typeof PopperPrimitive.PopperContent>
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
type MenuContentImplPrivateProps = {
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']
  onDismiss?: DismissableLayerProps['onDismiss']
  disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']

  /**
   * Whether scrolling outside the `MenuContent` should be prevented
   * (default: `false`)
   */
  disableOutsideScroll?: boolean

  /**
   * Whether focus should be trapped within the `MenuContent`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped']

  /**
   * Whether to disable dismissing the menu when the user scrolls outside of it
   * (default: false, meaning scroll will dismiss on web)
   */
  disableDismissOnScroll?: boolean
}
interface MenuContentImplProps
  extends MenuContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']

  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: RovingFocusGroupProps['loop']

  onEntryFocus?: RovingFocusGroupProps['onEntryFocus']
  onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
  onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
  onFocusOutside?: DismissableLayerProps['onFocusOutside']
  onInteractOutside?: DismissableLayerProps['onInteractOutside']
}

type StyleableMenuContentProps = MenuContentImplProps & ViewProps

interface MenuGroupProps extends ViewProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuLabel
 * -----------------------------------------------------------------------------------------------*/

interface MenuLabelProps extends ViewProps {}

type MenuItemElement = MenuItemImplElement
interface MenuItemProps extends Omit<MenuItemImplProps, 'onSelect'> {
  onSelect?: (event: Event) => void
  unstyled?: boolean
}

type MenuItemImplElement = TamaguiElement

interface MenuItemImplProps extends ViewProps {
  disabled?: boolean
  textValue?: string
  unstyled?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * MenuItemTitle
 * -----------------------------------------------------------------------------------------------*/
interface MenuItemTitleProps extends TextProps {}
/* ---------------------------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------------------------------
 * MenuItemSubTitle
 * -----------------------------------------------------------------------------------------------*/
interface MenuItemSubTitleProps extends TextProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuItemIcon
 * -----------------------------------------------------------------------------------------------*/
type MenuItemIconProps = ViewProps

/* -------------------------------------------------------------------------------------------------
 * MenuCheckboxItem
 * -----------------------------------------------------------------------------------------------*/

type CheckedState = boolean | 'indeterminate'

interface MenuCheckboxItemProps extends MenuItemProps {
  checked?: CheckedState
  // `onCheckedChange` can never be called with `"indeterminate"` from the inside
  onCheckedChange?: (checked: boolean) => void
}

/* -------------------------------------------------------------------------------------------------
 * MenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

// type MenuRadioGroupElement = React.ElementRef<typeof MenuGroup>
interface MenuRadioGroupProps extends MenuGroupProps {
  value?: string
  onValueChange?: (value: string) => void
}

/* -------------------------------------------------------------------------------------------------
 * MenuRadioItem
 * -----------------------------------------------------------------------------------------------*/

// type MenuRadioItemElement = React.ElementRef<typeof MenuItem>
interface MenuRadioItemProps extends MenuItemProps {
  value: string
}

/* -------------------------------------------------------------------------------------------------
 * MenuItemIndicator
 * -----------------------------------------------------------------------------------------------*/

type CheckboxContextValue = { checked: CheckedState }

// type MenuItemIndicatorElement = React.ElementRef<typeof View>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof View>
interface MenuItemIndicatorProps extends PrimitiveSpanProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * MenuSeparator
 * -----------------------------------------------------------------------------------------------*/

// type MenuSeparatorElement = React.ElementRef<typeof Stack>
interface MenuSeparatorProps extends ViewProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuArrow
 * -----------------------------------------------------------------------------------------------*/

// type MenuArrowElement = React.ElementRef<typeof PopperPrimitive.PopperArrow>
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>
interface MenuArrowProps extends PopperArrowProps {
  unstyled?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * MenuSub
 * -----------------------------------------------------------------------------------------------*/

type MenuSubContextValue = {
  contentId: string
  triggerId: string
  trigger: MenuSubTriggerElement | null
  onTriggerChange(trigger: MenuSubTriggerElement | null): void
}

export interface MenuSubProps extends PopperPrimitive.PopperProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?(open: boolean): void
}

/* -------------------------------------------------------------------------------------------------
 * MenuSubTrigger
 * -----------------------------------------------------------------------------------------------*/

type MenuSubTriggerElement = MenuItemImplElement
interface MenuSubTriggerProps extends MenuItemImplProps {}

/* -------------------------------------------------------------------------------------------------
 * MenuSubContent
 * -----------------------------------------------------------------------------------------------*/

export type MenuSubContentElement = MenuContentImplElement
export interface MenuSubContentProps extends Omit<
  MenuContentImplProps,
  | keyof MenuContentImplPrivateProps
  | 'onCloseAutoFocus'
  | 'onEntryFocus'
  | 'side'
  | 'align'
> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

type Point = { x: number; y: number }
type Polygon = Point[]
type Side = 'left' | 'right'
type GraceIntent = { area: Polygon; side: Side }

/* -------------------------------------------------------------------------------------------------
 * Menu
 * -----------------------------------------------------------------------------------------------*/

const [Collection, useCollection] = createCollection<MenuItemElement, ItemData>(MENU_NAME)

const { Provider: MenuProvider, useStyledContext: useMenuContext } =
  createStyledContext<MenuContextValue>()

const { Provider: MenuRootProvider, useStyledContext: useMenuRootContext } =
  createStyledContext<MenuRootContextValue>()

const MENU_CONTEXT = 'MenuContext'

export type CreateBaseMenuProps = {
  Item?: typeof MenuPredefined.MenuItem
  MenuGroup?: typeof MenuPredefined.MenuGroup
  Title?: typeof MenuPredefined.Title
  SubTitle?: typeof MenuPredefined.SubTitle
  Image?: React.ElementType
  Icon?: typeof MenuPredefined.MenuIcon
  Indicator?: typeof MenuPredefined.MenuIndicator
  Separator?: typeof MenuPredefined.MenuSeparator
  Label?: typeof MenuPredefined.MenuLabel
}

export function createBaseMenu({
  Item: _Item = MenuPredefined.MenuItem,
  Title: _Title = MenuPredefined.Title,
  SubTitle: _SubTitle = MenuPredefined.SubTitle,
  Image: _Image = MenuPredefined.MenuImage,
  Icon: _Icon = MenuPredefined.MenuIcon,
  Indicator: _Indicator = MenuPredefined.MenuIndicator,
  Separator: _Separator = MenuPredefined.MenuSeparator,
  MenuGroup: _MenuGroup = MenuPredefined.MenuGroup,
  Label: _Label = MenuPredefined.MenuLabel,
}: CreateBaseMenuProps) {
  const MenuComp = (props: ScopedProps<MenuBaseProps>) => {
    const direction = useDirection(props.dir)
    // default placement: bottom-start for LTR, bottom-end for RTL
    const defaultPlacement = direction === 'rtl' ? 'bottom-end' : 'bottom-start'
    const {
      scope = MENU_CONTEXT,
      open = false,
      children,
      dir,
      onOpenChange,
      modal = true,
      allowFlip = { padding: 10 },
      stayInFrame = { padding: 10 },
      placement = defaultPlacement,
      ...rest
    } = props
    const [content, setContent] = React.useState<MenuContentElement | null>(null)
    const isUsingKeyboardRef = React.useRef(false)
    const handleOpenChange = useCallbackRef(onOpenChange)

    if (isWeb) {
      React.useEffect(() => {
        // Capture phase ensures we set the boolean before any side effects execute
        // in response to the key or pointer event as they might depend on this value.

        const handleKeyDown = () => {
          isUsingKeyboardRef.current = true
          document.addEventListener('pointerdown', handlePointer, {
            capture: true,
            once: true,
          })
          document.addEventListener('pointermove', handlePointer, {
            capture: true,
            once: true,
          })
        }
        const handlePointer = () => (isUsingKeyboardRef.current = false)
        document.addEventListener('keydown', handleKeyDown, { capture: true })
        return () => {
          document.removeEventListener('keydown', handleKeyDown, { capture: true })
          document.removeEventListener('pointerdown', handlePointer, { capture: true })
          document.removeEventListener('pointermove', handlePointer, { capture: true })
        }
      }, [])
    }

    return (
      <PopperPrimitive.Popper
        scope={scope}
        placement={placement}
        allowFlip={allowFlip}
        stayInFrame={stayInFrame}
        {...rest}
      >
        <MenuProvider
          scope={scope}
          open={open}
          onOpenChange={handleOpenChange}
          content={content}
          onContentChange={setContent}
        >
          <MenuRootProvider
            scope={scope}
            open={open}
            onClose={React.useCallback(() => handleOpenChange(false), [handleOpenChange])}
            isUsingKeyboardRef={isUsingKeyboardRef}
            dir={direction}
            modal={modal}
          >
            {/** this provider is just to avoid crashing when using useSubMenuContext() inside MenuPortal */}
            <MenuSubProvider scope={scope}>{children}</MenuSubProvider>
          </MenuRootProvider>
        </MenuProvider>
      </PopperPrimitive.Popper>
    )
  }

  const RepropagateMenuAndMenuRootProvider = (
    props: ScopedProps<{
      menuContext: any
      rootContext: any
      popperContext: any
      menuSubContext: any
      children: React.ReactNode
    }>
  ) => {
    const {
      scope = MENU_CONTEXT,
      menuContext,
      rootContext,
      popperContext,
      menuSubContext,
      children,
    } = props

    return (
      <PopperPrimitive.PopperProvider {...popperContext} scope={scope}>
        <MenuProvider scope={scope} {...menuContext}>
          <MenuRootProvider scope={scope} {...rootContext}>
            {menuSubContext ? (
              <MenuSubProvider scope={scope} {...menuSubContext}>
                {children}
              </MenuSubProvider>
            ) : (
              children
            )}
          </MenuRootProvider>
        </MenuProvider>
      </PopperPrimitive.PopperProvider>
    )
  }

  MenuComp.displayName = MENU_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuAnchor
   * -----------------------------------------------------------------------------------------------*/

  const ANCHOR_NAME = 'MenuAnchor'

  const MenuAnchor = (props: MenuAnchorProps) => {
    return <PopperPrimitive.PopperAnchor scope={MENU_CONTEXT} {...props} />
  }

  MenuAnchor.displayName = ANCHOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuPortal
   * -----------------------------------------------------------------------------------------------*/

  const PORTAL_NAME = 'MenuPortal'

  const { Provider: PortalProvider, useStyledContext: usePortalContext } =
    createStyledContext<PortalContextValue>(undefined, 'Portal')

  const MenuPortal = (props: ScopedProps<MenuPortalProps>) => {
    const { scope = MENU_CONTEXT, forceMount, zIndex, children } = props
    const menuContext = useMenuContext(scope)
    const rootContext = useMenuRootContext(scope)
    const popperContext = PopperPrimitive.usePopperContext(scope)
    const menuSubContext = useMenuSubContext(scope)
    const themeName = useThemeName()

    const themedChildren = (
      <Theme forceClassName name={themeName}>
        {children}
      </Theme>
    )

    const content = needsPortalRepropagation() ? (
      <RepropagateMenuAndMenuRootProvider
        menuContext={menuContext}
        rootContext={rootContext}
        popperContext={popperContext}
        menuSubContext={menuSubContext}
        scope={scope}
      >
        {themedChildren}
      </RepropagateMenuAndMenuRootProvider>
    ) : (
      themedChildren
    )

    // For submenus, we need to check if the root menu is still open
    // If root closes, submenu should close immediately (no exit animation)
    const isPresent = forceMount || (rootContext.open && menuContext.open)

    return (
      <Animate type="presence" present={isPresent}>
        <PortalPrimitive>
          <>
            <PortalProvider scope={scope} forceMount={forceMount}>
              <View zIndex={zIndex || 100} inset={0} position="absolute">
                {!!menuContext.open && !isWeb && (
                  <View
                    inset={0}
                    position="absolute"
                    onPress={() => menuContext.onOpenChange(!menuContext.open)}
                  />
                )}
                {content}
              </View>
            </PortalProvider>
          </>
        </PortalPrimitive>
      </Animate>
    )
  }

  MenuPortal.displayName = PORTAL_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuContent
   * -----------------------------------------------------------------------------------------------*/

  const CONTENT_NAME = 'MenuContent'

  const { Provider: MenuContentProvider, useStyledContext: useMenuContentContext } =
    createStyledContext<MenuContentContextValue>()

  const MenuContentFrame = styled(PopperPrimitive.PopperContentFrame, {
    name: CONTENT_NAME,
  })

  const MenuContent = MenuContentFrame.styleable<ScopedProps<MenuContentProps>>(
    (props, forwardedRef) => {
      const scope = props.scope || MENU_CONTEXT
      const portalContext = usePortalContext(scope)
      const { forceMount = portalContext.forceMount, ...contentProps } = props
      const rootContext = useMenuRootContext(scope)

      return (
        <Collection.Provider scope={scope}>
          <Collection.Slot scope={scope}>
            {rootContext.modal ? (
              <MenuRootContentModal {...contentProps} ref={forwardedRef} />
            ) : (
              <MenuRootContentNonModal {...contentProps} ref={forwardedRef} />
            )}
          </Collection.Slot>
        </Collection.Provider>
      )
    }
  )

  /* ---------------------------------------------------------------------------------------------- */

  const MenuRootContentModal = React.forwardRef<
    MenuRootContentTypeElement,
    ScopedProps<MenuRootContentTypeProps>
  >((props, forwardedRef) => {
    const scope = props.scope || MENU_CONTEXT
    const context = useMenuContext(scope)
    const ref = React.useRef<MenuRootContentTypeElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    // Hide everything from ARIA except the `MenuContent`
    // React.useEffect(() => {
    //   const content = ref.current
    //   // FIXME: find a solution for native
    //   if (content && isWeb) return hideOthers(content as HTMLElement)
    // }, [])

    return (
      <MenuContentImpl
        {...props}
        scope={scope}
        ref={composedRefs}
        // we make sure we're not trapping once it's been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        // make sure to only disable pointer events when open
        // this avoids blocking interactions while animating out
        disableOutsidePointerEvents={context.open}
        disableOutsideScroll={false}
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(
          props.onFocusOutside,
          (event: Event) => event.preventDefault(),
          { checkDefaultPrevented: false }
        )}
        onDismiss={() => context.onOpenChange(false)}
      />
    )
  })

  const MenuRootContentNonModal = React.forwardRef<
    MenuRootContentTypeElement,
    ScopedProps<MenuRootContentTypeProps>
  >((props, forwardedRef) => {
    const scope = props.scope || MENU_CONTEXT
    const context = useMenuContext(scope)
    return (
      <MenuContentImpl
        {...props}
        scope={scope}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        disableOutsideScroll={false}
        onDismiss={() => context.onOpenChange(false)}
      />
    )
  })

  const MenuContentImpl = React.forwardRef<
    MenuContentImplElement,
    ScopedProps<StyleableMenuContentProps>
  >((props, forwardedRef) => {
    const {
      scope = MENU_CONTEXT,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      disableDismissOnScroll = false,
      unstyled = process.env.TAMAGUI_HEADLESS === '1',
      ...contentProps
    } = props

    const context = useMenuContext(scope)
    const rootContext = useMenuRootContext(scope)
    const getItems = useCollection(scope)
    const [currentItemId, setCurrentItemId] = React.useState<string | null>(null)
    const contentRef = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(
      forwardedRef,
      contentRef,
      context.onContentChange
    )
    const timerRef = React.useRef<NodeJS.Timeout>(0 as unknown as NodeJS.Timeout)
    const searchRef = React.useRef('')
    const pointerGraceTimerRef = React.useRef(0)
    const pointerGraceIntentRef = React.useRef<GraceIntent | null>(null)
    const pointerDirRef = React.useRef<Side>('right')
    const lastPointerXRef = React.useRef(0)

    const handleTypeaheadSearch = (key: string) => {
      const search = searchRef.current + key
      const items = getItems().filter((item) => !item.disabled)
      const currentItem = document.activeElement
      const currentMatch = items.find(
        (item) => item.ref.current === currentItem
      )?.textValue
      const values = items.map((item) => item.textValue)
      const nextMatch = getNextMatch(values, search, currentMatch)
      const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current

      // Reset `searchRef` 1 second after it was last updated
      ;(function updateSearch(value: string) {
        searchRef.current = value
        clearTimeout(timerRef.current)
        if (value !== '') timerRef.current = setTimeout(() => updateSearch(''), 1000)
      })(search)

      if (newItem) {
        /**
         * Imperative focus during keydown is risky so we prevent React's batching updates
         * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
         */
        setTimeout(() => (newItem as HTMLElement).focus())
      }
    }

    React.useEffect(() => {
      return () => clearTimeout(timerRef.current)
    }, [])

    // dismiss on scroll (web only)
    React.useEffect(() => {
      if (!isWeb || disableDismissOnScroll || !context.open) return
      const handleScroll = () => {
        onDismiss?.()
      }
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll, { capture: true })
      }
    }, [disableDismissOnScroll, context.open, onDismiss])

    // Make sure the whole tree has focus guards as our `MenuContent` may be
    // the last element in the DOM (beacuse of the `Portal`)
    if (isWeb) {
      useFocusGuards()
    }

    const isPointerMovingToSubmenu = React.useCallback((event: React.PointerEvent) => {
      const isMovingTowards =
        pointerDirRef.current === pointerGraceIntentRef.current?.side
      const inArea = isPointerInGraceArea(event, pointerGraceIntentRef.current?.area)
      return isMovingTowards && inArea
    }, [])

    const content = (
      <PopperPrimitive.PopperContent
        role="menu"
        unstyled={unstyled}
        {...(!unstyled && {
          padding: 4,
          backgroundColor: '$background',
          borderWidth: 1,
          borderColor: '$borderColor',
          outlineWidth: 0,
          minWidth: 180,
        })}
        aria-orientation="vertical"
        data-state={getOpenState(context.open)}
        data-tamagui-menu-content=""
        // TODO
        // @ts-ignore
        dir={rootContext.dir}
        scope={scope || MENU_CONTEXT}
        {...contentProps}
        ref={composedRefs}
        className={contentProps.transition ? undefined : contentProps.className}
        {...(isWeb
          ? {
              onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                // submenu key events bubble through portals. We only care about keys in this menu.
                const target = event.target as HTMLElement
                const isKeyDownInside =
                  target.closest('[data-tamagui-menu-content]') === event.currentTarget
                const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
                const isCharacterKey = event.key.length === 1
                if (isKeyDownInside) {
                  // menus should not be navigated using tab key so we prevent it
                  if (event.key === 'Tab') event.preventDefault()
                  if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key)
                }
                // focus first/last item based on key pressed when on THIS menu's content frame
                // isKeyDownInside ensures we only handle keys for this menu, not bubbled from submenus
                // isOnContentFrame ensures we only handle when focused on the content frame, not an item
                const isOnContentFrame = (event.target as HTMLElement).hasAttribute(
                  'data-tamagui-menu-content'
                )
                if (!isKeyDownInside || !isOnContentFrame) return
                if (!FIRST_LAST_KEYS.includes(event.key)) return
                event.preventDefault()
                const items = getItems().filter((item) => !item.disabled)
                const candidateNodes = items.map((item) => item.ref.current!)
                if (LAST_KEYS.includes(event.key)) candidateNodes.reverse()
                focusFirst(candidateNodes as HTMLElement[], { focusVisible: true })
              }),
              // TODO
              // @ts-ignore
              onBlur: composeEventHandlers(props.onBlur, (event: React.FocusEvent) => {
                // clear search buffer when leaving the menu
                // @ts-ignore
                if (!event.currentTarget?.contains(event.target)) {
                  clearTimeout(timerRef.current)
                  searchRef.current = ''
                }
              }),
              // TODO
              onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
                if (event.pointerType !== 'mouse') return
                const target = event.target as HTMLElement
                const pointerXHasChanged = lastPointerXRef.current !== event.clientX

                // We don't use `event.movementX` for this check because Safari will
                // always return `0` on a pointer event.
                // @ts-ignore
                if (event.currentTarget?.contains(target) && pointerXHasChanged) {
                  const newDir =
                    event.clientX > lastPointerXRef.current ? 'right' : 'left'
                  pointerDirRef.current = newDir
                  lastPointerXRef.current = event.clientX
                }
              }),
            }
          : {})}
      />
    )

    return (
      <MenuContentProvider
        scope={scope}
        searchRef={searchRef}
        onItemEnter={React.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault()
          },
          [isPointerMovingToSubmenu]
        )}
        onItemLeave={React.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) return
            contentRef.current?.focus()
            setCurrentItemId(null)
          },
          [isPointerMovingToSubmenu]
        )}
        onTriggerLeave={React.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault()
          },
          [isPointerMovingToSubmenu]
        )}
        pointerGraceTimerRef={pointerGraceTimerRef}
        onPointerGraceIntentChange={React.useCallback((intent) => {
          pointerGraceIntentRef.current = intent
        }, [])}
      >
        <RemoveScroll enabled={disableOutsideScroll}>
          <FocusScope
            asChild={false}
            trapped={trapFocus}
            onMountAutoFocus={composeEventHandlers(onOpenAutoFocus, (event) => {
              // when opening, explicitly focus the content area only and leave
              // `onEntryFocus` in control of focusing first item
              event.preventDefault()
              // contentRef.current doesn't reliably point to the focusable DOM element
              // due to how refs propagate through Tamagui's styled component chain,
              // so we query for the element directly using the data attribute
              const content = document.querySelector(
                '[data-tamagui-menu-content]'
              ) as HTMLElement | null
              content?.focus()
            })}
            onUnmountAutoFocus={onCloseAutoFocus}
          >
            <DismissableLayer
              disableOutsidePointerEvents={disableOutsidePointerEvents}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onFocusOutside={onFocusOutside}
              onInteractOutside={onInteractOutside}
              onDismiss={onDismiss}
              asChild
            >
              <RovingFocusGroup
                asChild
                __scopeRovingFocusGroup={scope || MENU_CONTEXT}
                dir={rootContext.dir}
                orientation="vertical"
                loop={loop}
                currentTabStopId={currentItemId}
                onCurrentTabStopIdChange={setCurrentItemId}
                onEntryFocus={composeEventHandlers(onEntryFocus, (event) => {
                  // for keyboard users, focus first item for immediate navigation
                  // for mouse users, prevent auto-focus to avoid showing focus style
                  if (!rootContext.isUsingKeyboardRef.current) {
                    event.preventDefault()
                  }
                })}
              >
                {content}
              </RovingFocusGroup>
            </DismissableLayer>
          </FocusScope>
        </RemoveScroll>
      </MenuContentProvider>
    )
  })

  MenuContent.displayName = CONTENT_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItem
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_NAME = 'MenuItem'
  const ITEM_SELECT = 'menu.itemSelect'

  const MenuItem = React.forwardRef<TamaguiElement, ScopedProps<MenuItemProps>>(
    (props, forwardedRef) => {
      const {
        disabled = false,
        onSelect,
        children,
        scope = MENU_CONTEXT,
        // filter out native-only props that shouldn't reach the DOM
        // @ts-ignore
        destructive,
        // @ts-ignore
        hidden,
        // @ts-ignore
        androidIconName,
        // @ts-ignore
        iosIconName,
        ...itemProps
      } = props
      const ref = React.useRef<TamaguiElement>(null)
      const rootContext = useMenuRootContext(scope)
      const contentContext = useMenuContentContext(scope)
      const composedRefs = useComposedRefs(forwardedRef, ref)
      const isPointerDownRef = React.useRef(false)

      const handleSelect = () => {
        const menuItem = ref.current
        if (!disabled && menuItem) {
          if (isWeb) {
            const menuItemEl = menuItem as HTMLElement
            const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
              bubbles: true,
              cancelable: true,
            })
            menuItemEl.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), {
              once: true,
            })
            dispatchDiscreteCustomEvent(menuItemEl, itemSelectEvent)
            if (itemSelectEvent.defaultPrevented) {
              isPointerDownRef.current = false
            } else {
              rootContext.onClose()
            }
          } else {
            // TODO: find a better way to handle this on native
            onSelect?.({ target: menuItem } as unknown as Event)
            isPointerDownRef.current = false
            rootContext.onClose()
          }
        }
      }

      const content = typeof children === 'string' ? <Text>{children}</Text> : children

      return (
        <MenuItemImpl
          outlineStyle="none"
          {...itemProps}
          scope={scope}
          // @ts-ignore
          ref={composedRefs}
          disabled={disabled}
          onPress={composeEventHandlers(props.onPress, handleSelect)}
          onPointerDown={(event) => {
            props.onPointerDown?.(event)
            isPointerDownRef.current = true
          }}
          onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
            // Pointer down can move to a different menu item which should activate it on pointer up.
            // We dispatch a click for selection to allow composition with click based triggers and to
            // prevent Firefox from getting stuck in text selection mode when the menu closes.
            if (isWeb) {
              // @ts-ignore
              if (!isPointerDownRef.current) event.currentTarget?.click()
            }
          })}
          {...(isWeb
            ? {
                onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                  const isTypingAhead = contentContext.searchRef.current !== ''
                  if (disabled || (isTypingAhead && event.key === ' ')) return
                  if (SELECTION_KEYS.includes(event.key)) {
                    // @ts-ignore
                    event.currentTarget?.click()
                    /**
                     * We prevent default browser behaviour for selection keys as they should trigger
                     * a selection only:
                     * - prevents space from scrolling the page.
                     * - if keydown causes focus to move, prevents keydown from firing on the new target.
                     */
                    event.preventDefault()
                  }
                }),
              }
            : {})}
        >
          {content}
        </MenuItemImpl>
      )
    }
  )

  const MenuItemImpl = React.forwardRef<
    MenuItemImplElement,
    ScopedProps<MenuItemImplProps>
  >((props, forwardedRef) => {
    const {
      scope = MENU_CONTEXT,
      disabled = false,
      textValue,
      unstyled = process.env.TAMAGUI_HEADLESS === '1',
      ...itemProps
    } = props
    const contentContext = useMenuContentContext(scope)
    const ref = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const [isFocused, setIsFocused] = React.useState(false)

    // get the item's `.textContent` as default strategy for typeahead `textValue`
    const [textContent, setTextContent] = React.useState('')
    if (isWeb) {
      React.useEffect(() => {
        const menuItem = ref.current
        if (menuItem) {
          // @ts-ignore
          setTextContent((menuItem.textContent ?? '').trim())
        }
      }, [itemProps.children])
    }

    return (
      <Collection.ItemSlot
        scope={scope}
        disabled={disabled}
        textValue={textValue ?? textContent}
      >
        <RovingFocusGroup.Item
          asChild
          __scopeRovingFocusGroup={scope}
          focusable={!disabled}
          {...(!unstyled && {
            flexDirection: 'row',
            alignItems: 'center',
          })}
          {...itemProps}
        >
          <_Item
            unstyled={unstyled}
            componentName={ITEM_NAME}
            role="menuitem"
            data-highlighted={isFocused ? '' : undefined}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            {...itemProps}
            ref={composedRefs}
            /**
             * We focus items on `pointerMove` to achieve the following:
             *
             * - Mouse over an item (it focuses)
             * - Leave mouse where it is and use keyboard to focus a different item
             * - Wiggle mouse without it leaving previously focused item
             * - Previously focused item should re-focus
             *
             * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
             * wiggles. This is to match native menu implementation.
             */
            onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
              if (event.pointerType !== 'mouse') return

              if (disabled) {
                // @ts-ignore
                contentContext.onItemLeave(event)
              } else {
                // @ts-ignore
                contentContext.onItemEnter(event)
                if (!event.defaultPrevented) {
                  const item = event.currentTarget as HTMLElement
                  // @ts-ignore focusVisible is a newer API
                  item.focus({ preventScroll: true, focusVisible: false })
                }
              }
            })}
            onPointerLeave={composeEventHandlers(props.onPointerLeave, (event) => {
              contentContext.onItemLeave(event as any)
            })}
            onFocus={composeEventHandlers(props.onFocus, () => setIsFocused(true))}
            onBlur={composeEventHandlers(props.onBlur, () => setIsFocused(false))}
          />
        </RovingFocusGroup.Item>
      </Collection.ItemSlot>
    )
  })

  MenuItem.displayName = ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemTitle
   * -----------------------------------------------------------------------------------------------*/
  const ITEM_TITLE_NAME = 'MenuItemTitle'
  const MenuItemTitle = _Title.styleable<MenuItemTitleProps>((props, forwardedRef) => {
    return <_Title {...props} ref={forwardedRef} />
  })

  MenuItemTitle.displayName = ITEM_TITLE_NAME
  /* ---------------------------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------------------------------
   * MenuItemSubTitle
   * -----------------------------------------------------------------------------------------------*/
  const ITEM_SUB_TITLE_NAME = 'MenuItemSubTitle'
  const MenuItemSubTitle = _SubTitle.styleable<MenuItemSubTitleProps>(
    (props, forwardedRef) => {
      return <_SubTitle {...props} ref={forwardedRef} />
    }
  )

  MenuItemSubTitle.displayName = ITEM_SUB_TITLE_NAME

  /* ---------------------------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------------------------------
   * MenuItemImage
   * -----------------------------------------------------------------------------------------------*/
  const ITEM_IMAGE = 'MenuItemImage'
  const MenuItemImage = React.forwardRef<Image, ImageProps>((props, forwardedRef) => {
    // filter out native-only props that shouldn't reach the DOM
    const {
      // @ts-ignore - native menu ios config
      ios,
      // @ts-ignore
      androidIconName,
      // @ts-ignore
      iosIconName,
      ...rest
    } = props
    return <_Image {...rest} ref={forwardedRef} />
  })

  MenuItemImage.displayName = ITEM_IMAGE

  /* ---------------------------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------------------------------
   * MenuItemIcon
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_ICON = 'MenuItemIcon'
  const MenuItemIcon = _Icon.styleable<MenuItemIconProps>((props, forwardedRef) => {
    // filter out native-only props that shouldn't reach the DOM
    const {
      // @ts-ignore
      ios,
      // @ts-ignore
      android,
      // @ts-ignore
      androidIconName,
      // @ts-ignore
      iosIconName,
      ...rest
    } = props
    return <_Icon {...rest} ref={forwardedRef} />
  })

  MenuItemIcon.displayName = ITEM_ICON

  /* ---------------------------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------------------------------
   * MenuCheckboxItem
   * -----------------------------------------------------------------------------------------------*/

  const CHECKBOX_ITEM_NAME = 'MenuCheckboxItem'

  const MenuCheckboxItem = React.forwardRef<
    TamaguiElement,
    ScopedProps<MenuCheckboxItemProps>
  >((props, forwardedRef) => {
    const {
      checked = false,
      onCheckedChange,
      scope = MENU_CONTEXT,
      // filter out native-only props
      // @ts-ignore - native menu value state
      value,
      // @ts-ignore - native menu value change handler
      onValueChange,
      ...checkboxItemProps
    } = props
    return (
      <ItemIndicatorProvider scope={scope} checked={checked}>
        <MenuItem
          componentName={CHECKBOX_ITEM_NAME}
          role={(isWeb ? 'menuitemcheckbox' : 'menuitem') as 'menuitem'}
          aria-checked={isIndeterminate(checked) ? 'mixed' : checked}
          {...checkboxItemProps}
          scope={scope}
          ref={forwardedRef}
          data-state={getCheckedState(checked)}
          onSelect={composeEventHandlers(
            checkboxItemProps.onSelect,
            () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked),
            { checkDefaultPrevented: false }
          )}
        />
      </ItemIndicatorProvider>
    )
  })

  MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME
  /* -------------------------------------------------------------------------------------------------
   * MenuRadioGroup
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_GROUP_NAME = 'MenuRadioGroup'

  const { Provider: RadioGroupProvider, useStyledContext: useRadioGroupContext } =
    createStyledContext<MenuRadioGroupProps>()

  const MenuRadioGroup = _MenuGroup.styleable<ScopedProps<MenuRadioGroupProps>>(
    (props, forwardedRef) => {
      const { value, onValueChange, scope = MENU_CONTEXT, ...groupProps } = props
      const handleValueChange = useCallbackRef(onValueChange)
      return (
        <RadioGroupProvider scope={scope} value={value} onValueChange={handleValueChange}>
          <_MenuGroup
            componentName={RADIO_GROUP_NAME}
            {...groupProps}
            ref={forwardedRef}
          />
        </RadioGroupProvider>
      )
    }
  )

  MenuRadioGroup.displayName = RADIO_GROUP_NAME
  /* -------------------------------------------------------------------------------------------------
   * MenuRadioItem
   * -----------------------------------------------------------------------------------------------*/

  const RADIO_ITEM_NAME = 'MenuRadioItem'

  const MenuRadioItem = React.forwardRef<TamaguiElement, ScopedProps<MenuRadioItemProps>>(
    (props, forwardedRef) => {
      const { value, scope = MENU_CONTEXT, ...radioItemProps } = props
      const context = useRadioGroupContext(scope)
      const checked = value === context.value
      return (
        <ItemIndicatorProvider scope={scope} checked={checked}>
          <MenuItem
            componentName={RADIO_ITEM_NAME}
            {...radioItemProps}
            scope={scope}
            aria-checked={checked}
            ref={forwardedRef}
            role={(isWeb ? 'menuitemradio' : 'menuitem') as 'menuitem'}
            data-state={getCheckedState(checked)}
            onSelect={composeEventHandlers(
              radioItemProps.onSelect,
              () => context.onValueChange?.(value),
              { checkDefaultPrevented: false }
            )}
          />
        </ItemIndicatorProvider>
      )
    }
  )

  MenuRadioItem.displayName = RADIO_ITEM_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuItemIndicator
   * -----------------------------------------------------------------------------------------------*/

  const ITEM_INDICATOR_NAME = 'MenuItemIndicator'

  const { Provider: ItemIndicatorProvider, useStyledContext: useItemIndicatorContext } =
    createStyledContext<CheckboxContextValue>()

  const MenuItemIndicator = _Indicator.styleable<ScopedProps<MenuItemIndicatorProps>>(
    (props, forwardedRef) => {
      const { scope = MENU_CONTEXT, forceMount, ...itemIndicatorProps } = props
      const indicatorContext = useItemIndicatorContext(scope)
      return (
        <Presence>
          {forceMount ||
          isIndeterminate(indicatorContext.checked) ||
          indicatorContext.checked === true ? (
            <_Indicator
              componentName={ITEM_INDICATOR_NAME}
              render="span"
              {...itemIndicatorProps}
              ref={forwardedRef}
              data-state={getCheckedState(indicatorContext.checked)}
            />
          ) : null}
        </Presence>
      )
    }
  )

  MenuItemIndicator.displayName = ITEM_INDICATOR_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuArrow
   * -----------------------------------------------------------------------------------------------*/

  // TODO this was styleable but it cant flatten anyways so likely fine just need to check
  const MenuArrow = React.forwardRef<TamaguiElement, MenuArrowProps>(
    function MenuArrow(props, forwardedRef) {
      const {
        scope = MENU_CONTEXT,
        unstyled = process.env.TAMAGUI_HEADLESS === '1',
        ...rest
      } = props
      return (
        <PopperPrimitive.PopperArrow
          scope={scope}
          componentName="PopperArrow"
          unstyled={unstyled}
          {...(!unstyled && {
            backgroundColor: '$background',
          })}
          {...rest}
          ref={forwardedRef}
        />
      )
    }
  )

  /* -------------------------------------------------------------------------------------------------
   * MenuSub
   * -----------------------------------------------------------------------------------------------*/

  const SUB_NAME = 'MenuSub'

  const { Provider: MenuSubProvider, useStyledContext: useMenuSubContext } =
    createStyledContext<MenuSubContextValue>()

  const MenuSub: React.FC<ScopedProps<MenuSubProps>> = (props) => {
    const isTouchDevice = useIsTouchDevice()
    const { scope = MENU_CONTEXT } = props
    const rootContext = useMenuRootContext(scope)
    // default placement: bottom on touch, right-start/left-start based on RTL on desktop
    const defaultPlacement = isTouchDevice
      ? 'bottom'
      : rootContext.dir === 'rtl'
        ? 'left-start'
        : 'right-start'
    const {
      children,
      open = false,
      onOpenChange,
      allowFlip = { padding: 10 },
      stayInFrame = { padding: 10 },
      placement = defaultPlacement,
      ...rest
    } = props
    const parentMenuContext = useMenuContext(scope)
    const [trigger, setTrigger] = React.useState<MenuSubTriggerElement | null>(null)
    const [content, setContent] = React.useState<MenuContentElement | null>(null)
    const handleOpenChange = useCallbackRef(onOpenChange)

    // Prevent the parent menu from reopening with open submenus.
    React.useEffect(() => {
      if (parentMenuContext.open === false) handleOpenChange(false)
      return () => handleOpenChange(false)
    }, [parentMenuContext.open, handleOpenChange])

    return (
      <PopperPrimitive.Popper
        placement={placement}
        allowFlip={allowFlip}
        stayInFrame={stayInFrame}
        {...rest}
        scope={scope}
      >
        <MenuProvider
          scope={scope}
          open={open}
          onOpenChange={handleOpenChange}
          content={content}
          onContentChange={setContent}
        >
          <MenuSubProvider
            scope={scope}
            contentId={useId()}
            triggerId={useId()}
            trigger={trigger}
            onTriggerChange={setTrigger}
          >
            {children}
          </MenuSubProvider>
        </MenuProvider>
      </PopperPrimitive.Popper>
    )
  }

  MenuSub.displayName = SUB_NAME
  /* -------------------------------------------------------------------------------------------------
   * MenuSubTrigger
   * -----------------------------------------------------------------------------------------------*/

  const SUB_TRIGGER_NAME = 'MenuSubTrigger'

  const MenuSubTrigger = React.forwardRef<
    TamaguiElement,
    ScopedProps<MenuSubTriggerProps>
  >((props, forwardedRef) => {
    const scope = props.scope || MENU_CONTEXT
    const context = useMenuContext(scope)
    const rootContext = useMenuRootContext(scope)
    const subContext = useMenuSubContext(scope)
    const contentContext = useMenuContentContext(scope)
    const popperContext = PopperPrimitive.usePopperContext(scope)
    const openTimerRef = React.useRef<number | null>(null)
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext

    // determine effective direction for keyboard navigation based on placement
    // if submenu opens to the left, arrow keys should be flipped
    const placementSide = popperContext.placement?.split('-')[0]
    const effectiveDir: Direction =
      placementSide === 'left'
        ? 'rtl'
        : placementSide === 'right'
          ? 'ltr'
          : rootContext.dir

    const clearOpenTimer = React.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }, [])

    React.useEffect(() => clearOpenTimer, [clearOpenTimer])

    React.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current
      return () => {
        window.clearTimeout(pointerGraceTimer)
        onPointerGraceIntentChange(null)
      }
    }, [pointerGraceTimerRef, onPointerGraceIntentChange])

    return (
      <MenuAnchor componentName={SUB_TRIGGER_NAME} asChild="except-style" scope={scope}>
        <MenuItemImpl
          id={subContext.triggerId}
          aria-haspopup="menu"
          aria-expanded={context.open}
          aria-controls={subContext.contentId}
          data-state={getOpenState(context.open)}
          outlineStyle="none"
          {...props}
          ref={composeRefs(forwardedRef, subContext.onTriggerChange)}
          // This is redundant for mouse users but we cannot determine pointer type from
          // click event and we cannot use pointerup event (see git history for reasons why)
          onPress={(event) => {
            props.onPress?.(event)
            if (props.disabled || event.defaultPrevented) return
            /**
             * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
             * and we rely heavily on `onFocusOutside` for submenus to close when switching
             * between separate submenus.
             */
            if (isWeb) {
              event.currentTarget.focus()
            }
            if (!context.open) context.onOpenChange(true)
          }}
          onPointerMove={composeEventHandlers(
            props.onPointerMove,
            // @ts-ignore
            whenMouse((event: PointerEvent<Element>) => {
              contentContext.onItemEnter(event)
              if (event.defaultPrevented) return
              if (!props.disabled && !context.open && !openTimerRef.current) {
                contentContext.onPointerGraceIntentChange(null)
                openTimerRef.current = window.setTimeout(() => {
                  context.onOpenChange(true)
                  clearOpenTimer()
                }, 100)
              }
            })
          )}
          onPointerLeave={composeEventHandlers(props.onPointerLeave, (eventIn) => {
            const event = eventIn as any as React.PointerEvent

            clearOpenTimer()

            /**
             * SafePolygon Implementation
             *
             * When the mouse leaves the submenu trigger, we create a "safe polygon" zone
             * that allows diagonal mouse movement toward the submenu content without
             * accidentally closing it by hovering over other menu items.
             *
             * The polygon is a 5-point shape from the current mouse position to the
             * submenu content bounds. When the mouse moves through this polygon while
             * moving toward the submenu (checked via `isPointerMovingToSubmenu`),
             * we prevent other menu items from stealing focus.
             *
             * Key requirement: The polygon needs a `side` property ('left' or 'right')
             * that indicates which direction the submenu is. This is compared against
             * the pointer movement direction - if they match and the mouse is inside
             * the polygon, `isPointerMovingToSubmenu` returns true.
             */

            // @ts-ignore
            const contentRect = context.content?.getBoundingClientRect()
            if (contentRect) {
              // Get side from data-side attribute (set by MenuSubContent)
              // This is critical - without it, side is undefined and isPointerMovingToSubmenu
              // always returns false because pointerDir === undefined is never true
              // Note: data-side is on the inner PopperContentFrame, not the outer container,
              // so we need to query for it or check child elements
              const contentEl = context.content as HTMLElement
              const sideEl = contentEl?.dataset?.side
                ? contentEl
                : contentEl?.querySelector('[data-side]')
              const side: Side =
                ((sideEl as HTMLElement)?.dataset?.side as Side) || 'right'
              const rightSide = side === 'right'
              const bleed = rightSide ? -5 : +5
              const contentNearEdge = contentRect[rightSide ? 'left' : 'right']
              const contentFarEdge = contentRect[rightSide ? 'right' : 'left']

              const polygon = {
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: event.clientX + bleed, y: event.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom },
                ],
                side,
              }
              contentContext.onPointerGraceIntentChange(polygon)

              // Clear polygon after 300ms grace period
              window.clearTimeout(pointerGraceTimerRef.current)
              pointerGraceTimerRef.current = window.setTimeout(
                () => contentContext.onPointerGraceIntentChange(null),
                300
              )
            } else if (isWeb && subContext.trigger) {
              // Fallback: Content doesn't exist yet, create polygon based on trigger position
              const triggerEl = subContext.trigger as unknown as HTMLElement
              const triggerRect = triggerEl?.getBoundingClientRect()
              if (triggerRect) {
                // determine side from popper placement, falling back to RTL direction
                const placementSide = popperContext.placement?.split('-')[0] as
                  | 'left'
                  | 'right'
                  | 'top'
                  | 'bottom'
                  | undefined
                const side: Side =
                  placementSide === 'left' || placementSide === 'right'
                    ? placementSide
                    : rootContext.dir === 'rtl'
                      ? 'left'
                      : 'right'
                const rightSide = side === 'right'
                const bleed = rightSide ? -5 : +5
                // Estimate submenu position based on trigger
                const nearEdge = rightSide ? triggerRect.right + 4 : triggerRect.left - 4
                const farEdge = rightSide ? nearEdge + 200 : nearEdge - 200

                const polygon = {
                  area: [
                    { x: event.clientX + bleed, y: event.clientY },
                    { x: nearEdge, y: triggerRect.top - 50 },
                    { x: farEdge, y: triggerRect.top - 50 },
                    { x: farEdge, y: triggerRect.bottom + 50 },
                    { x: nearEdge, y: triggerRect.bottom + 50 },
                  ],
                  side,
                }
                contentContext.onPointerGraceIntentChange(polygon)

                window.clearTimeout(pointerGraceTimerRef.current)
                pointerGraceTimerRef.current = window.setTimeout(
                  () => contentContext.onPointerGraceIntentChange(null),
                  300
                )
              }
            } else {
              contentContext.onTriggerLeave(event)
              if (event.defaultPrevented) return
              contentContext.onPointerGraceIntentChange(null)
            }
          })}
          {...(isWeb
            ? {
                onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                  const isTypingAhead = contentContext.searchRef.current !== ''
                  if (props.disabled || (isTypingAhead && event.key === ' ')) return
                  // use effectiveDir so arrow keys match the submenu's actual position
                  // (e.g., ArrowLeft opens a left-side submenu)
                  const willOpen = SUB_OPEN_KEYS[effectiveDir].includes(event.key)
                  if (willOpen) {
                    // if submenu is already open (e.g., opened via hover), focus the first item
                    if (context.open && context.content) {
                      // find and focus the first focusable item in the submenu
                      const contentEl = context.content as unknown as HTMLElement
                      const firstItem = contentEl.querySelector?.(
                        '[role="menuitem"]:not([data-disabled])'
                      ) as HTMLElement | null
                      if (firstItem) {
                        // @ts-ignore focusVisible is a newer API
                        firstItem.focus({ focusVisible: true })
                        event.preventDefault()
                        return
                      }
                    }

                    // set the popper reference for keyboard-only open
                    // (normally set on mouseEnter, see PopperAnchor)
                    const triggerEl = event.currentTarget as HTMLElement
                    popperContext.refs?.setReference(triggerEl)

                    context.onOpenChange(true)
                    // force popper to recalculate position after render
                    requestAnimationFrame(() => {
                      popperContext.update?.()
                    })
                    // The trigger may hold focus if opened via pointer interaction
                    // so we ensure content is given focus again when switching to keyboard.
                    // use focusVisible: true since this is keyboard navigation
                    // @ts-ignore focusVisible is a newer API
                    context.content?.focus({ focusVisible: true })
                    // prevent window from scrolling
                    event.preventDefault()
                  }
                }),
              }
            : null)}
        />
      </MenuAnchor>
    )
  })

  MenuSubTrigger.displayName = SUB_TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * MenuSubContent
   * -----------------------------------------------------------------------------------------------*/

  const SUB_CONTENT_NAME = 'MenuSubContent'

  const MenuSubContentFrame = styled(PopperPrimitive.PopperContentFrame, {
    name: SUB_CONTENT_NAME,
  })

  const MenuSubContent = MenuSubContentFrame.styleable<ScopedProps<MenuSubContentProps>>(
    (props, forwardedRef) => {
      const scope = props.scope || MENU_CONTEXT
      const portalContext = usePortalContext(scope)
      const { forceMount = portalContext.forceMount, ...subContentProps } = props
      const context = useMenuContext(scope)
      const rootContext = useMenuRootContext(scope)
      const subContext = useMenuSubContext(scope)
      const popperContext = PopperPrimitive.usePopperContext(scope)
      const ref = React.useRef<MenuSubContentElement>(null)
      const composedRefs = useComposedRefs(forwardedRef, ref)

      // determine side from actual placement, not just RTL direction
      // placement like "left-start" or "right-end" - extract the side
      const placementSide = popperContext.placement?.split('-')[0] as
        | 'left'
        | 'right'
        | 'top'
        | 'bottom'
        | undefined
      // for submenus, we care about horizontal placement (left/right)
      // default to 'right' for LTR, 'left' for RTL
      const dataSide: Side =
        placementSide === 'left' || placementSide === 'right'
          ? placementSide
          : rootContext.dir === 'rtl'
            ? 'left'
            : 'right'

      // effective direction for keyboard navigation - if submenu is on left, flip arrow keys
      const effectiveDir: Direction =
        placementSide === 'left'
          ? 'rtl'
          : placementSide === 'right'
            ? 'ltr'
            : rootContext.dir

      return (
        <Collection.Provider scope={scope}>
          <Collection.Slot scope={scope}>
            <MenuContentImpl
              id={subContext.contentId}
              aria-labelledby={subContext.triggerId}
              {...subContentProps}
              ref={composedRefs}
              data-side={dataSide}
              disableOutsidePointerEvents={false}
              disableOutsideScroll={false}
              trapFocus={false}
              onOpenAutoFocus={(event) => {
                // when opening a submenu, focus content for keyboard users only
                if (rootContext.isUsingKeyboardRef.current) {
                  // ref.current doesn't reliably point to the focusable DOM element,
                  // so we query for the submenu content directly
                  const content = document.querySelector(
                    '[data-tamagui-menu-content][data-side]'
                  ) as HTMLElement | null
                  content?.focus()
                }
                event.preventDefault()
              }}
              // The menu might close because of focusing another menu item in the parent menu. We
              // don't want it to refocus the trigger in that case so we handle trigger focus ourselves.
              onCloseAutoFocus={(event) => event.preventDefault()}
              onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
                // We prevent closing when the trigger is focused to avoid triggering a re-open animation
                // on pointer interaction.
                if (event.target !== subContext.trigger) context.onOpenChange(false)
              })}
              onEscapeKeyDown={composeEventHandlers(props.onEscapeKeyDown, (event) => {
                // close only this submenu, not the root menu
                context.onOpenChange(false)
                // return focus to the submenu trigger with focusVisible since this is keyboard navigation
                // @ts-ignore focusVisible is a newer API
                subContext.trigger?.focus({ focusVisible: true })
                // ensure pressing escape in submenu doesn't escape full screen mode
                event.preventDefault()
              })}
              {...(isWeb
                ? {
                    onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                      // Submenu key events bubble through portals. We only care about keys in this menu.
                      // @ts-ignore
                      const isKeyDownInside = event.currentTarget.contains(
                        event.target as HTMLElement
                      )
                      // use effectiveDir so arrow keys match the submenu's actual position
                      // (e.g., ArrowRight closes a left-side submenu)
                      const isCloseKey = SUB_CLOSE_KEYS[effectiveDir].includes(event.key)
                      if (isKeyDownInside && isCloseKey) {
                        context.onOpenChange(false)
                        // We focus manually because we prevented it in `onCloseAutoFocus`
                        // use focusVisible: true since this is keyboard navigation
                        // @ts-ignore focusVisible is a newer API
                        subContext.trigger?.focus({ focusVisible: true })
                        // prevent window from scrolling
                        event.preventDefault()
                      }
                    }),
                  }
                : null)}
            />
          </Collection.Slot>
        </Collection.Provider>
      )
    }
  )

  MenuSubContent.displayName = SUB_CONTENT_NAME

  const Anchor = MenuAnchor
  const Portal = MenuPortal
  const Content = MenuContent
  const Group = _MenuGroup.styleable<MenuGroupProps>((props, ref) => {
    return <_MenuGroup {...props} ref={ref} />
  })
  Group.displayName = 'MenuGroup'
  const Label = _Label.styleable<MenuLabelProps>((props, ref) => {
    return <_Label {...props} ref={ref} />
  })
  Label.displayName = 'MenuLabel'
  const Item = MenuItem
  const CheckboxItem = MenuCheckboxItem
  const RadioGroup = MenuRadioGroup
  const RadioItem = MenuRadioItem
  const ItemIndicator = MenuItemIndicator
  const Separator = _Separator.styleable<MenuSeparatorProps>((props, ref) => {
    return <_Separator {...props} ref={ref} />
  })
  Separator.displayName = 'MenuSeparator'
  const Arrow = MenuArrow
  const Sub = MenuSub
  const SubTrigger = MenuSubTrigger
  const SubContent = MenuSubContent
  const ItemTitle = MenuItemTitle
  const ItemSubtitle = MenuItemSubTitle
  const ItemImage = MenuItemImage
  const ItemIcon = MenuItemIcon

  const Menu = withStaticProperties(MenuComp, {
    Anchor,
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

  return {
    Menu,
  }
}

/* -----------------------------------------------------------------------------------------------*/

function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

function getCheckedState(checked: CheckedState) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

function focusFirst(candidates: HTMLElement[], options?: { focusVisible?: boolean }) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement
  for (const candidate of candidates) {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return
    // @ts-ignore focusVisible is a newer API not yet in all TS libs
    candidate.focus({ focusVisible: options?.focusVisible })
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return
  }
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}

/**
 * This is the "meat" of the typeahead matching logic. It takes in all the values,
 * the search and the current match, and returns the next match (or `undefined`).
 *
 * We normalize the search because if a user has repeatedly pressed a character,
 * we want the exact same behavior as if we only had that one character
 * (ie. cycle through options starting with that character)
 *
 * We also reorder the values by wrapping the array around the current match.
 * This is so we always look forward from the current match, and picking the first
 * match will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the
 * current match from the values because otherwise it would be the first to match always
 * and focus would never move. This is as opposed to the regular case, where we
 * don't want focus to move if the current match still matches.
 */
function getNextMatch(values: string[], search: string, currentMatch?: string) {
  const isRepeated =
    search.length > 1 && Array.from(search).every((char) => char === search[0])
  const normalizedSearch = isRepeated ? search[0] : search
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0))
  const excludeCurrentMatch = normalizedSearch.length === 1
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch)
  const nextMatch = wrappedValues.find((value) =>
    value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  )
  return nextMatch !== currentMatch ? nextMatch : undefined
}

// Determine if a point is inside of a polygon.
// Based on https://github.com/substack/point-in-polygon
function isPointInPolygon(point: Point, polygon: Polygon) {
  const { x, y } = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    // prettier-ignore
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}

function isPointerInGraceArea(event: React.PointerEvent, area?: Polygon) {
  if (!area) return false
  const cursorPos = { x: event.clientX, y: event.clientY }
  return isPointInPolygon(cursorPos, area)
}

export type {
  MenuAnchorProps,
  MenuArrowProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuGroupProps,
  MenuItemIconProps,
  MenuItemIndicatorProps,
  MenuItemProps,
  MenuItemSubTitleProps,
  MenuItemTitleProps,
  MenuLabelProps,
  MenuPortalProps,
  MenuBaseProps as MenuProps,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuSubTriggerProps,
}
