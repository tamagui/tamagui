import { composeEventHandlers } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import * as React from 'react'
import { useCallback, useId, useRef, useState } from 'react'

export type TabsActivationMode = 'automatic' | 'manual'
export type TabsOrientation = 'horizontal' | 'vertical'
export type Direction = 'ltr' | 'rtl'

// -------------------------------------------------------------------------------------------------
// useTabs
// -------------------------------------------------------------------------------------------------

export interface UseTabsProps {
  /** The value for the selected tab, if controlled */
  value?: string
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * @defaultValue horizontal
   */
  orientation?: TabsOrientation
  /**
   * The direction of navigation between toolbar items.
   */
  dir?: Direction
  /**
   * Whether a tab is activated automatically (on focus) or manually (on click/enter).
   * @defaultValue automatic
   */
  activationMode?: TabsActivationMode
  /**
   * Whether keyboard navigation should loop from last to first and vice versa.
   * @defaultValue true
   */
  loop?: boolean
}

export interface UseTabsReturn {
  /** The currently selected tab value */
  value: string
  /** Function to change the selected tab */
  setValue: (value: string) => void
  /** The resolved text direction */
  direction: Direction
  /** Props to spread on the tabs container element */
  tabsProps: {
    'data-orientation': TabsOrientation
    dir: Direction
  }
  /** Props to spread on the tab list element */
  listProps: {
    role: 'tablist'
    'aria-orientation': TabsOrientation
  }
  /** Function to get props for a tab trigger */
  getTabProps: (tabValue: string, disabled?: boolean) => TabTriggerProps
  /** Function to get props for a tab content panel */
  getContentProps: (tabValue: string) => TabContentProps
  /** Context value to provide to child components */
  contextValue: TabsContextValue
}

export interface TabTriggerProps {
  role: 'tab'
  id: string
  'aria-selected': boolean
  'aria-controls': string
  'data-state': 'active' | 'inactive'
  'data-disabled'?: ''
  disabled?: boolean
  tabIndex: number
  onKeyDown: (event: React.KeyboardEvent) => void
  onClick: (event: React.MouseEvent) => void
  onFocus: (event: React.FocusEvent) => void
}

export interface TabContentProps {
  role: 'tabpanel'
  id: string
  'aria-labelledby': string
  'data-state': 'active' | 'inactive'
  'data-orientation': TabsOrientation
  hidden: boolean
  tabIndex: 0
}

export interface TabsContextValue {
  baseId: string
  value: string
  setValue: (value: string) => void
  orientation: TabsOrientation
  direction: Direction
  activationMode: TabsActivationMode
  loop: boolean
}

export function useTabs(props: UseTabsProps = {}): UseTabsReturn {
  const {
    value: valueProp,
    onValueChange,
    defaultValue = '',
    orientation = 'horizontal',
    dir,
    activationMode = 'automatic',
    loop = true,
  } = props

  const direction = useDirection(dir)
  const baseId = useId()

  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue,
  })

  const tabRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [tabValues, setTabValues] = useState<string[]>([])

  const registerTab = useCallback((tabValue: string, element: HTMLElement | null) => {
    if (element) {
      tabRefs.current.set(tabValue, element)
      setTabValues((prev) => (prev.includes(tabValue) ? prev : [...prev, tabValue]))
    } else {
      tabRefs.current.delete(tabValue)
      setTabValues((prev) => prev.filter((v) => v !== tabValue))
    }
  }, [])

  const focusTab = useCallback((tabValue: string) => {
    const element = tabRefs.current.get(tabValue)
    element?.focus()
  }, [])

  const getNextTab = useCallback(
    (currentValue: string, direction: 1 | -1): string | null => {
      const currentIndex = tabValues.indexOf(currentValue)
      if (currentIndex === -1) return null

      let nextIndex = currentIndex + direction
      if (loop) {
        nextIndex = (nextIndex + tabValues.length) % tabValues.length
      } else {
        if (nextIndex < 0 || nextIndex >= tabValues.length) return null
      }
      return tabValues[nextIndex] ?? null
    },
    [tabValues, loop]
  )

  const handleKeyDown = useCallback(
    (tabValue: string) => (event: React.KeyboardEvent) => {
      const isHorizontal = orientation === 'horizontal'
      const isRtl = direction === 'rtl'

      let nextTab: string | null = null

      switch (event.key) {
        case 'ArrowRight':
          if (isHorizontal) {
            nextTab = getNextTab(tabValue, isRtl ? -1 : 1)
          }
          break
        case 'ArrowLeft':
          if (isHorizontal) {
            nextTab = getNextTab(tabValue, isRtl ? 1 : -1)
          }
          break
        case 'ArrowDown':
          if (!isHorizontal) {
            nextTab = getNextTab(tabValue, 1)
          }
          break
        case 'ArrowUp':
          if (!isHorizontal) {
            nextTab = getNextTab(tabValue, -1)
          }
          break
        case 'Home':
          nextTab = tabValues[0] ?? null
          break
        case 'End':
          nextTab = tabValues[tabValues.length - 1] ?? null
          break
        case ' ':
        case 'Enter':
          if (activationMode === 'manual') {
            setValue(tabValue)
            event.preventDefault()
          }
          return
      }

      if (nextTab) {
        event.preventDefault()
        focusTab(nextTab)
        if (activationMode === 'automatic') {
          setValue(nextTab)
        }
      }
    },
    [orientation, direction, getNextTab, tabValues, activationMode, setValue, focusTab]
  )

  const getTabProps = useCallback(
    (tabValue: string, disabled?: boolean): TabTriggerProps => {
      const isSelected = value === tabValue
      const triggerId = makeTriggerId(baseId, tabValue)
      const contentId = makeContentId(baseId, tabValue)

      return {
        role: 'tab',
        id: triggerId,
        'aria-selected': isSelected,
        'aria-controls': contentId,
        'data-state': isSelected ? 'active' : 'inactive',
        ...(disabled && { 'data-disabled': '' as const }),
        disabled,
        tabIndex: isSelected ? 0 : -1,
        onKeyDown: disabled ? () => {} : handleKeyDown(tabValue),
        onClick: (event: React.MouseEvent) => {
          if (!disabled && !isSelected) {
            setValue(tabValue)
          }
        },
        onFocus: (event: React.FocusEvent) => {
          registerTab(tabValue, event.currentTarget as HTMLElement)
          if (!disabled && !isSelected && activationMode === 'automatic') {
            setValue(tabValue)
          }
        },
      }
    },
    [value, baseId, handleKeyDown, setValue, activationMode, registerTab]
  )

  const getContentProps = useCallback(
    (tabValue: string): TabContentProps => {
      const isSelected = value === tabValue
      const triggerId = makeTriggerId(baseId, tabValue)
      const contentId = makeContentId(baseId, tabValue)

      return {
        role: 'tabpanel',
        id: contentId,
        'aria-labelledby': triggerId,
        'data-state': isSelected ? 'active' : 'inactive',
        'data-orientation': orientation,
        hidden: !isSelected,
        tabIndex: 0,
      }
    },
    [value, baseId, orientation]
  )

  const contextValue: TabsContextValue = {
    baseId,
    value,
    setValue,
    orientation,
    direction,
    activationMode,
    loop,
  }

  return {
    value,
    setValue,
    direction,
    tabsProps: {
      'data-orientation': orientation,
      dir: direction,
    },
    listProps: {
      role: 'tablist',
      'aria-orientation': orientation,
    },
    getTabProps,
    getContentProps,
    contextValue,
  }
}

