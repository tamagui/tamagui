import { resolve } from 'node:path'

import {
  ProjectGraph,
  applyLoweredModule,
  lowerModule,
  materializeModule,
  resolvedModuleId,
  yukuFactory,
  type CompilerTarget,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'
import {
  createTamaguiCompilerHost,
  loadTamaguiSync,
  type TamaguiProjectInfo,
} from '@tamagui/static'
import { beforeAll, describe, expect, test } from 'vitest'

import {
  legacyHardWebClassNames,
  legacyHardWebCompactCss,
} from './fixtures/e3-hard-web-legacy'

const configPath = resolve(import.meta.dirname, 'lib/tamagui.config.cjs')
const coreId = resolvedModuleId('/virtual/@tamagui/core.mjs')
let projectInfo: TamaguiProjectInfo

beforeAll(() => {
  projectInfo = loadTamaguiSync({
    platform: 'web',
    config: configPath,
    components: ['@tamagui/core'],
  })
})

function compile(source: string, target: CompilerTarget = 'web') {
  const id = resolvedModuleId(
    resolve(import.meta.dirname, `fixtures/e3-${target}-lowerer.tsx`)
  )
  const graph = new ProjectGraph(yukuFactory, {
    modules: [
      {
        id,
        source,
        imports: [
          { specifier: '@tamagui/core', resolvedId: coreId, external: true },
          {
            specifier: 'react/jsx-runtime',
            resolvedId: resolvedModuleId('/virtual/react-jsx-runtime.mjs'),
            external: true,
          },
        ],
      },
    ],
  })
  const host = createTamaguiCompilerHost({
    target,
    tamaguiConfig: projectInfo.tamaguiConfig!,
    components: projectInfo.components!,
    componentModules: [{ moduleName: '@tamagui/core', resolvedId: coreId }],
  })
  const plan = lowerModule({
    module: materializeModule(graph, id),
    source,
    target,
    host,
    options: { projectGeneration: 'e3-fixture-v1' },
  })
  return { id, plan, output: applyLoweredModule(source, id, plan) }
}

function codes(plan: ReturnType<typeof compile>['plan']) {
  return plan.diagnostics.map(({ code }) => code)
}

function loweredClassNames(code: string): string[] {
  return [...code.matchAll(/className="([^"]*)"/g)].map((match) => match[1]!)
}

function compactCss(css: string): string {
  return css.replace(/\s+/g, '')
}

describe('E3 shared Tamagui lowerer', () => {
  test('preserves ordered className overrides and emits pseudo/media/theme/group/font CSS', () => {
    const source = `
// π🙂 UTF-16 parity sentinel
import { Text, View } from '@tamagui/core'
const override = { padding: 14 }
export const App = () => (
  <View
    className="host-class"
    padding={10}
    {...override}
    hoverStyle={{ opacity: 0.5 }}
    $sm={{ margin: 3 }}
    $theme-dark={{ color: '$color' }}
    group="card"
    data-sentinel="untouched"
  >
    <Text fontFamily="$body">font</Text>
  </View>
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toEqual({
      found: 2,
      lowered: 2,
      flattened: 2,
      styled: 0,
      bailed: 0,
    })
    expect(output.code).toMatch(/<div\s+className="[^"]*\bhost-class\b/)
    const className = output.code.match(/<div\s+className="([^"]+)"/)?.[1] ?? ''
    expect(className.indexOf('host-class')).toBeGreaterThan(className.indexOf('_pl-14px'))
    expect(output.code).toContain('t_group_card')
    expect(output.code).toContain('data-sentinel="untouched"')
    expect(output.code).not.toContain('padding={10}')
    expect(output.code).not.toContain('{...override}')
    expect(output.code).not.toContain('group="card"')
    expect(plan.css).toContain('padding-top:14px')
    expect(plan.css).toContain('@media (hover)')
    expect(plan.css).toContain('@media (max-width: 800px)')
    expect(plan.css).toContain('.t_dark')
    expect(plan.css).toContain('container-name: card')
    expect(plan.css).toContain('font-family')
    expect(output.map?.sourcesContent).toEqual([source])
  })

  test('matches the frozen legacy class and CSS output for the hard web style corpus', () => {
    const source = `
import { Text, View } from '@tamagui/core'
export const App = () => (
  <View
    className="host-class"
    padding={14}
    hoverStyle={{ opacity: 0.5 }}
    $sm={{ margin: 3 }}
    $theme-dark={{ color: '$color' }}
    group="card"
    data-sentinel="yes"
  >
    <Text fontFamily="$body">font</Text>
  </View>
)
`
    const { plan, output } = compile(source)
    expect(loweredClassNames(output.code)).toEqual(legacyHardWebClassNames)
    expect(compactCss(plan.css)).toBe(legacyHardWebCompactCss)
  })

  test('unsafe candidate bailout is all-or-nothing and does not block a sibling', () => {
    const source = `
import { View } from '@tamagui/core'
export const App = () => (
  <>
    <View
      transition="fast"
      padding={12}
      hoverStyle={{ padding: 16 }}
      data-bailed="exact"
    />
    <View padding={16} data-lowered="yes" />
  </>
)
`
    const { plan, output } = compile(source)
    expect(codes(plan)).toEqual(['local/unsupported-target'])
    expect(plan.stats).toEqual({
      found: 2,
      lowered: 1,
      flattened: 1,
      styled: 0,
      bailed: 1,
    })
    expect(output.code).toContain('transition="fast"')
    expect(output.code).toContain('padding={12}')
    expect(output.code).toContain('hoverStyle={{ padding: 16 }}')
    expect(output.code).toContain('data-bailed="exact"')
    expect(output.code).toContain('<div className=')
    expect(output.code).toContain('data-lowered="yes"')
    expect(plan.css).toContain('padding-top:16px')
    expect(plan.css).not.toContain('padding-top:12px')
  })

  test('extracts static styles while retaining a dynamic style prop on the Tamagui component', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ width }) => (
  <View width={width} padding={12} data-partial="dynamic" />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toEqual({
      found: 1,
      lowered: 1,
      flattened: 0,
      styled: 0,
      bailed: 0,
    })
    expect(output.code).toMatch(
      /<View width=\{width\} className="[^"]+" data-partial="dynamic" \/>/
    )
    expect(output.code).not.toContain('padding={12}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('width:')
  })

  test('keeps current transition candidates byte-identical for every animation driver', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View
    transition="fast"
    animateOnly={['padding']}
    padding={12}
    data-runtime="transition"
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual(['local/unsupported-target'])
    expect(plan.stats).toMatchObject({ lowered: 0, flattened: 0, bailed: 1 })
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('keeps a dynamic transition candidate byte-identical', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ transition, width }) => (
  <View transition={transition} width={width} padding={12} />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual(['local/dynamic-style-value'])
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('retains compiled-jsx runtime props while extracting static siblings', () => {
    const source = `
import { View } from '@tamagui/core'
import { jsx } from 'react/jsx-runtime'
export const Card = ({ width }) => jsx(View, {
  width,
  padding: 12,
  'data-partial': 'compiled',
})
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 1, flattened: 0, bailed: 0 })
    expect(output.code).toMatch(/jsx\(View, \{\s*width,\s*className: "[^"]+"/)
    expect(output.code).not.toContain('padding: 12')
    expect(plan.css).toContain('padding-top:12px')
  })

  test('leaves native dynamic candidates byte-identical', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ width }) => (
  <View width={width} padding={12} data-runtime="native" />
)
`
    const { plan, output } = compile(source, 'native')

    expect(codes(plan)).toEqual(['local/dynamic-style-value'])
    expect(plan.stats).toMatchObject({ lowered: 0, flattened: 0, bailed: 1 })
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('keeps the complete runtime candidate when a dynamic style can overlap extraction', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ paddingLeft }) => (
  <View padding={12} paddingLeft={paddingLeft} data-runtime="precedence" />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual(['local/dynamic-style-value'])
    expect(plan.stats).toEqual({
      found: 1,
      lowered: 0,
      flattened: 0,
      styled: 0,
      bailed: 1,
    })
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('compares normalized transform ownership before partial extraction', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ x }) => (
  <View x={x} transform={[{ scale: 2 }]} padding={12} />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('x={x}')
    expect(output.code).toContain('transform={[{ scale: 2 }]}')
    expect(output.code).not.toContain('padding={12}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('transform:')
  })

  test('compares logical and physical property ownership before partial extraction', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ width }) => (
  <View width={width} inlineSize={120} opacity={0.5} />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('width={width}')
    expect(output.code).toContain('inlineSize={120}')
    expect(output.code).not.toContain('opacity={0.5}')
    expect(plan.css).toContain('opacity:0.5')
    expect(plan.css).not.toContain('width:120px')
  })

  test('compares value-dependent flex and normalized shadow ownership', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ flex, shadowColor }) => (
  <View
    flex={flex}
    flexBasis={20}
    shadowColor={shadowColor}
    shadowOffset={{ width: 2, height: 3 }}
    padding={12}
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('flex={flex}')
    expect(output.code).toContain('flexBasis={20}')
    expect(output.code).toContain('shadowColor={shadowColor}')
    expect(output.code).toContain('shadowOffset={{ width: 2, height: 3 }}')
    expect(output.code).not.toContain('padding={12}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('flex-basis:')
    expect(plan.css).not.toContain('box-shadow:')
  })

  test('uses normalized ownership for compiled jsx props', () => {
    const source = `
import { View } from '@tamagui/core'
import { jsx } from 'react/jsx-runtime'
export const Card = ({ x }) => jsx(View, {
  x,
  transform: [{ scale: 2 }],
  padding: 12,
})
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('x,')
    expect(output.code).toContain('transform: [{ scale: 2 }]')
    expect(output.code).not.toContain('padding: 12')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('transform:')
  })

  test('keeps styled defaults and runtime overrides on one runtime path', () => {
    const source = `
import { View, styled } from '@tamagui/core'
const Card = styled(View, { padding: 8 })
export const App = ({ width }) => (
  <Card width={width} padding={12} />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual(['local/dynamic-style-value'])
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('keeps partial extraction source maps tied to the original module', () => {
    const source = `
// 🙂 utf-16 sentinel
import { View } from '@tamagui/core'
export const Card = ({ width }) => <View width={width} padding={12} />
`
    const { output } = compile(source)

    expect(output.changed).toBe(true)
    expect(output.map?.sourcesContent).toEqual([source])
  })

  test('keeps an opaque dynamic style object byte-identical', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ style }) => (
  <View padding={12} style={style} data-runtime="opaque-style" />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual(['local/dynamic-style-value'])
    expect(plan.stats).toMatchObject({ lowered: 0, flattened: 0, bailed: 1 })
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('keeps animation and state styles together on the runtime path', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View
    transition="fast"
    padding={12}
    hoverStyle={{ padding: 16 }}
    data-runtime="animated-state"
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual(['local/unsupported-target'])
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('materializes local styled definitions before lowering variants and compounds', () => {
    const source = `
import { View, styled } from '@tamagui/core'
const Card = styled(View, {
  padding: 8,
  variants: {
    tone: {
      primary: { margin: 3 },
    },
  },
  defaultVariants: { tone: 'primary' },
  compoundVariants: [
    { tone: 'primary', style: { opacity: 0.5 } },
  ],
})
export const App = () => <Card padding={12} data-styled="yes" />
`
    const { plan, output } = compile(source)
    expect(codes(plan)).toEqual([])
    expect(plan.stats).toEqual({
      found: 1,
      lowered: 1,
      flattened: 1,
      styled: 1,
      bailed: 0,
    })
    expect(output.code).toContain('<div className=')
    expect(output.code).toContain('data-styled="yes"')
    expect(output.code).not.toContain('padding={12}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('margin-top:3px')
    expect(plan.css).toContain('opacity:0.5')
  })

  test('lowers compounds and style props in authored forward order', () => {
    const source = (props: string) => `
import { View, styled } from '@tamagui/core'
const Frame = styled(View, {
  variants: { tone: { active: {} } },
  compoundVariants: [
    { tone: 'active', style: { opacity: 0.5 } },
  ],
})
export const App = () => <Frame ${props} />
`
    const compoundLast = compile(source('style={{ opacity: 0.2 }} tone="active"'))
    expect(codes(compoundLast.plan)).toEqual([])
    expect(compactCss(compoundLast.plan.css)).toContain('opacity:0.5')
    expect(compactCss(compoundLast.plan.css)).not.toContain('opacity:0.2')

    const styleLast = compile(source('tone="active" style={{ opacity: 0.2 }}'))
    expect(codes(styleLast.plan)).toEqual([])
    expect(compactCss(styleLast.plan.css)).toContain('opacity:0.2')
    expect(compactCss(styleLast.plan.css)).not.toContain('opacity:0.5')
  })

  test('lowers compiled jsx/jsxs and createElement calls through the same plan', () => {
    const source = `
import { View } from '@tamagui/core'
import { jsx } from 'react/jsx-runtime'
import { createElement } from 'react'
export const JsxApp = () => jsx(View, { padding: 12, 'data-form': 'jsx' })
export const CreateElementApp = () => createElement(
  View,
  { padding: 14, 'data-form': 'create-element' },
  'child'
)
`
    const { plan, output } = compile(source)
    expect(codes(plan)).toEqual([])
    expect(plan.stats).toEqual({
      found: 2,
      lowered: 2,
      flattened: 2,
      styled: 0,
      bailed: 0,
    })
    expect(output.code).toMatch(/jsx\("div", \{ className: "[^"]+", 'data-form'/)
    expect(output.code).toMatch(
      /createElement\(\s*"div",\s*\{ className: "[^"]+", 'data-form'/
    )
    expect(output.code).toContain("'child'")
    expect(output.code).not.toContain('padding: 12')
    expect(output.code).not.toContain('padding: 14')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('padding-top:14px')
  })

  test('registry identity is canonical resolved id plus export name', () => {
    const source = `
import { View } from '@tamagui/core'
export const App = () => <View padding={12} />
`
    const id = resolvedModuleId(resolve(import.meta.dirname, 'fixtures/e3-registry.tsx'))
    const wrongCoreId = resolvedModuleId('/virtual/wrong-core.mjs')
    const graph = new ProjectGraph(yukuFactory, {
      modules: [
        {
          id,
          source,
          imports: [
            { specifier: '@tamagui/core', resolvedId: wrongCoreId, external: true },
          ],
        },
      ],
    })
    const host = createTamaguiCompilerHost({
      target: 'web',
      tamaguiConfig: projectInfo.tamaguiConfig!,
      components: projectInfo.components!,
      componentModules: [{ moduleName: '@tamagui/core', resolvedId: coreId }],
    })
    const plan = lowerModule({
      module: materializeModule(graph, id),
      source,
      target: 'web',
      host,
      options: { projectGeneration: 'e3-fixture-v1' },
    })
    expect(plan.stats.found).toBe(0)
    expect(plan.edits).toEqual([])
  })

  test('acceptsClassName false leaves the complete candidate byte-identical', () => {
    const source = `
import { Restricted } from '@fixture/restricted'
export const App = () => <Restricted padding={12} data-runtime="yes" />
`
    const id = resolvedModuleId(
      resolve(import.meta.dirname, 'fixtures/e3-restricted.tsx')
    )
    const restrictedId = resolvedModuleId('/virtual/@fixture/restricted.mjs')
    const graph = new ProjectGraph(yukuFactory, {
      modules: [
        {
          id,
          source,
          imports: [
            {
              specifier: '@fixture/restricted',
              resolvedId: restrictedId,
              external: true,
            },
          ],
        },
      ],
    })
    const viewStaticConfig = projectInfo.components?.find(
      ({ moduleName }) => moduleName === '@tamagui/core'
    )?.nameToInfo.View?.staticConfig
    expect(viewStaticConfig).toBeTruthy()
    const host = createTamaguiCompilerHost({
      target: 'web',
      tamaguiConfig: projectInfo.tamaguiConfig!,
      components: [
        ...projectInfo.components!,
        {
          moduleName: '@fixture/restricted',
          nameToInfo: {
            Restricted: {
              staticConfig: { ...viewStaticConfig!, acceptsClassName: false },
            },
          },
        },
      ],
      componentModules: [
        { moduleName: '@tamagui/core', resolvedId: coreId },
        { moduleName: '@fixture/restricted', resolvedId: restrictedId },
      ],
    })
    const plan = lowerModule({
      module: materializeModule(graph, id),
      source,
      target: 'web',
      host,
      options: { projectGeneration: 'e3-fixture-v1' },
    })
    const output = applyLoweredModule(source, id, plan)
    expect(plan.diagnostics.map(({ code }) => code)).toEqual(['local/unsupported-target'])
    expect(plan.stats).toEqual({
      found: 1,
      lowered: 0,
      flattened: 0,
      styled: 0,
      bailed: 1,
    })
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })
})
