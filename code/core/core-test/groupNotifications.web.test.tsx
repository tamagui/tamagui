process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { GroupContext, TamaguiProvider, Text, View, createTamagui } from '@tamagui/core'

const config = createTamagui(getDefaultTamaguiConfig())
const DEPTH = 64

function NestedGroup({ index, active }: { index: number; active: boolean }) {
  const group = `nested-${index}`
  const parent = index === 0 ? 'root' : `nested-${index - 1}`
  const groupProps =
    index === 0
      ? {}
      : {
          opacity: `group-press/${parent}:${active ? 0.96 : 0.95}`,
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
        opacity="press:0.9"
        onPress={() => setActive((x) => !x)}
      >
        <NestedGroup index={0} active={active} />
      </View>
    </TamaguiProvider>
  )
}

function SwitchingGroupCase({
  groupContext,
  onReady,
}: {
  groupContext: React.ContextType<typeof GroupContext>
  onReady: (setGroup: React.Dispatch<React.SetStateAction<'row' | 'column'>>) => void
}) {
  const [group, setGroup] = React.useState<'row' | 'column'>('row')
  onReady(setGroup)

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <GroupContext.Provider value={groupContext}>
        {React.createElement(View, {
          disableClassName: true,
          backgroundColor:
            group === 'row' ? 'blue group-hover/row:red' : 'blue group-hover/column:red',
        })}
      </GroupContext.Provider>
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

  test('updates group subscriptions when the referenced group changes', () => {
    const rowDispose = vi.fn()
    const columnDispose = vi.fn()
    const rowSubscribe = vi.fn(() => rowDispose)
    const columnSubscribe = vi.fn(() => columnDispose)
    const groupContext = {
      row: { state: { pseudo: {} }, subscribe: rowSubscribe },
      column: { state: { pseudo: {} }, subscribe: columnSubscribe },
    } as React.ContextType<typeof GroupContext>
    let setGroup: React.Dispatch<React.SetStateAction<'row' | 'column'>> = () => {}

    render(
      <SwitchingGroupCase
        groupContext={groupContext}
        onReady={(nextSetGroup) => {
          setGroup = nextSetGroup
        }}
      />
    )
    expect(rowSubscribe).toHaveBeenCalledOnce()

    act(() => setGroup('column'))

    expect(rowDispose).toHaveBeenCalledOnce()
    expect(columnSubscribe).toHaveBeenCalledOnce()
  })
})
