import { resolve } from 'node:path'

import {
  ProjectGraph,
  applyLoweredModule,
  childNode,
  childNodes,
  findAstNode,
  identifierName,
  literalValue,
  lowerModule,
  materializeModule,
  parseModuleAst,
  resolvedModuleId,
  unwrapExpression,
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

const configPath = resolve(import.meta.dirname, 'lib/tamagui.config.cjs')
const coreId = resolvedModuleId('/virtual/@tamagui/core.mjs')
let projectInfo: TamaguiProjectInfo

type AnimationDriverShape = {
  animations?: Record<string, unknown>
  inputStyle?: 'css' | 'value'
  isReactNative?: boolean
  outputStyle?: 'css' | 'inline'
}

beforeAll(() => {
  projectInfo = loadTamaguiSync({
    platform: 'web',
    config: configPath,
    components: ['@tamagui/core'],
  })
})

function compile(
  source: string,
  target: CompilerTarget = 'web',
  hostOptions?: {
    animationDriver?: AnimationDriverShape
    animationDrivers?: Record<string, AnimationDriverShape>
    disablePartialExtraction?: boolean
  }
) {
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
    tamaguiConfig:
      hostOptions?.animationDriver || hostOptions?.animationDrivers
        ? {
            ...projectInfo.tamaguiConfig!,
            animations: {
              ...projectInfo.tamaguiConfig!.animations,
              ...hostOptions.animationDriver,
            },
            animationDrivers: hostOptions.animationDrivers,
          }
        : projectInfo.tamaguiConfig!,
    components: projectInfo.components!,
    componentModules: [{ moduleName: '@tamagui/core', resolvedId: coreId }],
    disablePartialExtraction: hostOptions?.disablePartialExtraction,
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
  test('keeps disableOptimization candidates on the runtime path', () => {
    const source = `
import { Text } from '@tamagui/core'
export const App = () => <Text color="red" disableOptimization>runtime</Text>
`
    for (const target of ['web', 'native'] as const) {
      const { plan, output } = compile(source, target)

      expect(codes(plan)).toEqual(['local/unsupported-target'])
      expect(plan.stats).toEqual({
        found: 1,
        lowered: 0,
        flattened: 0,
        styled: 0,
        bailed: 1,
      })
      expect(output.changed).toBe(false)
      expect(output.code).toBe(source)
    }
  })

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
    opacity="hover:0.5"
    margin="sm:3px"
    group="card"
    container="card"
    data-sentinel="untouched"
  >
    <Text fontFamily="body" color="dark:color">font</Text>
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
    expect(plan.css).toContain('@media (hover: hover)')
    expect(plan.css).toContain('@media (min-width: 640px)')
    expect(plan.css).toContain('.t_dark')
    expect(plan.css).toContain('container:card / inline-size')
    expect(plan.css).toContain('font-family')
    expect(output.map?.sourcesContent).toEqual([source])
  })

  test('keeps a transition byte-identical for animatedBy css with a single non-CSS driver', () => {
    const source = `
import { View } from '@tamagui/core'
export const App = () => (
  <View
    animatedBy="css"
    transition="opacity 150ms ease-out"
    padding="12px hover:16px"
    data-runtime="single-non-css"
  />
)
`
    const { plan, output } = compile(source, 'web', {
      animationDriver: {
        inputStyle: 'value',
        isReactNative: true,
        outputStyle: 'inline',
      },
    })
    expect(codes(plan)).toEqual(['local/unsupported-target'])
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

  test('lowers animatedBy css through a multi-driver CSS entry', () => {
    const source = `
import { View } from '@tamagui/core'
export const App = () => (
  <View
    animatedBy="css"
    transition="opacity 150ms ease-out"
    padding="12px hover:16px"
    data-compiled="multi-css"
  />
)
`
    const nonCssDriver: AnimationDriverShape = {
      inputStyle: 'value',
      isReactNative: true,
      outputStyle: 'inline',
    }
    const { plan, output } = compile(source, 'web', {
      animationDriver: nonCssDriver,
      animationDrivers: {
        default: nonCssDriver,
        css: {
          animations: projectInfo.tamaguiConfig!.animations.animations,
          inputStyle: 'css',
          outputStyle: 'css',
        },
      },
    })

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toEqual({
      found: 1,
      lowered: 1,
      flattened: 1,
      styled: 0,
      bailed: 0,
    })
    expect(output.code).not.toContain('animatedBy="css"')
    expect(output.code).not.toContain('transition="opacity 150ms ease-out"')
    expect(output.code).not.toContain('padding="12px hover:16px"')
    expect(output.code).toContain('<div')
    expect(plan.css).toContain('transition:opacity 150ms ease-out')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('padding-top:16px')
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

  test('flattens proven numeric expressions and finite literal lookups to host styles', () => {
    const source = `
import { View } from '@tamagui/core'
const COLORS = ['rgb(147,197,253)', 'rgb(134,239,172)']
export const Cards = ({ seed }) => {
  const color = COLORS[seed % COLORS.length]
  return (
    <View
      width={80 + ((seed * 17) % 60)}
      backgroundColor={color}
      padding={12}
      data-dynamic-host="proven"
    />
  )
}
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 1, flattened: 1, bailed: 0 })
    const program = parseModuleAst(output.code)
    const opening = findAstNode(
      program,
      (node) =>
        node.type === 'JSXOpeningElement' &&
        childNodes(node, 'attributes').some(
          (attribute) =>
            identifierName(childNode(attribute, 'name')) === 'data-dynamic-host'
        )
    )!
    expect(identifierName(childNode(opening, 'name'))).toBe('div')
    const styleAttribute = childNodes(opening, 'attributes').find(
      (attribute) => identifierName(childNode(attribute, 'name')) === 'style'
    )!
    const style = childNode(childNode(styleAttribute, 'value')!, 'expression')!
    const properties = childNodes(style, 'properties')
    expect(
      properties.map((property) => {
        const key = childNode(property, 'key')
        return identifierName(key) ?? literalValue(key)
      })
    ).toEqual(['width', 'backgroundColor'])
    expect(unwrapExpression(childNode(properties[0]!, 'value')!).type).toBe(
      'BinaryExpression'
    )
    expect(identifierName(unwrapExpression(childNode(properties[1]!, 'value')!))).toBe(
      'color'
    )
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('width:')
    expect(plan.css).not.toContain('background-color:')

    const tokenSource = `
import { View } from '@tamagui/core'
const COLORS = ['$invalid-identifier']
export const Card = ({ seed }) => (
  <View backgroundColor={COLORS[seed % COLORS.length]} padding={12} />
)
`
    const token = compile(tokenSource)
    expect(token.plan.stats).toMatchObject({ lowered: 1, flattened: 0, bailed: 0 })
    expect(token.plan.css).toContain('padding-top:12px')
  })

  test('keeps current transition candidates byte-identical for every animation driver', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View
    animatedBy="css"
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

  test('flattens an inert animatedBy selector with its static group styles', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View group="card" animatedBy="css" data-group="parent">
    <View
      width={100}
      backgroundColor="group-hover/card:red"
      data-group="child"
    />
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
    expect(output.code).not.toContain('animatedBy')
    expect(output.code).not.toContain('group-hover/card:red')
    const [parentClassName, childClassName] = loweredClassNames(output.code)
    expect(parentClassName).toContain('t_group_card')
    const childHoverClass = plan.css.match(
      /\.([^.:]+):where\(\.t_group_card:hover \*\)\{background-color:red\}/
    )?.[1]
    expect(childHoverClass).toBeTruthy()
    expect(childClassName).toContain(childHoverClass)
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

  test('extracts a static transform beside a dynamic transform-family prop', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ x }) => (
  <View x={x} transform={[{ scale: 2 }]} padding={12} />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('x={x}')
    expect(output.code).not.toContain('transform={[{ scale: 2 }]}')
    expect(output.code).not.toContain('padding={12}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('transform:scale(2)')
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

  test('extracts a static transform beside a compiled dynamic transform-family prop', () => {
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
    expect(output.code).not.toContain('transform: [{ scale: 2 }]')
    expect(output.code).not.toContain('padding: 12')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('transform:scale(2)')
  })

  test('keeps CSS shorthand and longhand collisions on the runtime path', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ border, background, outline, gap }) => (
  <View
    border={border}
    borderTopWidth={2}
    background={background}
    backgroundColor="red"
    outline={outline}
    outlineColor="blue"
    gap={gap}
    rowGap={4}
    padding={12}
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('border={border}')
    expect(output.code).toContain('borderTopWidth={2}')
    expect(output.code).toContain('background={background}')
    expect(output.code).toContain('backgroundColor="red"')
    expect(output.code).toContain('outline={outline}')
    expect(output.code).toContain('outlineColor="blue"')
    expect(output.code).toContain('gap={gap}')
    expect(output.code).toContain('rowGap={4}')
    expect(output.code).not.toContain('padding={12}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('border-top-width:2px')
    expect(plan.css).not.toContain('background-color:red')
    expect(plan.css).not.toContain('outline-color:blue')
    expect(plan.css).not.toContain('row-gap:4px')
  })

  test('keeps compiled-jsx shorthand and longhand collisions on the runtime path', () => {
    const source = `
import { View } from '@tamagui/core'
import { jsx } from 'react/jsx-runtime'
export const Card = ({ border }) => jsx(View, {
  border,
  borderLeftColor: 'red',
  padding: 12,
})
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('border,')
    expect(output.code).toContain("borderLeftColor: 'red'")
    expect(output.code).not.toContain('padding: 12')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).not.toContain('border-left-color:red')
  })

  test('keeps shorthand aliases and logical properties with physical collisions', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ maxWidth, marginLeft }) => (
  <View
    maxW={maxWidth}
    maxInlineSize={120}
    marginLeft={marginLeft}
    marginInlineStart={4}
    opacity={0.5}
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(output.code).toContain('maxW={maxWidth}')
    expect(output.code).toContain('maxInlineSize={120}')
    expect(output.code).toContain('marginLeft={marginLeft}')
    expect(output.code).toContain('marginInlineStart={4}')
    expect(output.code).not.toContain('opacity={0.5}')
    expect(plan.css).toContain('opacity:0.5')
    expect(plan.css).not.toContain('max-width:120px')
    expect(plan.css).not.toContain('margin-inline-start:4px')
  })

  test('flattens CSS transitions from static spreads', () => {
    const source = `
import { View } from '@tamagui/core'
const animated = { transition: 'opacity 150ms ease-out', padding: 12 }
export const Card = () => <View {...animated} />
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 1, flattened: 1, bailed: 0 })
    expect(output.changed).toBe(true)
    expect(output.code).not.toContain('{...animated}')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('transition:opacity 150ms ease-out')
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

  test('keeps a text-only style prop on the runtime path', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View backgroundColor="white" color="blue" data-invalid-host-style="yes" />
)
`
    const { plan, output } = compile(source)

    expect(plan.stats).toEqual({
      found: 1,
      lowered: 0,
      flattened: 0,
      styled: 0,
      bailed: 1,
    })
    expect(plan.diagnostics).toMatchObject([
      {
        code: 'local/unsupported-target',
        kind: 'local',
        message:
          '"color" is a text style prop and this component is not text. Use a Text-based component, or html.* for raw web elements.',
        component: 'View',
        blocking: true,
      },
    ])
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
  })

  test('keeps a text-only style prop in a static spread on the runtime path', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View {...{ backgroundColor: 'white', color: 'blue' }} data-invalid-host-style="spread" />
)
`
    const { plan, output } = compile(source)

    expect(plan.stats).toMatchObject({ lowered: 0, flattened: 0, bailed: 1 })
    expect(plan.diagnostics).toMatchObject([
      {
        code: 'local/unsupported-target',
        message:
          '"color" is a text style prop and this component is not text. Use a Text-based component, or html.* for raw web elements.',
        blocking: true,
      },
    ])
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
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

  test('lowers a CSS transition and state styles together', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = () => (
  <View
    transition="opacity 150ms ease-out"
    padding="12px hover:16px"
    data-runtime="animated-state"
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 1, flattened: 1, bailed: 0 })
    expect(output.changed).toBe(true)
    expect(output.code).not.toContain('transition="opacity 150ms ease-out"')
    expect(output.code).not.toContain('padding="12px hover:16px"')
    expect(plan.css).toContain('transition:opacity 150ms ease-out')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('@media (hover: hover)')
    expect(plan.css).toContain(':hover{padding-top:16px}')
  })

  test('lowers a configured CSS transition preset on a dynamic animated component', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ seed }) => (
  <View
    transition="bouncy"
    width={24}
    height={24}
    borderRadius={4}
    backgroundColor="rgb(59,130,246)"
    margin={1}
    opacity={seed % 2 ? 0.85 : 1}
    scale={seed % 2 ? 0.95 : 1}
    data-animated="css-preset"
  />
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 1, flattened: 1, bailed: 0 })
    expect(output.code).toContain('<div')
    expect(output.code).not.toContain('transition="bouncy"')
    expect(output.code).toContain('opacity: (seed % 2 ? 0.85 : 1)')
    expect(output.code).toContain('transform: "scale(" + (seed % 2 ? 0.95 : 1) + ")"')
    expect(plan.css).toContain(
      'transition:all 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    )
  })

  test('keeps a non-CSS driver transition byte-identical', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ opacity }) => (
  <View
    transition="spring"
    width={24}
    height={24}
    opacity={opacity}
    data-animated="object-preset"
  />
)
`
    const { plan, output } = compile(source, 'web', {
      animationDriver: {
        animations: {
          spring: { damping: 10, mass: 1, stiffness: 100 },
        },
        inputStyle: 'value',
        isReactNative: true,
        outputStyle: 'inline',
      },
    })

    expect(codes(plan)).toEqual(['local/unsupported-target'])
    expect(plan.stats).toMatchObject({ lowered: 0, flattened: 0, bailed: 1 })
    expect(output.changed).toBe(false)
    expect(output.code).toBe(source)
    expect(plan.css).toBe('')
  })

  test('partially extracts static styles beside an unsupported CSS-driver transition', () => {
    const source = `
import { View } from '@tamagui/core'
export const Card = ({ opacity }) => (
  <View
    transition="spring"
    width={24}
    height={24}
    opacity={opacity}
    data-animated="unsupported-css-preset"
  />
)
`
    const { plan, output } = compile(source, 'web', {
      animationDriver: {
        animations: {
          spring: { damping: 10, mass: 1, stiffness: 100 },
        },
        inputStyle: 'css',
        outputStyle: 'css',
      },
    })

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 1, flattened: 0, bailed: 0 })
    expect(output.code).toMatch(
      /<View\s+transition="spring"\s+className="[^"]+"\s+opacity=\{opacity\}/
    )
    expect(output.code).not.toContain('width={24}')
    expect(output.code).not.toContain('height={24}')
    expect(plan.css).toContain('width:24px')
    expect(plan.css).toContain('height:24px')
    expect(plan.css).not.toContain('transition:')
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

  test('disablePartialExtraction keeps every partial candidate byte-identical', () => {
    // mirrors the partial-extraction shapes seen in the tamagui.dev build:
    // bare components mixing one dynamic direct style prop with static ones
    const source = `
import { View } from '@tamagui/core'
import { jsx } from 'react/jsx-runtime'
export const Cards = ({ width, height, flex, x, opacity }) => (
  <>
    <View width={width} padding={12} data-partial="one" />
    <View height={height} margin={4} opacity={0.5} data-partial="two" />
    <View flex={flex} paddingTop={8} data-partial="three" />
    <View x={x} transform={[{ scale: 2 }]} padding={12} data-partial="four" />
  </>
)
export const Compiled = ({ width }) => jsx(View, {
  width,
  padding: 12,
  'data-partial': 'five',
})
`
    const enabled = compile(source)
    expect(codes(enabled.plan)).toEqual([])
    expect(enabled.plan.stats).toEqual({
      found: 5,
      lowered: 5,
      flattened: 0,
      styled: 0,
      bailed: 0,
    })

    const disabled = compile(source, 'web', { disablePartialExtraction: true })
    expect(codes(disabled.plan)).toEqual([
      'local/dynamic-style-value',
      'local/dynamic-style-value',
      'local/dynamic-style-value',
      'local/dynamic-style-value',
      'local/dynamic-style-value',
    ])
    expect(disabled.plan.stats).toEqual({
      found: 5,
      lowered: 0,
      flattened: 0,
      styled: 0,
      bailed: 5,
    })
    expect(disabled.output.changed).toBe(false)
    expect(disabled.output.code).toBe(source)
    expect(disabled.plan.css).toBe('')
  })

  test('lowers nested compiled candidates independently', () => {
    const source = `
import { View } from '@tamagui/core'
import { jsx } from 'react/jsx-runtime'
export const Card = () => jsx(View, {
  padding: 12,
  'data-outer': 'yes',
  children: jsx(View, { margin: 4, testID: 'inner', 'data-inner': 'yes' }),
})
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
    expect(output.code).not.toContain('padding: 12')
    expect(output.code).not.toContain('margin: 4')
    expect(output.code).toContain(`'data-outer': 'yes'`)
    expect(output.code).toContain(`'data-inner': 'yes'`)
    expect(output.code).toContain(`'data-testid': 'inner'`)
    expect(output.code).not.toContain('testID')
    expect(plan.css).toContain('padding-top:12px')
    expect(plan.css).toContain('margin-top:4px')
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

describe('atomic rule emission', () => {
  test('emits one rule per identifier however many elements use it', () => {
    const source = `
import { View } from '@tamagui/core'
export const App = () => (
  <>
    <View transition="medium" height={20} />
    <View transition="medium" height={20} />
    <View transition="medium" height={20} width={50} />
  </>
)
`
    const { plan } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ lowered: 3, flattened: 3, bailed: 0 })
    // three elements, one rule each. the width proves the fixture can still
    // grow rules, so a plan that emitted nothing would not pass this
    const occurrences = (rule: string) => plan.css.split(rule).length - 1
    expect(occurrences('{height:20px}')).toBe(1)
    expect(occurrences('{transition:all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)}')).toBe(1)
    expect(occurrences('{width:50px}')).toBe(1)
  })
})

describe('animation props written in a styled() definition', () => {
  // The lowering decision reads the call site AND the styled definition's
  // defaults. A definition-only transition used to flatten with the prop
  // dropped, so the element shipped with no transition, no CSS and no
  // diagnostic. Three presets rather than one: the emitted CSS then names which
  // of the three places was lowered, and the plain-View case is the control —
  // if it ever stops emitting, the fixture is broken rather than passing.
  test('lowers a configured preset from all three places it can be written', () => {
    const source = `
import { View, styled } from '@tamagui/core'
const DefinitionCard = styled(View, { transition: 'medium', height: 20 })
const PlainCard = styled(View, { height: 20 })
export const App = () => (
  <>
    <View data-box="plain" transition="quick" height={20} />
    <DefinitionCard data-box="definition" />
    <PlainCard data-box="call-site" transition="lazy" />
  </>
)
`
    const { plan, output } = compile(source)

    expect(codes(plan)).toEqual([])
    expect(plan.stats).toMatchObject({ found: 3, lowered: 3, flattened: 3, bailed: 0 })
    expect(output.code).not.toContain('transition="quick"')
    expect(output.code).not.toContain('transition="lazy"')
    const css = compactCss(plan.css)
    expect(css).toContain('transition:all150mscubic-bezier(0.25,0.1,0.25,1)')
    expect(css).toContain('transition:all300mscubic-bezier(0.25,0.1,0.25,1)')
    expect(css).toContain('transition:all500mscubic-bezier(0.25,0.1,0.25,1)')
  })

  test('reports an animation that needs a runtime instead of dropping it', () => {
    for (const definition of [
      `animateOnly: ['opacity'], transition: 'all 200ms ease', opacity: 0.5`,
      `animation: 'medium'`,
      `animatePresence: true`,
    ]) {
      const source = `
import { View, styled } from '@tamagui/core'
const Card = styled(View, { ${definition}, height: 20 })
export const App = () => <Card data-box="definition" />
`
      const { plan, output } = compile(source)

      expect(codes(plan)).toEqual(['local/unsupported-target'])
      expect(plan.diagnostics[0]?.zeroRule).toBe(5)
      expect(plan.stats).toMatchObject({ lowered: 0, flattened: 0, bailed: 1 })
      expect(output.changed).toBe(false)
    }
  })

  test('names the styled definition when animateOnly is not on the element', () => {
    const atCallSite = compile(`
import { View } from '@tamagui/core'
export const App = () => <View animateOnly={['opacity']} transition="medium" opacity={0.5} />
`)
    const inDefinition = compile(`
import { View, styled } from '@tamagui/core'
const Card = styled(View, { animateOnly: ['opacity'], transition: 'medium', opacity: 0.5 })
export const App = () => <Card />
`)

    expect(atCallSite.plan.diagnostics[0]?.zeroMessage).toContain('animateOnly on View')
    expect(inDefinition.plan.diagnostics[0]?.zeroMessage).toContain(
      'animateOnly in the styled() definition of Card'
    )
  })
})
