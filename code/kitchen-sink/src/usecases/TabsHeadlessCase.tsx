/**
 * Test case: @tamagui/tabs-headless drives a working tablist with no Tamagui skin.
 *
 * The skinned `Tabs` consumes these same hooks, so this case is what keeps the
 * headless package from drifting back into an orphan reimplementation: it
 * renders plain DOM elements and asserts the hook alone produces the aria
 * wiring and the activation behavior, in both activation modes.
 */

import {
  useTab,
  useTabContent,
  useTabs,
  useTabsList,
  type TabsActivationMode,
} from '@tamagui/tabs-headless'
import React from 'react'

const TABS = ['alpha', 'beta', 'gamma']

export function TabsHeadlessCase() {
  return (
    <div style={{ padding: 32 }}>
      <HeadlessTabs activationMode="automatic" />
      <HeadlessTabs activationMode="manual" />
    </div>
  )
}

function HeadlessTabs({ activationMode }: { activationMode: TabsActivationMode }) {
  const { value, setValue, baseId, tabsProps } = useTabs({
    defaultValue: 'alpha',
    orientation: 'horizontal',
    activationMode,
  })
  const { listProps } = useTabsList({ orientation: 'horizontal' })

  return (
    <div {...tabsProps} data-testid={`${activationMode}-root`}>
      <div style={{ display: 'flex', gap: 8 }} {...listProps}>
        {TABS.map((tab) => (
          <HeadlessTab
            key={tab}
            baseId={baseId}
            value={tab}
            selectedValue={value}
            activationMode={activationMode}
            onChange={setValue}
            disabled={tab === 'gamma'}
            testID={`${activationMode}-tab-${tab}`}
          />
        ))}
      </div>

      {TABS.map((tab) => (
        <HeadlessContent
          key={tab}
          baseId={baseId}
          value={tab}
          selectedValue={value}
          testID={`${activationMode}-content-${tab}`}
        />
      ))}

      <div data-testid={`${activationMode}-selected`}>selected: {value}</div>
    </div>
  )
}

function HeadlessTab({
  testID,
  ...props
}: {
  baseId: string
  value: string
  selectedValue: string
  activationMode: TabsActivationMode
  onChange: (value: string) => void
  disabled?: boolean
  testID: string
}) {
  const { tabProps, isSelected } = useTab(props)
  const { onPress, ...rest } = tabProps

  return (
    <button
      type="button"
      {...rest}
      data-testid={testID}
      onClick={(event) => onPress(event.nativeEvent)}
      style={{ fontWeight: isSelected ? 700 : 400 }}
    >
      {props.value}
    </button>
  )
}

function HeadlessContent({
  testID,
  ...props
}: {
  baseId: string
  value: string
  selectedValue: string
  testID: string
}) {
  const { contentProps, shouldMount } = useTabContent({
    ...props,
    orientation: 'horizontal',
  })

  if (!shouldMount) {
    return null
  }

  return (
    <div {...contentProps} data-testid={testID}>
      content for {props.value}
    </div>
  )
}
