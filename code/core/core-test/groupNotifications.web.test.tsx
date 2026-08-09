process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { TamaguiProvider, Text, View, createTamagui } from '@tamagui/core'

const config = createTamagui(getDefaultTamaguiConfig())
const DEPTH = 64

function NestedGroup({ index, active }: { index: number; active: boolean }) {
  const group = `nested-${index}`
  const parent = index === 0 ? 'root' : `nested-${index - 1}`
  const groupProps =
    index === 0
      ? {}
      : {
          [`$group-${parent}-press`]: {
            opacity: active ? 0.96 : 0.95,
          },
        }

  return (
    <View disableClassName group={group} {...groupProps}>
      {index >= DEPTH ? (
        <Text testID="nested-group-ready">{active ? 'active' : 'idle'}</Text>
      ) : (
        <NestedGroup index={index + 1} active={active} />
      )}
    </View>
  )
}

function NestedGroupCase() {
  const [active, setActive] = React.useState(false)

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View
        testID="nested-group-root"
        disableClassName
        group="root"
        pressStyle={{ opacity: 0.9 }}
        onPress={() => setActive((x) => !x)}
      >
        <NestedGroup index={0} active={active} />
      </View>
    </TamaguiProvider>
  )
}

describe('group notifications', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('unchanged nested group notifications do not cascade into a render loop', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<NestedGroupCase />)
    expect(screen.getByTestId('nested-group-ready').textContent).toBe('idle')

    fireEvent.click(screen.getByTestId('nested-group-root'))

    expect(screen.getByTestId('nested-group-ready').textContent).toBe('active')
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining('Maximum update depth exceeded')
    )
  })
})
