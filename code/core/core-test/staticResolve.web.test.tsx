import { beforeAll, describe, expect, test } from 'vitest'
import config from '../config-default'
import {
  createTamagui,
  getConfig,
  getThemes,
  getTokens,
  resolveStatic,
  resolveStaticBatch,
  resolveStaticElement,
  type StaticResolveBatchPlan,
  type StaticResolveElementPlan,
} from '../web/src/static-resolve'

describe('static-resolve entry', () => {
  beforeAll(() => {
    createTamagui(config.getDefaultTamaguiConfig())
  })

  test('provides config accessors without DOM or React runtime', () => {
    const conf = getConfig()
    expect(conf).toBeDefined()
    expect(conf.tokens).toBeDefined()
    expect(getTokens()).toBeDefined()
    expect(getThemes()).toBeDefined()
  })

  test('resolves static styles for web element', () => {
    const element: StaticResolveElementPlan = {
      id: 'elem-1',
      props: {
        backgroundColor: 'red',
        padding: 20,
        margin: 10,
      },
    }

    const result = resolveStaticElement(element, 'web')
    expect(result.ok).toBe(true)
    expect(result.id).toBe('elem-1')
    expect(result.className).toBeDefined()
    expect(result.classNames).toBeDefined()
    expect(result.rules).toBeDefined()
    expect(result.css).toBeDefined()
    expect(result.rules!.length).toBeGreaterThan(0)
    expect(result.css!.length).toBeGreaterThan(0)
    // Check that CSS rules contain the expected properties
    const hasBgRule = result.css!.some(
      (r) => r.includes('background-color:red') || r.includes('background-color: red')
    )
    expect(hasBgRule).toBe(true)
  })

  test('resolves theme tokens for web element', () => {
    const element: StaticResolveElementPlan = {
      id: 'elem-tokens',
      props: {
        backgroundColor: '$background',
        borderRadius: '$2',
      },
    }

    const result = resolveStaticElement(element, 'web')
    expect(result.ok).toBe(true)
    expect(result.className).toBeDefined()
    expect(result.rules!.length).toBeGreaterThan(0)
  })

  test('resolves pseudo and media queries', () => {
    const element: StaticResolveElementPlan = {
      id: 'elem-pseudos',
      props: {
        backgroundColor: 'red',
        hoverStyle: {
          backgroundColor: 'blue',
        },
        pressStyle: {
          opacity: 0.8,
        },
        padding: 'gtSm:30',
      },
    }

    const result = resolveStaticElement(element, 'web')
    expect(result.ok).toBe(true)
    expect(result.hasMedia).toBeDefined()
    expect(result.className).toContain('_')
    expect(result.rules!.length).toBeGreaterThan(0)
  })

  test('resolves text styles when isText or isInput is configured', () => {
    const elementText: StaticResolveElementPlan = {
      id: 'elem-text',
      props: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 'bold',
      },
      staticConfig: {
        isText: true,
      },
    }

    const resultText = resolveStaticElement(elementText, 'web')
    expect(resultText.ok).toBe(true)
    expect(resultText.className).toContain('is_Text')
    expect(resultText.rules!.length).toBeGreaterThan(0)

    const elementInput: StaticResolveElementPlan = {
      id: 'elem-input',
      props: {
        fontSize: 14,
        color: '$color',
      },
      staticConfig: {
        isInput: true,
      },
    }

    const resultInput = resolveStaticElement(elementInput, 'web')
    expect(resultInput.ok).toBe(true)
    expect(resultInput.rules!.length).toBeGreaterThan(0)
  })

  test('merges staticConfig defaultProps into element props', () => {
    const element: StaticResolveElementPlan = {
      id: 'elem-defaults',
      props: {
        backgroundColor: 'blue',
      },
      staticConfig: {
        defaultProps: {
          padding: 20,
          borderRadius: 8,
        },
      },
    }

    const result = resolveStaticElement(element, 'web')
    expect(result.ok).toBe(true)
    expect(result.rules!.length).toBe(3)
  })

  test('preserves non-style props in viewProps and includes is_View class', () => {
    const element: StaticResolveElementPlan = {
      id: 'elem-viewprops',
      props: {
        backgroundColor: 'yellow',
        id: 'header-banner',
        'data-testid': 'banner-1',
        ariaLabel: 'Header',
      },
    }

    const result = resolveStaticElement(element, 'web')
    expect(result.ok).toBe(true)
    expect(result.className).toContain('is_View')
    expect(result.viewProps).toBeDefined()
    expect(result.viewProps!.id).toBe('header-banner')
    expect(result.viewProps!['data-testid']).toBe('banner-1')
  })

  test('resolves for native target with inline styles and no classnames', () => {
    const element: StaticResolveElementPlan = {
      id: 'elem-native',
      props: {
        backgroundColor: 'red',
        width: 100,
        height: 50,
      },
    }

    const result = resolveStaticElement(element, 'native')
    expect(result.ok).toBe(true)
    expect(result.className).toBeUndefined()
    expect(result.classNames).toBeUndefined()
    expect(result.style).toBeDefined()
    expect(result.style!.backgroundColor).toBe('red')
    expect(result.style!.width).toBe(100)
    expect(result.style!.height).toBe(50)
  })

  test('resolves batched elements', () => {
    const batch: StaticResolveBatchPlan = {
      target: 'web',
      elements: [
        { id: 1, props: { backgroundColor: 'red', padding: 10 } },
        { id: 2, props: { color: 'blue', fontSize: 14 }, staticConfig: { isText: true } },
        { id: 3, props: { margin: 20, hoverStyle: { opacity: 0.5 } } },
      ],
    }

    const batchResult = resolveStaticBatch(batch)
    expect(batchResult.results).toHaveLength(3)
    expect(batchResult.results[0].id).toBe(1)
    expect(batchResult.results[0].ok).toBe(true)
    expect(batchResult.results[0].className).toBeDefined()
    expect(batchResult.results[1].id).toBe(2)
    expect(batchResult.results[1].ok).toBe(true)
    expect(batchResult.results[2].id).toBe(3)
    expect(batchResult.results[2].ok).toBe(true)
  })

  test('polymorphic resolveStatic handles JSON string in and out', () => {
    const batch: StaticResolveBatchPlan = {
      target: 'web',
      elements: [
        { id: 'str-1', props: { backgroundColor: 'green' } },
        { id: 'str-2', props: { width: 100, height: 100 } },
      ],
    }

    const jsonInput = JSON.stringify(batch)
    const jsonOutput = resolveStatic(jsonInput)

    expect(typeof jsonOutput).toBe('string')
    const parsed = JSON.parse(jsonOutput as string)
    expect(parsed.results).toHaveLength(2)
    expect(parsed.results[0].id).toBe('str-1')
    expect(parsed.results[0].ok).toBe(true)
    expect(parsed.results[0].className).toBeDefined()
    expect(parsed.results[1].id).toBe('str-2')
    expect(parsed.results[1].ok).toBe(true)
  })

  test('performance: timing 1000-element batch resolution', () => {
    const sampleProps = [
      { backgroundColor: '$background', padding: '$4', margin: '$2' },
      { color: '$color', fontSize: '$4', fontWeight: '600' },
      { width: 200, height: 100, borderRadius: '$2', hoverStyle: { opacity: 0.9 } },
      { display: 'flex', flexDirection: 'column', gap: '$3', alignItems: 'center' },
      { borderWidth: 1, borderColor: '$borderColor', backgroundColor: '$color2' },
    ]

    const elements: StaticResolveElementPlan[] = []
    for (let i = 0; i < 1000; i++) {
      elements.push({
        id: i,
        props: sampleProps[i % sampleProps.length],
      })
    }

    const start = performance.now()
    const result = resolveStaticBatch({ target: 'web', elements })
    const elapsed = performance.now() - start

    expect(result.results).toHaveLength(1000)
    expect(result.results.every((r) => r.ok)).toBe(true)
    // 1000 elements should comfortably resolve in < 150ms in JS VM
    expect(elapsed).toBeLessThan(500)
  })
})
