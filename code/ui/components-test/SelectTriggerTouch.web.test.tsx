import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Select } from '@tamagui/select'
import { Sheet } from '@tamagui/sheet'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { describe, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('web') as any)

// an adapted trigger opens on a touch's release and on a mouse's press. a
// touch that opened on touchstart mounted the sheet overlay under the finger,
// and the same tap's click then landed on it and closed the sheet again.
function renderAdaptedSelect() {
  const { getByRole } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Select defaultValue="a">
        <Select.Trigger aria-label="pick">
          <Select.Value placeholder="pick" />
        </Select.Trigger>
        <Select.Adapt when>
          <Sheet modal>
            <Sheet.Container>
              <Select.Adapt.Contents />
            </Sheet.Container>
          </Sheet>
        </Select.Adapt>
        <Select.Content>
          <Select.Viewport>
            <Select.Item index={0} value="a">
              <Select.ItemText>A</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select>
    </TamaguiProvider>
  )
  return getByRole('combobox')
}

// explicit timestamps: a mouse event within a second of a touch is the
// browser's compatibility echo of that touch, so each case keeps its own clock.
function at<E extends Event>(event: E, timeStamp: number) {
  Object.defineProperty(event, 'timeStamp', { value: timeStamp })
  return event
}

const touch = (type: 'touchstart' | 'touchend', timeStamp: number) =>
  at(new Event(type, { bubbles: true, cancelable: true }), timeStamp)

const mouse = (type: 'mousedown' | 'mouseup', timeStamp: number) =>
  at(new MouseEvent(type, { bubbles: true, cancelable: true }), timeStamp)

describe('adapted Select trigger', () => {
  test('a touch opens on release, not on touchstart', () => {
    const trigger = renderAdaptedSelect()

    fireEvent(trigger, touch('touchstart', 100))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent(trigger, touch('touchend', 180))
    fireEvent(trigger, mouse('mousedown', 190))
    fireEvent(trigger, mouse('mouseup', 191))
    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  test('a mouse opens on press', () => {
    const trigger = renderAdaptedSelect()

    fireEvent(trigger, mouse('mousedown', 10_000))
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    fireEvent(trigger, mouse('mouseup', 10_090))
    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })
})
