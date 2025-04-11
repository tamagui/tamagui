import { composeRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { GroupProps } from '@tamagui/group'
import { Group, useGroupItem } from '@tamagui/group'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { RovingFocusGroup, type RovingFocusGroupProps } from '@tamagui/roving-focus'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import type { GetProps, StackProps, TamaguiElement } from '@tamagui/web'
import { Theme, useEvent } from '@tamagui/web'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'
import { DefaultTabsContentFrame, DefaultTabsFrame, DefaultTabsTabFrame } from './Tabs'
import { TabsProvider, useTabsContext } from './StyledContext'

type TabsComponent = (props: { direction: 'horizontal' | 'vertical' } & StackProps) => any
type TabComponent = (props: { active?: boolean } & StackProps) => any
type ContentComponent = (props: StackProps) => any

export function createTabs<
  C extends TabsComponent,
  T extends TabComponent,
  F extends ContentComponent,
>(createProps: {
  ContentFrame: F
  TabFrame: T
  TabsFrame: C
}) {
  const {
    ContentFrame = DefaultTabsContentFrame,
    TabFrame = DefaultTabsTabFrame,
    TabsFrame = DefaultTabsFrame,
  } = createProps as unknown as {
    ContentFrame: typeof DefaultTabsContentFrame
    TabFrame: typeof DefaultTabsTabFrame
    TabsFrame: typeof DefaultTabsFrame
  }

  const TABS_CONTEXT = 'TabsContext'

  const TAB_LIST_NAME = 'TabsList'

  const TabsList = React.forwardRef<TamaguiElement, TabsListProps>(
    (props: ScopedProps<TabsListProps>, forwardedRef) => {
      const { __scopeTabs, loop = true, children, ...listProps } = props
      const context = useTabsContext(__scopeTabs)

      return (
        <RovingFocusGroup
          __scopeRovingFocusGroup={__scopeTabs || TABS_CONTEXT}
          orientation={context.orientation}
          dir={context.dir}
          loop={loop}
          asChild
        >
          <Group
            role="tablist"
            componentName={TAB_LIST_NAME}
            aria-orientation={context.orientation}
            ref={forwardedRef}
            orientation={context.orientation}
            {...listProps}
          >
            {children}
          </Group>
        </RovingFocusGroup>
      )
    }
  )

  TabsList.displayName = TAB_LIST_NAME

  /* -------------------------------------------------------------------------------------------------
   * TabsTrigger
   * -----------------------------------------------------------------------------------------------*/

  const TRIGGER_NAME = 'TabsTrigger'

  /**
   * @deprecated Use `TabLayout` instead
   */

  const TabsTrigger = TabFrame.styleable<ScopedProps<TabsTabProps>>(
    (props, forwardedRef) => {
      const {
        __scopeTabs,
        value,
        disabled = false,
        onInteraction,
        disableActiveTheme,
        ...triggerProps
      } = props
      const context = useTabsContext(__scopeTabs)
      const triggerId = makeTriggerId(context.baseId, value)
      const contentId = makeContentId(context.baseId, value)
      const isSelected = value === context.value
      const [layout, setLayout] = React.useState<TabLayout | null>(null)
      const triggerRef = React.useRef<HTMLButtonElement>(null)
      const groupItemProps = useGroupItem({ disabled: !!disabled })

      React.useEffect(() => {
        context.registerTrigger()
        return () => context.unregisterTrigger()
      }, [])

      React.useEffect(() => {
        if (!triggerRef.current || !isWeb) return

        function getTriggerSize() {
          if (!triggerRef.current) return
          setLayout({
            width: triggerRef.current.offsetWidth,
            height: triggerRef.current.offsetHeight,
            x: triggerRef.current.offsetLeft,
            y: triggerRef.current.offsetTop,
          })
        }
        getTriggerSize()

        const observer = new ResizeObserver(getTriggerSize)
        observer.observe(triggerRef.current)

        return () => {
          if (!triggerRef.current) return
          observer.unobserve(triggerRef.current)
        }
      }, [context.triggersCount])

      React.useEffect(() => {
        if (isSelected && layout) {
          onInteraction?.('select', layout)
        }
      }, [isSelected, value, layout])

      return (
        <Theme name={isSelected && !disableActiveTheme ? 'active' : null}>
          <RovingFocusGroup.Item
            __scopeRovingFocusGroup={__scopeTabs || TABS_CONTEXT}
            asChild
            focusable={!disabled}
            active={isSelected}
          >
            <TabFrame
              onLayout={(event) => {
                if (!isWeb) {
                  setLayout(event.nativeEvent.layout)
                }
              }}
              onHoverIn={composeEventHandlers(props.onHoverIn, () => {
                if (layout) {
                  onInteraction?.('hover', layout)
                }
              })}
              onHoverOut={composeEventHandlers(props.onHoverOut, () => {
                onInteraction?.('hover', null)
              })}
              role="tab"
              aria-selected={isSelected}
              aria-controls={contentId}
              data-state={isSelected ? 'active' : 'inactive'}
              data-disabled={disabled ? '' : undefined}
              disabled={disabled}
              id={triggerId}
              {...(!props.unstyled && {
                size: context.size,
              })}
              {...(isSelected && {
                forceStyle: 'focus',
              })}
              {...groupItemProps}
              {...triggerProps}
              ref={composeRefs(forwardedRef, triggerRef)}
              onPress={composeEventHandlers(props.onPress ?? undefined, (event) => {
                // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
                // but not when the control key is pressed (avoiding MacOS right click)

                const webChecks =
                  !isWeb ||
                  ((event as unknown as React.MouseEvent).button === 0 &&
                    (event as unknown as React.MouseEvent).ctrlKey === false)
                if (!disabled && !isSelected && webChecks) {
                  context.onChange(value)
                } else {
                  // prevent focus to avoid accidental activation
                  event.preventDefault()
                }
              })}
              {...(isWeb && {
                type: 'button',
                onKeyDown: composeEventHandlers(
                  (props as React.HTMLProps<HTMLButtonElement>).onKeyDown,
                  (event) => {
                    if ([' ', 'Enter'].includes(event.key)) {
                      context.onChange(value)
                      event.preventDefault()
                    }
                  }
                ),
                onFocus: composeEventHandlers(props.onFocus, (event) => {
                  if (layout) {
                    onInteraction?.('focus', layout)
                  }
                  // handle "automatic" activation if necessary
                  // ie. activate tab following focus
                  const isAutomaticActivation = context.activationMode !== 'manual'
                  if (!isSelected && !disabled && isAutomaticActivation) {
                    context.onChange(value)
                  }
                }),
                onBlur: composeEventHandlers(props.onFocus, () => {
                  onInteraction?.('focus', null)
                }),
              })}
            />
          </RovingFocusGroup.Item>
        </Theme>
      )
    }
  )

  TabsTrigger.displayName = TRIGGER_NAME

  /* -------------------------------------------------------------------------------------------------
   * TabsContent
   * -----------------------------------------------------------------------------------------------*/

  const TabsContent = ContentFrame.styleable<TabsContentExtraProps>(function TabsContent(
    props: ScopedProps<TabsContentProps>,
    forwardedRef
  ) {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props
    const context = useTabsContext(__scopeTabs)
    const isSelected = value === context.value
    const show = forceMount || isSelected

    const triggerId = makeTriggerId(context.baseId, value)
    const contentId = makeContentId(context.baseId, value)

    if (!show) {
      return null
    }

    return (
      <ContentFrame
        key={value}
        data-state={isSelected ? 'active' : 'inactive'}
        data-orientation={context.orientation}
        role="tabpanel"
        aria-labelledby={triggerId}
        // @ts-ignore
        hidden={!show}
        id={contentId}
        tabIndex={0}
        {...contentProps}
        ref={forwardedRef}
      >
        {children}
      </ContentFrame>
    )
  })

  /* -------------------------------------------------------------------------------------------------
   * Tabs
   * -----------------------------------------------------------------------------------------------*/

  type ScopedProps<P> = P & { __scopeTabs?: string }
  // const [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
  //   createRovingFocusGroupScope,
  // ])
  // const useRovingFocusGroupScope = createRovingFocusGroupScope()

  type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>

  const TabsComponent = TabsFrame.styleable<TabsExtraProps>(function Tabs(
    props: ScopedProps<TabsProps>,
    forwardedRef
  ) {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = 'horizontal',
      dir,
      activationMode = 'automatic',
      size = '$true',
      ...tabsProps
    } = props
    const direction = useDirection(dir)
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? '',
    })
    const [triggersCount, setTriggersCount] = React.useState(0)
    const registerTrigger = useEvent(() => setTriggersCount((v) => v + 1))
    const unregisterTrigger = useEvent(() => setTriggersCount((v) => v - 1))

    return (
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
          //   dir={direction}
          data-orientation={orientation}
          {...tabsProps}
          ref={forwardedRef}
        />
      </TabsProvider>
    )
  })

  // make it so it can accept a generic
  // this broke things outside our repo, but not sure why, all non style props were missing
  // like onPress etc
  // as <Tab = string>(
  //   props: TabsProps<Tab> & { ref?: React.Ref<TamaguiElement> }
  // ) => React.JSX.Element

  return withStaticProperties(TabsComponent, {
    List: TabsList,
    /**
     * @deprecated Use Tabs.Tab instead
     */
    Trigger: TabsTrigger,
    Tab: TabsTrigger,
    Content: TabsContent,
  })
}
/* ---------------------------------------------------------------------------------------------- */

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}

