import { describe, expect, test } from 'vitest'
import {
  stateVocabulary,
  stateNames,
  stateToModifier,
  modifierToState,
  stateToSelector,
  stateToPseudoProp,
  componentStateNames,
} from '..'

// A1 state vocabulary — the join tables the registry generator and the Tailwind
// bridge read as the single source of truth. these tests pin the joins (state ->
// modifier / selector / pseudo-prop, and the reverse modifier -> state including
// aliases) so a future edit to states.ts can't silently drift the contract.

describe('A1 state vocabulary joins', () => {
  test('the nine canonical states are exactly these', () => {
    expect(stateNames).toEqual([
      'pressed',
      'disabled',
      'starting',
      'ending',
      'open',
      'checked',
      'highlighted',
      'selected',
      'invalid',
    ])
  })

  test('every state resolves to a Tailwind modifier', () => {
    for (const state of stateNames) {
      expect(stateToModifier[state], `modifier for ${state}`).toBeTruthy()
    }
    expect(stateToModifier.open).toBe('data-[state=open]')
    expect(stateToModifier.selected).toBe('data-[state=active]')
    expect(stateToModifier.invalid).toBe('aria-invalid')
    expect(stateToModifier.pressed).toBe('press')
  })

  test('the canonical modifier round-trips back to its state', () => {
    for (const state of stateNames) {
      expect(modifierToState[stateToModifier[state]]).toBe(state)
    }
  })

  test('aliases resolve to the canonical state, and bare `active` is pressed not selected', () => {
    // reconciliation words
    expect(modifierToState['active']).toBe('pressed')
    expect(modifierToState['starting']).toBe('starting')
    expect(modifierToState['ending']).toBe('ending')
    // component-tier aliases grounded against the emitted attributes
    expect(modifierToState['data-[state=on]']).toBe('checked')
    expect(modifierToState['aria-checked']).toBe('checked')
    expect(modifierToState['data-[invalid]']).toBe('invalid')
    // the `selected` collision guard: item selection is data-[state=active],
    // but the bare word `active` must stay an alias of pressed (`:active`).
    expect(modifierToState['active']).not.toBe('selected')
  })

  test('component-tier states carry a web selector; pseudo-tier states carry a pseudo-prop', () => {
    const componentEntries = stateVocabulary.filter((e) => e.tier === 'component')
    const pseudoEntries = stateVocabulary.filter((e) => e.tier === 'pseudo')

    expect(componentStateNames).toEqual(componentEntries.map((e) => e.state))

    for (const e of componentEntries) {
      expect(stateToSelector[e.state], `selector for ${e.state}`).toBeTruthy()
      expect(stateToPseudoProp[e.state]).toBeUndefined()
    }
    for (const e of pseudoEntries) {
      expect(stateToPseudoProp[e.state], `pseudo-prop for ${e.state}`).toBeTruthy()
      expect(stateToSelector[e.state]).toBeUndefined()
    }
  })

  test('component selectors match the attributes the behavior packages emit', () => {
    // grounded against the runtime emitters (dialog/popover/... -> data-state=open,
    // tabs/select item -> data-state=active, checkbox/switch -> data-state=checked,
    // menu -> data-highlighted, field -> aria-invalid).
    expect(stateToSelector.open).toBe('[data-state="open"]')
    expect(stateToSelector.checked).toBe('[data-state="checked"]')
    expect(stateToSelector.highlighted).toBe('[data-highlighted]')
    expect(stateToSelector.selected).toBe('[data-state="active"]')
    expect(stateToSelector.invalid).toBe('[aria-invalid="true"]')
  })

  test('pseudo-tier props are the core pseudo-style props', () => {
    expect(stateToPseudoProp.pressed).toBe('pressStyle')
    expect(stateToPseudoProp.disabled).toBe('disabledStyle')
    expect(stateToPseudoProp.starting).toBe('enterStyle')
    expect(stateToPseudoProp.ending).toBe('exitStyle')
  })
})
