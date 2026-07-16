import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { createStyledHOC, styled, View } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { RovingFocusGroup, type RovingFocusGroupProps } from '@tamagui/roving-focus'
import { SizeContext, type TokenSize } from '@tamagui/size'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import type { GetProps, TamaguiElement } from '@tamagui/web'
import { useEvent } from '@tamagui/web'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'
import { TabsProvider, useTabsContext } from './StyledContext'

const TABS_CONTEXT = 'TabsContext'

export const TabsFrame = styled(View, {
  name: 'Tabs',
  context: SizeContext,
})

export const TabsListFrame = styled(View, {
  name: 'TabsList',
  context: SizeContext,
  role: 'tablist',
})

export const TabsTabFrame = styled(View, {
  name: 'TabsTrigger',
  context: SizeContext,
  role: 'tab',

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

export const TabsContentFrame = styled(View, {
  name: 'TabsContent',
  context: SizeContext,
})

type TabsScopeProps = {
  __scopeTabs?: string
}

type TabsFrameProps = GetProps<typeof TabsFrame>

type TabsExtraProps<Tab = string> = TabsScopeProps & {
  /** The value for the selected tab, if controlled */
  value?: string
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: Tab
  /** A function called when a new tab is selected */
  onValueChange?: (value: Tab) => void
  /** Coordinates a size value with styled descendants. */
  size?: TokenSize
  /**
   * The orientation the tabs are laid out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down).
   * @defaultValue horizontal
   */
  orientation?: RovingFocusGroupProps['orientation']
  /** The direction of navigation between tab triggers. */
  dir?: RovingFocusGroupProps['dir']
  /**
   * Whether a tab is activated automatically or manually. Only supported on web.
   * @defaultValue manual
   */
  activationMode?: 'automatic' | 'manual'
}

export type TabsProps<Tab = string> = TabsFrameProps & TabsExtraProps<Tab>

type TabsListExtraProps = TabsScopeProps & {
  /** Whether keyboard navigation loops after the first or last trigger. */
  loop?: boolean
  /** Disables every trigger in the list. */
  disabled?: boolean
}

export type TabsListProps = GetProps<typeof TabsListFrame> & TabsListExtraProps

export type InteractionType = 'select' | 'focus' | 'hover'
export type TabLayout = LayoutRectangle
export type TabsTriggerLayout = LayoutRectangle

type TabsTabExtraProps = TabsScopeProps & {
  /** The value selected when this trigger is activated. */
  value: string
  /** Reports the measured trigger rectangle for custom indicators. */
  onInteraction?: (type: InteractionType, layout: TabLayout | null) => void
  /** Custom styles to apply while this trigger is selected. */
  activeStyle?: GetProps<typeof TabsTabFrame>
  /** Theme to apply while this trigger is selected. */
  activeTheme?: string | null
}

export type TabsTabProps = GetProps<typeof TabsTabFrame> & TabsTabExtraProps

type TabsContentExtraProps = TabsScopeProps & {
  /** The value that selects this content. */
  value: string
  /** Mounts the content even when its value is not selected. */
  forceMount?: boolean
}

export type TabsContentProps = GetProps<typeof TabsContentFrame> & TabsContentExtraProps

const TabsListDisabledContext = React.createContext(false)

export const TabsList = createStyledHOC(TabsListFrame)<TabsListExtraProps>(
  function TabsList(props: TabsListProps, forwardedRef) {
    const { __scopeTabs, loop = true, disabled = false, children, ...listProps } = props
    const context = useTabsContext(__scopeTabs)

    return (
      <TabsListDisabledContext.Provider value={disabled}>
        <RovingFocusGroup
          __scopeRovingFocusGroup={__scopeTabs || TABS_CONTEXT}
          orientation={context.orientation}
          dir={context.dir}
          loop={loop}
          asChild
        >
          <TabsListFrame
            role="tablist"
            aria-orientation={context.orientation}
            aria-disabled={disabled || undefined}
            data-orientation={context.orientation}
            data-disabled={disabled ? '' : undefined}
            flexDirection={context.orientation === 'vertical' ? 'column' : 'row'}
            ref={forwardedRef}
            {...listProps}
          >
            {children}
          </TabsListFrame>
        </RovingFocusGroup>
      </TabsListDisabledContext.Provider>
    )
  }
)

export const TabsTab = createStyledHOC(TabsTabFrame)<TabsTabExtraProps>(function TabsTab(
  props: TabsTabProps,
  forwardedRef
) {
  const {
    __scopeTabs,
    value,
    disabled: disabledProp,
    onInteraction,
    activeStyle,
    activeTheme,
    onLayout,
    onMouseEnter,
    onMouseLeave,
    onPress,
    onKeyDown,
    onFocus,
    onBlur,
    ...triggerProps
  } = props
  const context = useTabsContext(__scopeTabs)
  const listDisabled = React.useContext(TabsListDisabledContext)
  const disabled = disabledProp ?? listDisabled
  const triggerId = makeTriggerId(context.baseId, value)
  const contentId = makeContentId(context.baseId, value)
  const isSelected = value === context.value
  const [layout, setLayout] = React.useState<TabLayout | null>(null)
  const triggerRef = React.useRef<TamaguiElement>(null)

  React.useEffect(() => {
    context.registerTrigger()
    return () => context.unregisterTrigger()
  }, [])

  React.useEffect(() => {
    if (!triggerRef.current || !isWeb) return

    const element = triggerRef.current as unknown as HTMLElement

    function updateTriggerSize() {
      setLayout({
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: element.offsetLeft,
        y: element.offsetTop,
      })
    }

    updateTriggerSize()
    const observer = new ResizeObserver(updateTriggerSize)
    observer.observe(element)

    return () => observer.disconnect()
  }, [context.triggersCount])

  React.useEffect(() => {
    if (isSelected && layout) {
      onInteraction?.('select', layout)
    }
  }, [isSelected, layout, onInteraction])

  return (
    <RovingFocusGroup.Item
      __scopeRovingFocusGroup={__scopeTabs || TABS_CONTEXT}
      asChild
      tabIndex={disabled ? -1 : 0}
      active={isSelected}
    >
      <TabsTabFrame
        onLayout={
          isWeb
            ? onLayout
            : composeEventHandlers(onLayout, (event) => {
                setLayout(event.nativeEvent.layout)
              })
        }
        onMouseEnter={composeEventHandlers(onMouseEnter, () => {
          if (layout) {
            onInteraction?.('hover', layout)
          }
        })}
        onMouseLeave={composeEventHandlers(onMouseLeave, () => {
          onInteraction?.('hover', null)
        })}
        role="tab"
        aria-selected={isSelected}
        aria-controls={contentId}
        data-state={isSelected ? 'active' : 'inactive'}
        data-disabled={disabled ? '' : undefined}
        id={triggerId}
        theme={isSelected ? (activeTheme ?? null) : null}
        size={context.size}
        disabled={disabled}
        {...triggerProps}
        {...(isSelected && activeStyle)}
        ref={composeRefs(forwardedRef, triggerRef)}
        onPress={composeEventHandlers(onPress ?? undefined, (event) => {
          const isPrimaryPointer =
            !isWeb ||
            ((event as unknown as React.MouseEvent).button === 0 &&
              (event as unknown as React.MouseEvent).ctrlKey === false)

          if (!disabled && !isSelected && isPrimaryPointer) {
            context.onChange(value)
          }
        })}
        {...(isWeb && {
          onKeyDown: composeEventHandlers(onKeyDown, (event) => {
            if (!disabled && [' ', 'Enter'].includes(event.key)) {
              context.onChange(value)
              event.preventDefault()
            }
          }),
          onFocus: composeEventHandlers(onFocus, () => {
            if (layout) {
              onInteraction?.('focus', layout)
            }
            const isAutomaticActivation = context.activationMode !== 'manual'
            if (!isSelected && !disabled && isAutomaticActivation) {
              context.onChange(value)
            }
          }),
          onBlur: composeEventHandlers(onBlur, () => {
            onInteraction?.('focus', null)
          }),
        })}
      />
    </RovingFocusGroup.Item>
  )
})

export const TabsContent = createStyledHOC(TabsContentFrame)<TabsContentExtraProps>(
  function TabsContent(props: TabsContentProps, forwardedRef) {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props
    const context = useTabsContext(__scopeTabs)
    const isSelected = value === context.value
    const show = forceMount || isSelected

    if (!show) {
      return null
    }

    return (
      <TabsContentFrame
        key={value}
        data-state={isSelected ? 'active' : 'inactive'}
        data-orientation={context.orientation}
        role="tabpanel"
        aria-labelledby={makeTriggerId(context.baseId, value)}
        // @ts-ignore hidden is a web-only accessibility attribute
        hidden={!show}
        id={makeContentId(context.baseId, value)}
        tabIndex={0}
        {...contentProps}
        ref={forwardedRef}
      >
        {children}
      </TabsContentFrame>
    )
  }
)

const TabsComponent = createStyledHOC(TabsFrame)<TabsExtraProps>(function Tabs(
  props: TabsProps,
  forwardedRef
) {
  const {
    __scopeTabs,
    value: valueProp,
    onValueChange,
    defaultValue,
    orientation = 'horizontal',
    dir,
    activationMode = 'manual',
    size = true,
    ...tabsProps
  } = props
  const direction = useDirection(dir)
  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue ?? '',
  })
  const [triggersCount, setTriggersCount] = React.useState(0)
  const registerTrigger = useEvent(() => setTriggersCount((count) => count + 1))
  const unregisterTrigger = useEvent(() => setTriggersCount((count) => count - 1))

  return (
    <SizeContext.Provider size={size}>
      <TabsProvider
        scope={__scopeTabs}
        baseId={React.useId()}
        value={value}
        onChange={setValue}
        orientation={orientation}
        dir={direction}
        activationMode={activationMode}
        size={size}
        registerTrigger={registerTrigger}
        triggersCount={triggersCount}
        unregisterTrigger={unregisterTrigger}
      >
        <TabsFrame
          direction={direction}
          data-orientation={orientation}
          {...tabsProps}
          ref={forwardedRef}
        />
      </TabsProvider>
    </SizeContext.Provider>
  )
})

export const Tabs = withStaticProperties(TabsComponent, {
  Frame: TabsFrame,
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}
