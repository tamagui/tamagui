import { expect, test } from 'vitest'
import {
  flushNativeStyleLinks,
  getNativeStyleEngineCacheStats,
  linkNativeStyleMapping,
  removeNativeStyleScope,
  resolveNativeStyleMapping,
  setNativeStyleEngine,
  updateNativeStyleScope,
  type NativeStyleEngine,
} from '../web/src/helpers/nativeStyleEngine'

test('native mapping generations retain mounted links and bound memo maps', () => {
  const tableUpdates: { tableId: number; state: string; props: object }[] = []
  let linkedTable: unknown
  const engine: NativeStyleEngine = {
    link: (_ref, table) => {
      linkedTable = table
      return { id: 1, unlink: () => {} }
    },
    linkTables: (_refs, tableIds) => {
      linkedTable = tableIds[0]
      return 1
    },
    unlink: () => {},
    applyViewStates: () => {},
    setTableState: (tableId, state, props) =>
      tableUpdates.push({ tableId, state, props }),
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
    liveMapping,
    'cache-scope',
    'initial',
    initialTheme
  )!
  flushNativeStyleLinks()

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
    tableId: linkedTable,
    state: 'next',
    props: { backgroundColor: 'blue' },
  })

  link.unlink()
  removeNativeStyleScope('cache-scope')
  setNativeStyleEngine(null)
})

test('native mappings reset unsupported style values', () => {
  const engine: NativeStyleEngine = {
    link: () => ({ id: 1, unlink: () => {} }),
    linkTables: () => 1,
    unlink: () => {},
    applyViewStates: () => {},
    setTableState: () => {},
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
  setNativeStyleEngine(null)
})
