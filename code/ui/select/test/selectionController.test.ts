import { describe, expect, test } from 'bun:test'

import {
  createSelectItemRegistry,
  createSelectSelectionController,
} from '../src/selectionController'

function createRegistry() {
  const registry = createSelectItemRegistry()
  registry.registerItem({ value: 'apple', disabled: false })
  registry.registerItem({ value: 'banana', disabled: true })
  registry.registerItem({ value: 'pear', disabled: false })
  registry.registerItem({ value: 'orange', disabled: false })
  return registry
}

describe('Select selection controller', () => {
  test('appends, removes, preserves order, and prevents duplicates', () => {
    const controller = createSelectSelectionController({
      mode: 'multiple',
      value: [],
      registry: createRegistry(),
    })

    expect(controller.toggle('apple')).toEqual(['apple'])
    expect(controller.toggle('pear')).toEqual(['apple', 'pear'])
    expect(controller.toggle('apple')).toEqual(['pear'])
    expect(controller.toggle('apple')).toEqual(['pear', 'apple'])
    expect(controller.setValue(['pear', 'pear', 'apple'])).toEqual(['pear', 'apple'])
  })

  test('does not toggle disabled or unregistered items', () => {
    const controller = createSelectSelectionController({
      mode: 'multiple',
      value: ['apple'],
      registry: createRegistry(),
    })

    expect(controller.toggle('banana')).toEqual(['apple'])
    expect(controller.toggle('missing')).toEqual(['apple'])
  })

  test('skips disabled items while moving active focus', () => {
    const controller = createSelectSelectionController({
      mode: 'multiple',
      value: [],
      registry: createRegistry(),
    })

    expect(controller.moveActive(1)?.value).toBe('apple')
    expect(controller.moveActive(1)?.value).toBe('pear')
    expect(controller.moveActive(-1)?.value).toBe('apple')
  })

  test('uses the last registered selected value as the selection anchor', () => {
    const controller = createSelectSelectionController({
      mode: 'multiple',
      value: ['apple', 'orange', 'pear'],
      registry: createRegistry(),
    })

    expect(controller.selectionAnchor()?.value).toBe('pear')
    expect(controller.selectionAnchorIndex()).toBe(2)
  })

  test('keeps unknown controlled values without inventing registry items', () => {
    const controller = createSelectSelectionController({
      mode: 'multiple',
      value: ['unknown', 'pear'],
      registry: createRegistry(),
    })

    expect(controller.isSelected('unknown')).toBe(true)
    expect(controller.registry.getItem('unknown')).toBeUndefined()
    expect(controller.selectionAnchor()?.value).toBe('pear')

    controller.setValue(['unknown'])
    expect(controller.selectionAnchor()?.value).toBe('apple')
  })

  test('single mode commits one scalar value', () => {
    const controller = createSelectSelectionController({
      mode: 'single',
      value: '',
      registry: createRegistry(),
    })

    expect(controller.toggle('pear')).toBe('pear')
    expect(controller.isSelected('pear')).toBe(true)
    expect(controller.toggle('pear')).toBe('pear')
  })
})
