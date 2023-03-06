import { Button } from '@tamagui/button'
import {
  GetProps,
  SizeTokens,
  composeEventHandlers,
  composeRefs,
  isWeb,
  styled,
  useId,
  withStaticProperties,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { createRovingFocusGroupScope } from '@tamagui/roving-focus'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { ScrollView } from '@tamagui/scroll-view'
import { SizableStack, ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import * as React from 'react'
import type { LayoutRectangle } from 'react-native'

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'TabsList'

const TabsListScrollableFrame = styled(ScrollView, {
  name: `${TAB_LIST_NAME}Frame`,
  focusable: true,
  defaultVariants: {
    flexGrow: 0,
  },
})

type TabsListFrameProps = GetProps<typeof TabsListScrollableFrame>

type TabsListProps = TabsListFrameProps & {
  /** 
   * Whether to loop over after reaching the end or start of the items
   * @default true
   */
  loop?: boolean
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (props: ScopedProps<TabsListProps>, forwardedRef) => {
    const { __scopeTabs, loop = true, children, ...listProps } = props
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs)

    return (
      <RovingFocusGroup
        asChild
        orientation={context.orientation}
        dir={context.dir}
        loop={loop}
        {...rovingFocusGroupScope}
      >
        <TabsListScrollableFrame
          role="tablist"
          aria-orientation={context.orientation}
          ref={forwardedRef}
          horizontal={context.orientation === 'horizontal'}
          flexDirection={context.orientation === 'horizontal' ? 'row' : 'column'}
          {...listProps}
        >
          {children}
        </TabsListScrollableFrame>
      </RovingFocusGroup>
    )
  }
)

TabsList.displayName = TAB_LIST_NAME

/* -------------------------------------------------------------------------------------------------
 * TabsTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TabsTrigger'

// Having styled(Button) makes it incompatible with XGroup's border radius
const TabsTriggerFrame = Button
// TabsTriggerFrame.name = TRIGGER_NAME

type TabsTriggerFrameProps = GetProps<typeof TabsTriggerFrame>
type TabsTriggerProps = TabsTriggerFrameProps & {
  /** The value for the tabs state to be changed to after activation of the trigger */
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (props: ScopedProps<TabsTriggerProps>, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs)
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs)
    const triggerId = makeTriggerId(context.baseId, value)
    const contentId = makeContentId(context.baseId, value)
    const isSelected = value === context.value
    const [layout, setLayout] = React.useState<LayoutRectangle | null>(null)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

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
    }, [])

    if (isSelected && context.selectedLayout?.value !== value && layout) {
      context.onSelectedLayoutChange({ value, layout })
    }

    const transitionDirection = React.useMemo(() => {
      if (!layout || !context.selectedLayout?.layout) {
        return 0
      }
      if (context.orientation === 'vertical') {
        if (context.selectedLayout.layout.y === layout.y) return 0
        return context.selectedLayout.layout.y > layout.y ? 1 : -1
      }
      if (context.selectedLayout.layout.x === layout.x) return 0
      return context.selectedLayout.layout.x > layout.x ? 1 : -1
    }, [context.selectedLayout, context.orientation, layout])

    return (
      <RovingFocusGroup.Item
        asChild
        {...rovingFocusGroupScope}
        focusable={!disabled}
        active={isSelected}
      >
        <TabsTriggerFrame
          onLayout={(event) => {
            if (!isWeb) {
              setLayout(event.nativeEvent.layout)
            }
          }}
          onHoverIn={composeEventHandlers(props.onHoverIn, () => {
            if (layout) {
              context.onHoveredLayoutChange({ value, layout })
            }
          })}
          onHoverOut={composeEventHandlers(props.onHoverOut, () => {
            context.onHoveredLayoutChange(null)
          })}
          role="tab"
          aria-selected={isSelected}
          aria-controls={contentId}
          data-state={isSelected ? 'active' : 'inactive'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          id={triggerId}
          theme={isSelected ? 'active' : null}
          size={context.size}
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
              context.onChange({ value, transitionDirection })
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
                  context.onChange({ value, transitionDirection })
                }
              }
            ),
            onFocus: composeEventHandlers(props.onFocus, (event) => {
              if (layout) {
                context.onFocusedLayoutChange({ layout, value })
              }
              // handle "automatic" activation if necessary
              // ie. activate tab following focus
              const isAutomaticActivation = context.activationMode !== 'manual'
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onChange({ value, transitionDirection })
              }
            }),
            onBlur: composeEventHandlers(props.onFocus, () => {
              context.onFocusedLayoutChange(null)
            }),
          })}
        />
      </RovingFocusGroup.Item>
    )
  }
)

TabsTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * TabsContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TabsContent'

const TabsContentFrame = styled(ThemeableStack, {
  name: `${CONTENT_NAME}Frame`,
})
type TabsContentFrameProps = GetProps<typeof TabsContentFrame>
type TabsContentProps = TabsContentFrameProps & {
  /** Will show the content when the value matches the state of Tabs root */
  value: string

  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Tamagui animations.
   */
  forceMount?: true
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  (props: ScopedProps<TabsContentProps>, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props
    const context = useTabsContext(CONTENT_NAME, __scopeTabs)
    const isSelected = value === context.value
    const show = forceMount || isSelected

    const triggerId = makeTriggerId(context.baseId, value)
    const contentId = makeContentId(context.baseId, value)

    if (!show) return null
    return (
      <TabsContentFrame
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
      </TabsContentFrame>
    )
  }
)

TabsContent.displayName = CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * TabsRovingIndicator
 * -----------------------------------------------------------------------------------------------*/

