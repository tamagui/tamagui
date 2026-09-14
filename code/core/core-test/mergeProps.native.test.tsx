import { createTamagui, mergeProps } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('mergeProps', () => {
  test('maintains prop order based on the last spread object', () => {
    const result = mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
    expect(Object.keys(result)).toEqual(['b', 'a'])
    expect(result).toEqual({ b: 1, a: 2 })
  })

  test('replaces flat values without parsing style syntax', () => {
    const result = mergeProps(
      {
        backgroundColor: 'green press:blue',
        scale: '1 press:0.95',
        variant: 'default',
      },
      {
        variant: 'primary',
        backgroundColor: 'press:orange',
      }
    )

    expect(Object.keys(result)).toEqual(['scale', 'variant', 'backgroundColor'])
    expect(result.variant).toBe('primary')
    expect(result.backgroundColor).toBe('press:orange')
    expect(result.scale).toBe('1 press:0.95')
  })

  test('the later flat value replaces the earlier string', () => {
    const result = mergeProps(
      { opacity: '0.5 hover:0.7 press:0.8' },
      { opacity: '1 hover:0.9' }
    )

    expect(result.opacity).toBe('1 hover:0.9')
  })

  test('plain string props still use ordinary replacement', () => {
    expect(mergeProps({ id: 'default' }, { id: 'runtime' })).toEqual({
      id: 'runtime',
    })
  })
})

describe('mergeProps - React Native values', () => {
  test('transform arrays are replaced intact', () => {
    const result = mergeProps(
      { transform: [{ scale: 1 }] },
      { transform: [{ scale: 0.9 }] }
    )

    expect(result.transform).toEqual([{ scale: 0.9 }])
  })

  test('shadow properties maintain their structure', () => {
    const result = mergeProps(
      {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      {
        shadowOpacity: 0.5,
        shadowRadius: 5,
      }
    )

    expect(result.shadowColor).toBe('black')
    expect(result.shadowOffset).toEqual({ width: 0, height: 2 })
    expect(result.shadowOpacity).toBe(0.5)
    expect(result.shadowRadius).toBe(5)
  })

  test('flex properties merge normally', () => {
    const result = mergeProps(
      {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
      },
      {
        flexDirection: 'row',
        justifyContent: 'center',
      }
    )

    expect(result).toEqual({
      flex: 1,
      alignItems: 'stretch',
      flexDirection: 'row',
      justifyContent: 'center',
    })
  })
})