// -------------------------------------------------------------------------------------------------
// useTabsContext - for component-based APIs
// -------------------------------------------------------------------------------------------------

const TabsContext = React.createContext<TabsContextValue | null>(null)

export const TabsProvider = TabsContext.Provider

export function useTabsContext(): TabsContextValue {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider')
  }
  return context
}

// -------------------------------------------------------------------------------------------------
// useTab - hook for individual tab triggers
// -------------------------------------------------------------------------------------------------

export interface UseTabProps {
  value: string
  disabled?: boolean
  onPress?: (event: any) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onFocus?: (event: React.FocusEvent) => void
}

export function useTab(props: UseTabProps) {
  const { value: tabValue, disabled, onPress, onKeyDown, onFocus } = props
  const context = useTabsContext()
  const { value, setValue, baseId, activationMode, orientation, direction, loop } =
    context

  const isSelected = value === tabValue
  const triggerId = makeTriggerId(baseId, tabValue)
  const contentId = makeContentId(baseId, tabValue)

  const ref = useRef<HTMLElement>(null)

  return {
    isSelected,
    tabProps: {
      ref,
      role: 'tab' as const,
      id: triggerId,
      'aria-selected': isSelected,
      'aria-controls': contentId,
      'data-state': isSelected ? 'active' : 'inactive',
      ...(disabled && { 'data-disabled': '' as const }),
      disabled,
      tabIndex: isSelected ? 0 : -1,
      onKeyDown: composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
        if (disabled) return
        if ([' ', 'Enter'].includes(event.key)) {
          setValue(tabValue)
          event.preventDefault()
        }
      }),
      onPress: composeEventHandlers(onPress, () => {
        if (!disabled && !isSelected) {
          setValue(tabValue)
        }
      }),
      onFocus: composeEventHandlers(onFocus, () => {
        if (!disabled && !isSelected && activationMode === 'automatic') {
          setValue(tabValue)
        }
      }),
    },
  }
}

// -------------------------------------------------------------------------------------------------
// useTabContent - hook for tab content panels
// -------------------------------------------------------------------------------------------------

export interface UseTabContentProps {
  value: string
  forceMount?: boolean
}

export function useTabContent(props: UseTabContentProps) {
  const { value: tabValue, forceMount } = props
  const context = useTabsContext()
  const { value, baseId, orientation } = context

  const isSelected = value === tabValue
  const triggerId = makeTriggerId(baseId, tabValue)
  const contentId = makeContentId(baseId, tabValue)

  return {
    isSelected,
    shouldMount: forceMount || isSelected,
    contentProps: {
      role: 'tabpanel' as const,
      id: contentId,
      'aria-labelledby': triggerId,
      'data-state': isSelected ? 'active' : 'inactive',
      'data-orientation': orientation,
      hidden: !isSelected,
      tabIndex: 0,
    },
  }
}

// -------------------------------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------------------------------

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}
