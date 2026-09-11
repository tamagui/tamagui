import { afterEach, describe, expect, test } from 'vitest'
import {
  ROOT_SCOPE,
  getMirroredStateName,
  removeMirroredScope,
  resetMirror,
  setMirroredStateName,
} from '../mirror'
import { link, resolveSlots, setStateName } from '../index'

afterEach(() => {
  resetMirror()
})

describe('mirror', () => {
  test('root state applies to unknown scopes (inheritance)', () => {
    setMirroredStateName(ROOT_SCOPE, 'dark')
    expect(getMirroredStateName()).toBe('dark')
    expect(getMirroredStateName('some-scope')).toBe('dark')
  })

  test('scoped state overrides root, removal restores inheritance', () => {
    setMirroredStateName(ROOT_SCOPE, 'dark')
    setMirroredStateName('s1', 'light')
    expect(getMirroredStateName('s1')).toBe('light')
    removeMirroredScope('s1')
    expect(getMirroredStateName('s1')).toBe('dark')
  })
})

describe('resolveSlots', () => {
  test('merges base and active state props, state wins', () => {
    setStateName('dark')
    const resolved = resolveSlots({
      base: { borderRadius: 12, backgroundColor: 'red' },
      state: {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      },
    })
    expect(resolved).toEqual({ borderRadius: 12, backgroundColor: '#000' })
  })

  test('no state set yields base only', () => {
    const resolved = resolveSlots({
      base: { padding: 4 },
      state: { dark: { backgroundColor: '#000' } },
    })
    expect(resolved).toEqual({ padding: 4 })
  })

  test('scoped resolution follows the scoped state', () => {
    setStateName('dark')
    setStateName('light', 's1')
    const slots = {
      state: {
        dark: { backgroundColor: '#000' },
        light: { backgroundColor: '#fff' },
      },
    }
    expect(resolveSlots(slots)).toEqual({ backgroundColor: '#000' })
    expect(resolveSlots(slots, 's1')).toEqual({ backgroundColor: '#fff' })
  })
})

describe('web fallback', () => {
  test('link returns null (no engine on web)', () => {
    expect(link({}, { base: { padding: 1 } })).toBeNull()
  })
})
