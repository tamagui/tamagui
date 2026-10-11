import { beforeAll, describe, expect, test } from 'vitest'
import config from '../config-default'
import {
  createTamagui,
  getConfig,
  resolveStatic,
  resolveStaticBatch,
  resolveStaticElement,
  type StaticResolveBatchPlan,
  type StaticResolveElementPlan,
} from '../web/src/static-resolve'

describe('static-resolve native entry', () => {
  beforeAll(() => {
    createTamagui(config.getDefaultTamaguiConfig('native'))
  })

  test('resolves config in native mode', () => {
    const conf = getConfig()
    expect(conf).toBeDefined()
    expect(conf.tokens).toBeDefined()
  })

  test('resolves static styles for native element', () => {
    const element: StaticResolveElementPlan = {
      id: 'native-1',
      props: {
        backgroundColor: 'red',
        width: 120,
        height: 80,
      },
    }

    const result = resolveStaticElement(element, 'native')
    expect(result.ok).toBe(true)
    expect(result.id).toBe('native-1')
    expect(result.className).toBeUndefined()
    expect(result.classNames).toBeUndefined()
    expect(result.style).toBeDefined()
    expect(result.style!.backgroundColor).toBe('red')
    expect(result.style!.width).toBe(120)
    expect(result.style!.height).toBe(80)
  })

  test('resolves theme tokens for native element', () => {
    const element: StaticResolveElementPlan = {
      id: 'native-tokens',
      props: {
        backgroundColor: '$background',
      },
    }

    const result = resolveStaticElement(element, 'native')
    expect(result.ok).toBe(true)
    expect(result.style).toBeDefined()
    expect(result.style!.backgroundColor).toBeDefined()
  })

  test('bails out on native for media and pseudo conditional programs', () => {
    const mediaElement: StaticResolveElementPlan = {
      id: 'native-media',
      props: {
        padding: 'sm:20px',
      },
    }
    const mediaResult = resolveStaticElement(mediaElement, 'native')
    expect(mediaResult.ok).toBe(false)
    expect(mediaResult.bailout?.reason).toBe('local/unsupported-target')

    const pseudoElement: StaticResolveElementPlan = {
      id: 'native-pseudo',
      props: {
        backgroundColor: 'hover:blue',
      },
    }
    const pseudoResult = resolveStaticElement(pseudoElement, 'native')
    expect(pseudoResult.ok).toBe(false)
    expect(pseudoResult.bailout?.reason).toBe('local/unsupported-target')
  })

  test('resolves batched native elements via JSON string', () => {
    const batch: StaticResolveBatchPlan = {
      target: 'native',
      elements: [
        { id: 101, props: { backgroundColor: 'blue', width: 50 } },
        { id: 102, props: { backgroundColor: 'green', height: 100 } },
      ],
    }

    const jsonOut = resolveStatic(JSON.stringify(batch))
    expect(typeof jsonOut).toBe('string')
    const parsed = JSON.parse(jsonOut as string)
    expect(parsed.results).toHaveLength(2)
    expect(parsed.results[0].id).toBe(101)
    expect(parsed.results[0].ok).toBe(true)
    expect(parsed.results[0].style.backgroundColor).toBe('blue')
    expect(parsed.results[0].style.width).toBe(50)
    expect(parsed.results[1].id).toBe(102)
    expect(parsed.results[1].ok).toBe(true)
    expect(parsed.results[1].style.backgroundColor).toBe('green')
    expect(parsed.results[1].style.height).toBe(100)
  })
})
