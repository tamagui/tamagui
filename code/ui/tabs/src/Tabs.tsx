import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { createStyledHOC, styled, View } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { RovingFocusGroup, type RovingFocusGroupProps } from '@tamagui/roving-focus'
import { SizeContext, type TokenSize } from '@tamagui/size'
import { useTab, useTabContent, useTabs, useTabsList } from '@tamagui/tabs-headless'
import type { GetProps, TamaguiElement } from '@tamagui/web'
import { useEvent } from '@tamagui/web'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'
import { TabsProvider, useTabsContext } from './StyledContext'

const TABS_CONTEXT = 'TabsContext'

export const TabsFrame = styled(View, {
  displayName: 'Tabs',
  context: SizeContext,
})

export const TabsListFrame = styled(View, {
  displayName: 'TabsList',
  context: SizeContext,
  role: 'tablist',
})

export const TabsTabFrame = styled(View, {
  displayName: 'TabsTrigger',
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
  displayName: 'TabsContent',
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
   * Whether a tab is activated automatically or manually. Automatic activation is only
   * supported on web; native tabs always activate manually.
   * @defaultValue automatic
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

export const TabsList = createStyledHOC(
  TabsListFrame,
  function TabsList(props: TabsListProps, forwardedRef) {
    const { __scopeTabs, loop = true, disabled = false, children, ...listProps } = props
    const context = useTabsContext(__scopeTabs)
    const { listProps: headlessListProps } = useTabsList({
      orientation: context.orientation,
      disabled,
    })

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
            {...headlessListProps}
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

export const TabsTab = createStyledHOC(
  TabsTabFrame,
  function TabsTab(props: TabsTabProps, forwardedRef) {
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
    // interaction logic needs one boolean; a conditional flat value (clause
    // string or object) can't drive focus/activation, so only literal true counts
    const disabled = (disabledProp ?? listDisabled) === true
    const { isSelected, tabProps } = useTab({
      baseId: context.baseId,
      value,
      selectedValue: context.value,
      disabled,
      activationMode: context.activationMode,
      onChange: context.onChange,
    })
    const {
      onPress: activateOnPress,
      onKeyDown: activateOnKeyDown,
      onFocus: activateOnFocus,
      ...tabA11yProps
    } = tabProps
    const [layout, setLayout] = React.useState<TabLayout | null>(null)
    const triggerRef = React.useRef<TamaguiElement>(null)
    const emitInteraction = useEvent(
      (type: InteractionType, layout: TabLayout | null) => {
        onInteraction?.(type, layout)
      }
    )

    React.useEffect(() => {
      context.registerTrigger()
      return () => context.unregisterTrigger()
    }, [])

    React.useEffect(() => {
      if (!triggerRef.current || !isWeb) return

      const element = triggerRef.current as unknown as HTMLElement

      function updateTriggerSize() {
        const next = {
          width: element.offsetWidth,
          height: element.offsetHeight,
          x: element.offsetLeft,
          y: element.offsetTop,
        }
        setLayout((previous) =>
          previous &&
          previous.width === next.width &&
          previous.height === next.height &&
          previous.x === next.x &&
          previous.y === next.y
            ? previous
            : next
        )
      }

      updateTriggerSize()
      const observer = new ResizeObserver(updateTriggerSize)
      observer.observe(element)

      return () => observer.disconnect()
    }, [context.triggersCount])

    React.useEffect(() => {
      if (isSelected && layout) {
        emitInteraction('select', layout)
      }
    }, [emitInteraction, isSelected, layout])

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
              emitInteraction('hover', layout)
            }
          })}
          onMouseLeave={composeEventHandlers(onMouseLeave, () => {
            emitInteraction('hover', null)
          })}
          {...tabA11yProps}
          theme={isSelected ? (activeTheme ?? null) : null}
          size={context.size}
          {...triggerProps}
          // after triggerProps so active styles beat base styles from styled() skins
          {...(isSelected && activeStyle)}
          ref={composeRefs(forwardedRef, triggerRef)}
          onPress={composeEventHandlers(onPress ?? undefined, activateOnPress as any)}
          {...(isWeb && {
            onKeyDown: composeEventHandlers(onKeyDown, activateOnKeyDown),
            // emit the focus interaction before activating, matching the order
            // the indicator animations were built against
            onFocus: composeEventHandlers(
              onFocus,
              composeEventHandlers(() => {
                if (layout) {
                  emitInteraction('focus', layout)
                }
              }, activateOnFocus)
            ),
            onBlur: composeEventHandlers(onBlur, () => {
              emitInteraction('focus', null)
            }),
          })}
        />
      </RovingFocusGroup.Item>
    )
  }
)

export const TabsContent = createStyledHOC(
  TabsContentFrame,
  function TabsContent(props: TabsContentProps, forwardedRef) {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props
    const context = useTabsContext(__scopeTabs)
    const { shouldMount, contentProps: headlessContentProps } = useTabContent({
      baseId: context.baseId,
      value,
      selectedValue: context.value,
      orientation: context.orientation,
      forceMount,
    })

    if (!shouldMount) {
      return null
    }

    return (
      <TabsContentFrame
        key={value}
        // @ts-ignore hidden is a web-only accessibility attribute
        {...headlessContentProps}
        {...contentProps}
        ref={forwardedRef}
      >
        {children}
      </TabsContentFrame>
    )
  }
)

const TabsComponent = createStyledHOC(
  TabsFrame,
  function Tabs(props: TabsProps, forwardedRef) {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = 'horizontal',
      dir,
      activationMode = 'automatic',
      size = true,
      ...tabsProps
    } = props
    const {
      value,
      setValue,
      baseId,
      direction,
      triggersCount,
      registerTrigger,
      unregisterTrigger,
      tabsProps: headlessTabsProps,
    } = useTabs({
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation,
      dir,
      activationMode,
    })

    return (
      <SizeContext.Provider size={size}>
        <TabsProvider
          scope={__scopeTabs}
          baseId={baseId}
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
            {...headlessTabsProps}
            {...tabsProps}
            ref={forwardedRef}
          />
        </TabsProvider>
      </SizeContext.Provider>
    )
  }
)

export const Tabs = withStaticProperties(TabsComponent, {
  Frame: TabsFrame,
  List: TabsList,
  Tab: TabsTab,
  Content: TabsContent,
})
