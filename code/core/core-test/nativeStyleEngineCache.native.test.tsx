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
