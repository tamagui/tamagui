import { isWeb } from '@tamagui/constants'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import * as React from 'react'

export type TabsActivationMode = 'automatic' | 'manual'
export type TabsOrientation = 'horizontal' | 'vertical'
export type Direction = 'ltr' | 'rtl'

// the skinned Tabs and any headless consumer must derive the same ids, or
// aria-controls / aria-labelledby stop pointing at each other
export function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`
}

export function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`
}

// -------------------------------------------------------------------------------------------------
// useTabs - root controller
// -------------------------------------------------------------------------------------------------

export interface UseTabsProps {
  /** The value for the selected tab, if controlled */
  value?: string
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void
  /**
   * The orientation the tabs are laid out.
   * @defaultValue horizontal
   */
  orientation?: TabsOrientation
  /** The direction of navigation between tab triggers. */
  dir?: Direction
  /**
   * Whether a tab is activated automatically (on focus) or manually (on press/enter).
   * Automatic activation is web-only; native always activates manually.
   * @defaultValue automatic
   */
  activationMode?: TabsActivationMode
}

export function useTabs(props: UseTabsProps = {}) {
  const {
    value: valueProp,
    onValueChange,
    defaultValue,
    orientation = 'horizontal',
    dir,
    activationMode = 'automatic',
  } = props

  const direction = useDirection(dir)
  const baseId = React.useId()

  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue ?? '',
  })

  // triggers report their presence so consumers can re-measure when the set changes
  const [triggersCount, setTriggersCount] = React.useState(0)
  const registerTrigger = React.useCallback(
    () => setTriggersCount((count) => count + 1),
    []
  )
  const unregisterTrigger = React.useCallback(
    () => setTriggersCount((count) => count - 1),
    []
  )

  return {
    value,
    setValue,
    baseId,
    direction,
    orientation,
    activationMode,
    triggersCount,
    registerTrigger,
    unregisterTrigger,
    tabsProps: {
      'data-orientation': orientation,
    },
  }
}

// -------------------------------------------------------------------------------------------------
// useTabsList - the tablist container
// -------------------------------------------------------------------------------------------------

export interface UseTabsListProps {
  orientation?: TabsOrientation
  /** Disables every trigger in the list. */
  disabled?: boolean
}

export function useTabsList(props: UseTabsListProps) {
  const { orientation = 'horizontal', disabled = false } = props

  return {
    listProps: {
      role: 'tablist' as const,
      'aria-orientation': orientation,
      'aria-disabled': disabled || undefined,
      'data-orientation': orientation,
      'data-disabled': disabled ? ('' as const) : undefined,
    },
  }
}

// -------------------------------------------------------------------------------------------------
// useTab - an individual trigger
// -------------------------------------------------------------------------------------------------

/** the fields the primary-pointer check reads off a web press event */
export type TabPressEvent = {
  button?: number
  ctrlKey?: boolean
}

export interface UseTabProps {
  baseId: string
  /** The value this trigger selects. */
  value: string
  /** The currently selected value. */
  selectedValue?: string
  disabled?: boolean
  activationMode?: TabsActivationMode
  onChange: (value: string) => void
}

export function useTab(props: UseTabProps) {
  const {
    baseId,
    value,
    selectedValue,
    disabled = false,
    activationMode = 'automatic',
    onChange,
  } = props

  const isSelected = value === selectedValue
  const triggerId = makeTriggerId(baseId, value)
  const contentId = makeContentId(baseId, value)

  return {
    isSelected,
    triggerId,
    contentId,
    tabProps: {
      role: 'tab' as const,
      id: triggerId,
      'aria-selected': isSelected,
      'aria-controls': contentId,
      'data-state': isSelected ? ('active' as const) : ('inactive' as const),
      'data-disabled': disabled ? ('' as const) : undefined,
      disabled,
      onPress: (event?: TabPressEvent) => {
        // ignore secondary and ctrl-clicks on web; native has no such notion
        const isPrimaryPointer =
          !isWeb || (event?.button === 0 && event?.ctrlKey === false)
        if (!disabled && !isSelected && isPrimaryPointer) {
          onChange(value)
        }
      },
      ...(isWeb && {
        onKeyDown: (event: React.KeyboardEvent) => {
          if (!disabled && [' ', 'Enter'].includes(event.key)) {
            onChange(value)
            event.preventDefault()
          }
        },
        onFocus: () => {
          if (!isSelected && !disabled && activationMode !== 'manual') {
            onChange(value)
          }
        },
      }),
    },
  }
}

// -------------------------------------------------------------------------------------------------
// useTabContent - a content panel
// -------------------------------------------------------------------------------------------------

export interface UseTabContentProps {
  baseId: string
  /** The value that selects this content. */
  value: string
  /** The currently selected value. */
  selectedValue?: string
  orientation?: TabsOrientation
  /** Mounts the content even when its value is not selected. */
  forceMount?: boolean
}

export function useTabContent(props: UseTabContentProps) {
  const { baseId, value, selectedValue, orientation = 'horizontal', forceMount } = props

  const isSelected = value === selectedValue
  const shouldMount = Boolean(forceMount) || isSelected

  return {
    isSelected,
    shouldMount,
    contentProps: {
      role: 'tabpanel' as const,
      id: makeContentId(baseId, value),
      'aria-labelledby': makeTriggerId(baseId, value),
      'data-state': isSelected ? ('active' as const) : ('inactive' as const),
      'data-orientation': orientation,
      hidden: !shouldMount,
      tabIndex: 0,
    },
  }
}
