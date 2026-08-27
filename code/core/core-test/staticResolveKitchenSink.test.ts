import { beforeAll, describe, expect, test } from 'vitest'
import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css/extras'
import { defaultConfig } from '@tamagui/config/v6'
import {
  createTamagui,
  getConfig,
  resolveStatic,
  resolveStaticBatch,
  type StaticResolveBatchPlan,
  type StaticResolveElementPlan,
} from '../web/src/static-resolve'

const animations = createAnimationsCSS({
  fast: '100ms ease-out',
  medium: '300ms ease-out',
  slow: '500ms ease-out',
})

const kitchenSinkConfig = {
  ...defaultConfig,
  animations,
}

describe('kitchen-sink static-resolve benchmark & validation', () => {
  beforeAll(() => {
    createTamagui(kitchenSinkConfig)
  })

  test('kitchen-sink config loads successfully into static-resolve', () => {
    const conf = getConfig()
    expect(conf).toBeDefined()
    expect(conf.themes).toBeDefined()
    expect(Object.keys(conf.themes).length).toBeGreaterThan(0)
  })

  test('resolves kitchen-sink real-world component styles', () => {
    const elements: StaticResolveElementPlan[] = [
      {
        id: 'ks-card',
        props: {
          backgroundColor: '$background',
          borderRadius: '$4',
          padding: '$4',
          borderColor: '$borderColor',
          borderWidth: 1,
          hoverStyle: {
            borderColor: '$color8',
            scale: 1.02,
          },
          pressStyle: {
            scale: 0.98,
          },
        },
      },
      {
        id: 'ks-button',
        props: {
          backgroundColor: '$color8',
          color: '$color1',
          paddingVertical: '$2',
          paddingHorizontal: '$4',
          borderRadius: '$2',
          hoverStyle: {
            backgroundColor: '$color9',
          },
        },
      },
      {
        id: 'ks-heading',
        props: {
          color: '$color12',
          fontSize: '$8',
          lineHeight: '$8',
          fontWeight: '700',
        },
        staticConfig: {
          isText: true,
        },
      },
    ]

    const batchResult = resolveStaticBatch({ target: 'web', elements })
    expect(batchResult.results).toHaveLength(3)
    expect(batchResult.results.every((r) => r.ok)).toBe(true)
    expect(batchResult.results[0].className).toBeDefined()
    expect(batchResult.results[1].className).toBeDefined()
    expect(batchResult.results[2].className).toBeDefined()
  })

  test('times a cold 1k-element resolveStatic batch', () => {
    const templates = [
      {
        props: {
          backgroundColor: '$background',
          padding: '$4',
          margin: '$2',
          borderRadius: '$3',
          borderWidth: 1,
          borderColor: '$borderColor',
        },
      },
      {
        props: {
          color: '$color',
          fontSize: '$4',
          fontWeight: 'bold',
          lineHeight: '$4',
        },
        staticConfig: { isText: true },
      },
      {
        props: {
          backgroundColor: '$color5',
          hoverStyle: { backgroundColor: '$color6' },
          pressStyle: { opacity: 0.8 },
          width: 200,
          height: 50,
        },
      },
      {
        props: {
          display: 'flex',
          flexDirection: 'column',
          gap: '$3',
          paddingHorizontal: '$5',
        },
      },
      {
        props: {
          backgroundColor: '$color2',
          borderColor: '$borderColor',
          borderWidth: 2,
          borderRadius: '$5',
          padding: '$6',
        },
      },
    ]

    const elements: StaticResolveElementPlan[] = []
    for (let i = 0; i < 1000; i++) {
      const template = templates[i % templates.length]
      elements.push({
        id: i,
        props: { ...template.props },
        staticConfig: template.staticConfig,
      })
    }

    const batchPlan: StaticResolveBatchPlan = {
      target: 'web',
      elements,
    }

    const jsonInput = JSON.stringify(batchPlan)

    const start = performance.now()
    const jsonOutput = resolveStatic(jsonInput)
    const elapsed = performance.now() - start

    expect(typeof jsonOutput).toBe('string')
    const parsed = JSON.parse(jsonOutput as string)
    expect(parsed.results).toHaveLength(1000)
    expect(parsed.results.every((r: any) => r.ok)).toBe(true)

    // Cold 1k elements batch resolution time
    // In Node/V8/Bun this is typically 15-50ms
    expect(elapsed).toBeLessThan(500)
  })
})
