import { expect, test } from 'vitest'
import {
  getNativeStyleEngineCacheStats,
  linkNativeStyleMapping,
  removeNativeStyleScope,
  resolveNativeStyleMapping,
  setNativeStyleEngine,
  updateNativeStyleScope,
  type NativeStyleEngine,
  type NativeViewStateTableUpdate,
} from '../web/src/helpers/nativeStyleEngine'

test('native mapping generations retain mounted links and bound memo maps', () => {
  const tableUpdates: NativeViewStateTableUpdate[] = []
  const engine: NativeStyleEngine = {
    link: () => ({ id: 1, unlink: () => {} }),
    applyViewStates: () => {},
    updateViewStateTables: (entries) => tableUpdates.push(...entries),
    processStyleColors: (props) => props,
    setStateName: () => {},
    removeScope: () => {},
  }
  const initialTheme = { color: 'red' }
  const nextTheme = { color: 'blue' }
  const liveMapping = { backgroundColor: 'color' }

  setNativeStyleEngine(engine)
  updateNativeStyleScope('cache-scope', 'initial', initialTheme)
  const link = linkNativeStyleMapping(
    {},
    {},
    liveMapping,
    'cache-scope',
    'initial',
    initialTheme
  )!

  for (let i = 0; i <= 10_000; i++) {
    resolveNativeStyleMapping(liveMapping, `state-${i}`, initialTheme)
  }
  expect(getNativeStyleEngineCacheStats().states).toBeLessThanOrEqual(10_000)

  for (let i = 0; i <= 10_000; i++) {
    resolveNativeStyleMapping({ [`property-${i}`]: 'color' }, 'initial', initialTheme)
  }
  const stats = getNativeStyleEngineCacheStats()
  expect(stats.mappings).toBeLessThanOrEqual(10_000)
  expect(stats.activeMappings).toBe(1)

  updateNativeStyleScope('cache-scope', 'next', nextTheme)
  expect(tableUpdates.at(-1)).toEqual({
    id: link.id,
    state: 'next',
    props: { backgroundColor: 'blue' },
  })

  link.unlink()
  removeNativeStyleScope('cache-scope')
  setNativeStyleEngine(null)
})

test('native mappings reset unsupported style values', () => {
  let linkedBase: Record<string, unknown> | undefined
  const engine: NativeStyleEngine = {
    link: (_ref, slots) => {
      linkedBase = slots.base
      return { id: 1, unlink: () => {} }
    },
    applyViewStates: () => {},
    updateViewStateTables: () => {},
    processStyleColors: (props) => props,
    setStateName: () => {},
    removeScope: () => {},
  }

  setNativeStyleEngine(engine)
  expect(
    resolveNativeStyleMapping(
      {
        outlineStyle: 'outlineStyle',
        outlineWidth: 'outlineWidth',
        outlineColor: 'outlineColor',
        outlineOffset: 'outlineOffset',
        minHeight: 'minHeight',
      },
      'initial',
      {
        outlineStyle: 'none',
        outlineWidth: 2,
        outlineColor: 'red',
        outlineOffset: 3,
        minHeight: 'max-content',
      }
    )
  ).toEqual({
    outlineStyle: null,
    outlineWidth: null,
    outlineColor: null,
    outlineOffset: null,
    minHeight: null,
  })
  linkNativeStyleMapping(
    {},
    {
      outlineStyle: 'none',
      outlineWidth: 2,
      outlineColor: 'red',
      outlineOffset: 3,
      minHeight: 'max-content',
    },
    {},
    'outline-scope',
    'initial',
    {}
  )
  expect(linkedBase).toEqual({})
  setNativeStyleEngine(null)
})