// Types
type TabsFrameProps = GetProps<typeof DefaultTabsFrame>

type TabsExtraProps<Tab = string> = {
  /** The value for the selected tab, if controlled */
  value?: string
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: Tab
  /** A function called when a new tab is selected */
  onValueChange?: (value: Tab) => void
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * @defaultValue horizontal
   */
  orientation?: RovingFocusGroupProps['orientation']
  /**
   * The direction of navigation between toolbar items.
   */
  dir?: RovingFocusGroupProps['dir']
  /**
   * Whether a tab is activated automatically or manually. Only supported in web.
   * @defaultValue automatic
   * */
  activationMode?: 'automatic' | 'manual'
}

type TabsProps<Tab = string> = TabsFrameProps & TabsExtraProps<Tab>

type TabsListFrameProps = GroupProps

type TabsListProps = TabsListFrameProps & {
  /**
   * Whether to loop over after reaching the end or start of the items
   * @default true
   */
  loop?: boolean
}

type InteractionType = 'select' | 'focus' | 'hover'

type TabLayout = LayoutRectangle

type TabsTriggerFrameProps = GetProps<typeof DefaultTabsTabFrame>

/**
 * @deprecated use `TabTabsProps` instead
 */
type TabsTriggerProps = TabsTriggerFrameProps & {
  /** The value for the tabs state to be changed to after activation of the trigger */
  value: string

  /** Used for making custom indicators when trigger interacted with */
  onInteraction?: (type: InteractionType, layout: TabLayout | null) => void

  /** Disables setting the active theme when tab is active */
  disableActiveTheme?: boolean
}

type TabsTabProps = TabsTriggerProps

type TabsTriggerLayout = LayoutRectangle

type TabsContentFrameProps = GetProps<typeof DefaultTabsContentFrame>

type TabsContentExtraProps = {
  /** Will show the content when the value matches the state of Tabs root */
  value: string

  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Tamagui animations.
   */
  forceMount?: true
}

type TabsContentProps = TabsContentFrameProps & TabsContentExtraProps

export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsTriggerLayout,
  TabsTabProps,
  TabsContentProps,
  TabLayout,
}
