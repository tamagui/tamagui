import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { Accordion } from '@tamagui/accordion'
import { Collapsible } from '@tamagui/collapsible'
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig())

// aria-controls must name an element that exists: an id with no element behind
// it is an invalid aria reference (lighthouse and axe flag every closed item)
function expectControlsResolve(container: HTMLElement) {
  for (const trigger of container.querySelectorAll('[aria-controls]')) {
    const id = trigger.getAttribute('aria-controls')!
    expect(container.ownerDocument.getElementById(id)).not.toBeNull()
  }
}

describe('Collapsible aria-controls', () => {
  test('points at the rendered content and is dropped while closed', () => {
    const rendered = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Collapsible>
          <Collapsible.Trigger data-testid="trigger">toggle</Collapsible.Trigger>
          <Collapsible.Content data-testid="content">body</Collapsible.Content>
        </Collapsible>
      </TamaguiProvider>
    )

    const trigger = rendered.getByTestId('trigger')
    expect(trigger).not.toHaveAttribute('aria-controls')

    fireEvent.click(trigger)
    const content = rendered.getByTestId('content')
    expect(trigger.getAttribute('aria-controls')).toBe(content.id)
    expectControlsResolve(rendered.container)
  })

  test('accordion items only reference content that is mounted', () => {
    const rendered = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Accordion type="single" collapsible defaultValue="a">
          {['a', 'b', 'c'].map((value) => (
            <Accordion.Item key={value} value={value}>
              <Accordion.Trigger>{value}</Accordion.Trigger>
              <Accordion.Content>{value} body</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </TamaguiProvider>
    )

    expect(rendered.container.querySelectorAll('[aria-controls]')).toHaveLength(1)
    expectControlsResolve(rendered.container)
  })
})