const TABS_HIGHLIGHT_NAME = 'TabsRovingIndicator'

const TabsRovingIndicatorFrame = styled(ThemeableStack, {
  name: `${TABS_HIGHLIGHT_NAME}Frame`,
  position: 'absolute',
  backgrounded: true,
  variants: {
    enter: {
      true: {
        opacity: 0,
      },
    },
    exit: {
      true: {
        opacity: 0,
      },
    },
  },
  defaultVariants: {
    opacity: 1,
  },
})
type TabsRovingIndicatorFrameProps = GetProps<typeof TabsRovingIndicatorFrame>
type TabsRovingIndicatorProps = TabsRovingIndicatorFrameProps & {
  /**
   * Determines when should the indicator appear. hover, focus and hoverOrFocus only appear on web.
   * @default select
   */
  highlightMode?: 'select' | 'hover' | 'focus' | 'hoverOrFocus'
}

const TabsRovingIndicator = React.forwardRef<HTMLDivElement, TabsRovingIndicatorProps>(
  (props: ScopedProps<TabsRovingIndicatorProps>, forwardedRef) => {
    const { __scopeTabs, children, highlightMode = 'select', ...highlightProps } = props
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs)

    let layoutState = context.selectedLayout
    if (highlightMode === 'select') {
      layoutState = context.selectedLayout
    } else if (highlightMode === 'hoverOrFocus') {
      layoutState = context.hoveredLayout ?? context.focusedLayout
    } else if (highlightMode === 'focus') {
      layoutState = context.focusedLayout
    }
    const layout = layoutState?.layout
    if (!layout) return null

    return (
      <TabsRovingIndicatorFrame
        key="highlight"
        theme={highlightMode === 'select' ? 'active' : undefined}
        backgroundColor={
          highlightMode === 'select'
            ? '$background'
            : highlightMode === 'focus'
            ? '$backgroundFocus'
            : '$backgroundHover'
        }
        ref={forwardedRef}
        width={layout.width}
        height={layout.height}
        scale={1}
        x={layout.x}
        y={layout.y}
        {...highlightProps}
      >
        {children}
      </TabsRovingIndicatorFrame>
    )
  }
)

TabsRovingIndicator.displayName = CONTENT_NAME
TabsRovingIndicator['isUnspaced'] = true

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs'

/**
 * -1: from left or top
 * 0: no state
 * 1: from right or bottom
 */
type TransitionDirection = -1 | 0 | 1

type ScopedProps<P> = P & { __scopeTabs?: Scope }
const [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope,
])
const useRovingFocusGroupScope = createRovingFocusGroupScope()

type LayoutState = {
  value: string
  layout: LayoutRectangle
}
type TabsContextValue = {
  baseId: string
  value?: string
  onChange: (args: { value: string; transitionDirection: TransitionDirection }) => void
  orientation?: TabsProps['orientation']
  dir?: TabsProps['dir']
  activationMode?: TabsProps['activationMode']
  selectedLayout: LayoutState | null
  onSelectedLayoutChange: (value: LayoutState | null) => void
  hoveredLayout: LayoutState | null
  onHoveredLayoutChange: (value: LayoutState | null) => void
  focusedLayout: LayoutState | null
  onFocusedLayoutChange: (value: LayoutState | null) => void
  size: SizeTokens
}

const [TabsProvider, useTabsContext] = createTabsContext<TabsContextValue>(TABS_NAME)

const TabsFrame = styled(SizableStack, {
  name: `${TABS_NAME}Frame`,

  // flexDirection: 'column',
})
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>
type TabsFrameProps = GetProps<typeof TabsFrame>
type TabsProps = TabsFrameProps & {
  /** The value for the selected tab, if controlled */
  value?: string
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void
  /**
   * Used for animating the tabs content
   * 
   */
  onDirectionChange?: (value: TransitionDirection) => void
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

export const Tabs = withStaticProperties(
  React.forwardRef<HTMLDivElement, TabsProps>(
    (props: ScopedProps<TabsProps>, forwardedRef) => {
      const {
        __scopeTabs,
        value: valueProp,
        onValueChange,
        onDirectionChange,
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
      const handleOnChange = React.useCallback<TabsContextValue['onChange']>(
        (newState) => {
          if (onDirectionChange) {
            onDirectionChange?.(newState.transitionDirection)
            // user needs to receive the direction first to animate it properly
            setTimeout(() => setValue(newState.value), 0)
          } else {
            setValue(newState.value)
          }
        },
        []
      )
      const [hoveredLayout, setHoveredLayout] = React.useState<LayoutState | null>(null)
      const [selectedLayout, setSelectedLayout] = React.useState<LayoutState | null>(null)
      const [focusedLayout, setFocusedLayout] = React.useState<LayoutState | null>(null)

      return (
        <TabsProvider
          scope={__scopeTabs}
          baseId={useId()}
          value={value}
          onChange={handleOnChange}
          orientation={orientation}
          dir={direction}
          activationMode={activationMode}
          hoveredLayout={hoveredLayout}
          onHoveredLayoutChange={setHoveredLayout}
          selectedLayout={selectedLayout}
          onSelectedLayoutChange={setSelectedLayout}
          focusedLayout={focusedLayout}
          onFocusedLayoutChange={setFocusedLayout}
          size={size}
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
    }
  ),
  {
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent,
    RovingIndicator: TabsRovingIndicator,
  }
)

Tabs.displayName = TABS_NAME

/* ---------------------------------------------------------------------------------------------- */

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}

export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps }
