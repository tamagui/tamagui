import { describe, expect, test } from 'vitest'
import { alignTransitionContributions } from '../transitionAlign'

const presets = new Set(['quick', 'bouncy'])

const entriesOf = (result: ReturnType<typeof alignTransitionContributions>) => {
  if (!result.ok) throw new Error(JSON.stringify(result.diagnostics))
  if (result.value.kind !== 'transition') throw new Error(result.value.kind)
  return result.value.entries
}

describe('alignTransitionContributions', () => {
  test('a longhand after the shorthand overrides only its component', () => {
    const entries = entriesOf(
      alignTransitionContributions([
        { prop: 'transition', value: 'opacity 200ms' },
        { prop: 'transitionDelay', value: '50ms' },
      ])
    )
    expect(entries).toEqual([
      {
        property: 'opacity',
        timing: { type: 'css', duration: '200ms', timingFunction: 'ease' },
        delay: '50ms',
        behavior: 'normal',
      },
    ])
  })

  test('a later shorthand resets an earlier longhand', () => {
    const entries = entriesOf(
      alignTransitionContributions([
        { prop: 'transitionDelay', value: '50ms' },
        { prop: 'transition', value: 'opacity 200ms' },
      ])
    )
    expect(entries[0].delay).toBe('0s')
  })

  test('the later of two same-longhand contributions wins wholesale', () => {
    const entries = entriesOf(
      alignTransitionContributions([
        { prop: 'transitionDuration', value: '100ms' },
        { prop: 'transitionDuration', value: '300ms' },
      ])
    )
    expect((entries[0].timing as any).duration).toBe('300ms')
  })

  test('lists pair positionally with the property list driving and cycling', () => {
    const entries = entriesOf(
      alignTransitionContributions([
        { prop: 'transitionProperty', value: 'opacity, transform' },
        { prop: 'transitionDuration', value: '150ms' },
      ])
    )
    expect(entries).toHaveLength(2)
    expect((entries[0].timing as any).duration).toBe('150ms')
    expect((entries[1].timing as any).duration).toBe('150ms')

    const driven = entriesOf(
      alignTransitionContributions([
        { prop: 'transitionProperty', value: 'opacity' },
        { prop: 'transitionDuration', value: '150ms, 250ms' },
      ])
    )
    expect(driven).toHaveLength(1)
    expect((driven[0].timing as any).duration).toBe('150ms')
  })

  test('one longhand overrides across a multi-item shorthand', () => {
    const entries = entriesOf(
      alignTransitionContributions([
        { prop: 'transition', value: 'opacity 150ms ease-out, transform 250ms' },
        { prop: 'transitionTimingFunction', value: 'linear' },
      ])
    )
    expect(entries).toHaveLength(2)
    expect((entries[0].timing as any).duration).toBe('150ms')
    expect((entries[0].timing as any).timingFunction).toBe('linear')
    expect((entries[1].timing as any).duration).toBe('250ms')
    expect((entries[1].timing as any).timingFunction).toBe('linear')
  })

  test('property, delay, and behavior compose freely around a preset', () => {
    const entries = entriesOf(
      alignTransitionContributions(
        [
          { prop: 'transition', value: 'quick' },
          { prop: 'transitionDelay', value: '50ms' },
          { prop: 'transitionProperty', value: 'opacity, transform' },
        ],
        presets
      )
    )
    expect(entries).toHaveLength(2)
    expect(entries[0].timing).toEqual({ type: 'preset', name: 'quick' })
    expect(entries[0].property).toBe('opacity')
    expect(entries[0].delay).toBe('50ms')
    expect(entries[1].timing).toEqual({ type: 'preset', name: 'quick' })
  })

  test('a timing longhand cannot partially override a preset', () => {
    const result = alignTransitionContributions(
      [
        { prop: 'transition', value: 'bouncy' },
        { prop: 'transitionDuration', value: '300ms' },
      ],
      presets
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.diagnostics[0].message).toContain('bouncy')
      expect(result.diagnostics[0].message).toContain('not decomposable')
    }
  })

  test('a preset after timing longhands is an ordinary reset', () => {
    const entries = entriesOf(
      alignTransitionContributions(
        [
          { prop: 'transitionDuration', value: '300ms' },
          { prop: 'transition', value: 'quick' },
        ],
        presets
      )
    )
    expect(entries[0].timing).toEqual({ type: 'preset', name: 'quick' })
  })

  test('a longhand cannot override a CSS-wide shorthand per longhand', () => {
    const result = alignTransitionContributions([
      { prop: 'transition', value: 'inherit' },
      { prop: 'transitionDelay', value: '1s' },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.diagnostics[0].message).toContain('inherit')
    }
    // the global alone survives untouched
    const alone = alignTransitionContributions([{ prop: 'transition', value: 'inherit' }])
    expect(alone.ok && alone.value.kind === 'global' && alone.value.value).toBe('inherit')
  })

  test('a later global replaces earlier longhands wholesale', () => {
    const result = alignTransitionContributions([
      { prop: 'transitionDelay', value: '1s' },
      { prop: 'transition', value: 'unset' },
    ])
    expect(result.ok && result.value.kind === 'global' && result.value.value).toBe(
      'unset'
    )
  })

  test('longhand validation flows through the one owner', () => {
    const result = alignTransitionContributions([
      { prop: 'transition', value: 'opacity 200ms' },
      { prop: 'transitionDuration', value: '-100ms' },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.diagnostics[0].code).toBe('transition-invalid-duration')
    }
  })
})
