import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Select } from '@tamagui/select'
import { act, render } from '@testing-library/react'
import { describe, expect, it, vitest } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

global.ResizeObserver = class ResizeObserver {
  cb: any
  constructor(cb: any) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function SelectTest(props: { onOpenChange: (open: boolean) => void }) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Select open value="apple" onOpenChange={props.onOpenChange}>
        <Select.Trigger>
          <Select.Value placeholder="Fruit" />
        </Select.Trigger>

        <Select.Content>
          <Select.Viewport>
            <Select.Item index={0} value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item index={1} value="pear">
              <Select.ItemText>Pear</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select>
    </TamaguiProvider>
  )
}

const pointerDown = (node: Node) =>
  act(() => {
    node.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }))
  })

describe('Select outside-press dismiss (web)', () => {
  it('does not dismiss when pressing an item inside a shadow root', async () => {
    const onOpenChange = vitest.fn()
    render(<SelectTest onOpenChange={onOpenChange} />)

    const listbox = document.body.querySelector('[role=listbox]')
    expect(listbox).toBeTruthy()

    // simulate the floating content living inside a shadow tree, as happens
    // when an app portals its overlays into a shadow root (e.g. a browser
    // extension UI): move the portaled root hosting the listbox in there
    const portalRoot = Array.from(document.body.children).find((el) =>
      el.contains(listbox!)
    )!
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.appendChild(portalRoot)

    const option = shadow.querySelector('[role=option]')
    expect(option).toBeTruthy()

    // document-level listeners see this event retargeted to the shadow host —
    // composedPath()[0] must be used for the "inside the listbox?" check
    pointerDown(option!)
    expect(onOpenChange).not.toHaveBeenCalledWith(false)

    // presses genuinely outside the listbox still dismiss
    pointerDown(document.body)
    expect(onOpenChange).toHaveBeenCalledWith(false)

    // hand the portal root back to document.body so React can unmount it
    document.body.appendChild(portalRoot)
    host.remove()
  })

  it('dismisses on outside press in a regular DOM', async () => {
    const onOpenChange = vitest.fn()
    render(<SelectTest onOpenChange={onOpenChange} />)

    const listbox = document.body.querySelector('[role=listbox]')
    expect(listbox).toBeTruthy()

    const option = document.body.querySelector('[role=option]')
    expect(option).toBeTruthy()
    pointerDown(option!)
    expect(onOpenChange).not.toHaveBeenCalledWith(false)

    pointerDown(document.body)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
