import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
import {
  propToTailwindPrefix,
  standaloneValueProps,
  componentToTag,
} from './maps/propToClass'
import { pseudoToModifier, mediaToModifier } from './maps/pseudoMap'

export interface TransformOptions {
  // rename View→div, Text→span, etc.
  renameComponents?: boolean
}

/**
 * converts tamagui JSX source code to tailwind className syntax.
 *
 * input:  <View backgroundColor="red" padding={10} hoverStyle={{ opacity: 0.8 }} />
 * output: <div className="bg-red p-[10px] hover:opacity-80" />
 */
export function tamaguiToTailwind(
  source: string,
  options: TransformOptions = {}
): string {
  const { renameComponents = true } = options

  let ast: t.File
  try {
    ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    })
  } catch {
    // if parsing fails, return source unchanged
    return source
  }

  traverse(ast, {
    JSXOpeningElement(path) {
      const node = path.node
      if (!t.isJSXIdentifier(node.name)) return

      const tagName = node.name.name
      // only transform known tamagui components or components starting with uppercase
      const isKnownComponent = tagName in componentToTag
      const isUpperCase = tagName[0] === tagName[0].toUpperCase()
      if (!isKnownComponent && !isUpperCase) return

      const classes: string[] = []
      const keptAttrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = []
      let existingClassName: t.JSXAttribute | null = null

      // add implicit flex for XStack/YStack
      if (tagName === 'XStack') classes.push('flex', 'flex-row')
      else if (tagName === 'YStack') classes.push('flex', 'flex-col')
      else if (tagName === 'ZStack') classes.push('relative')

      for (const attr of node.attributes) {
        if (t.isJSXSpreadAttribute(attr)) {
          keptAttrs.push(attr)
          continue
        }

        const name = attr.name.name as string

        // preserve className
        if (name === 'className') {
          existingClassName = attr
          continue
        }

        // check pseudo-state props (hoverStyle, pressStyle, etc.)
        if (name in pseudoToModifier) {
          const modifier = pseudoToModifier[name]
          if (!modifier) {
            // no tailwind equivalent (enterStyle, exitStyle)
            keptAttrs.push(attr)
            continue
          }
          const innerClasses = extractPseudoClasses(attr, modifier)
          if (innerClasses) {
            classes.push(...innerClasses)
            continue
          }
          keptAttrs.push(attr)
          continue
        }

        // check media query props ($sm, $md, etc.)
        if (name[0] === '$') {
          const mediaKey = name.slice(1)
          if (mediaKey in mediaToModifier) {
            const modifier = mediaToModifier[mediaKey]
            const innerClasses = extractPseudoClasses(attr, modifier)
            if (innerClasses) {
              classes.push(...innerClasses)
              continue
            }
          }
          // unknown $ prop, keep as-is
          keptAttrs.push(attr)
          continue
        }

        // try to convert style prop to tailwind class
        const cls = propValueToClass(name, attr.value)
        if (cls) {
          classes.push(cls)
        } else {
          keptAttrs.push(attr)
        }
      }

      // build the new className
      if (classes.length > 0) {
        const classStr = classes.join(' ')

        if (existingClassName) {
          // merge with existing className
          const existingVal = getStringValue(existingClassName.value)
          if (existingVal !== null) {
            existingClassName.value = t.stringLiteral(
              existingVal ? `${existingVal} ${classStr}` : classStr
            )
            keptAttrs.unshift(existingClassName)
          } else {
            // existing className is dynamic, use template literal
            keptAttrs.unshift(
              t.jsxAttribute(
                t.jsxIdentifier('className'),
                t.stringLiteral(classStr)
              )
            )
          }
        } else {
          keptAttrs.unshift(
            t.jsxAttribute(
              t.jsxIdentifier('className'),
              t.stringLiteral(classStr)
            )
          )
        }
      } else if (existingClassName) {
        keptAttrs.unshift(existingClassName)
      }

      node.attributes = keptAttrs

      // rename component to HTML tag
      if (renameComponents && isKnownComponent) {
        node.name = t.jsxIdentifier(componentToTag[tagName])
      }
    },

    JSXClosingElement(path) {
      if (!t.isJSXIdentifier(path.node.name)) return
      const tagName = path.node.name.name
      if (options.renameComponents !== false && tagName in componentToTag) {
        path.node.name = t.jsxIdentifier(componentToTag[tagName])
      }
    },
  })

  const output = generate(ast, {
    retainLines: true,
    concise: false,
  })

  return output.code
}

// ── helpers ──────────────────────────────────────────

function propValueToClass(
  propName: string,
  value: t.JSXAttribute['value'],
  modifier = ''
): string | null {
  // resolve shorthands
  const fullProp = resolveShorthand(propName)

  // check standalone value props first (display, position, flexDirection, etc.)
  if (fullProp in standaloneValueProps) {
    const strVal = getStringValue(value)
    if (strVal !== null && standaloneValueProps[fullProp][strVal]) {
      const cls = standaloneValueProps[fullProp][strVal]
      return modifier ? `${modifier}:${cls}` : cls
    }
  }

  // check if we have a tailwind prefix for this prop
  const prefix = propToTailwindPrefix[fullProp]
  if (prefix === undefined) return null // not a style prop we handle

  const strVal = getStringValue(value)
  const numVal = getNumericValue(value)

  let tailwindValue: string | null = null

  if (strVal !== null) {
    tailwindValue = formatStringValue(fullProp, strVal)
  } else if (numVal !== null) {
    tailwindValue = formatNumericValue(fullProp, numVal)
  } else {
    // can't statically convert (dynamic expression)
    return null
  }

  if (tailwindValue === null) return null

  // some props use standalone classes (like `flex-1`)
  if (prefix === '') return modifier ? `${modifier}:${tailwindValue}` : tailwindValue

  const cls = `${prefix}-${tailwindValue}`
  return modifier ? `${modifier}:${cls}` : cls
}

function extractPseudoClasses(
  attr: t.JSXAttribute,
  modifier: string
): string[] | null {
  // value should be an object expression: hoverStyle={{ bg: 'red', opacity: 0.5 }}
  if (!t.isJSXExpressionContainer(attr.value)) return null
  const expr = attr.value.expression
  if (!t.isObjectExpression(expr)) return null

  const classes: string[] = []
  for (const prop of expr.properties) {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue
    const propName = prop.key.name
    const value = prop.value

    // wrap value as JSX-compatible for propValueToClass
    let jsxValue: t.JSXAttribute['value']
    if (t.isStringLiteral(value)) {
      jsxValue = value
    } else if (t.isNumericLiteral(value)) {
      jsxValue = t.jsxExpressionContainer(value)
    } else {
      continue // can't convert complex values
    }

    const cls = propValueToClass(propName, jsxValue, modifier)
    if (cls) classes.push(cls)
  }

  return classes.length > 0 ? classes : null
}

function getStringValue(value: t.JSXAttribute['value']): string | null {
  if (!value) return null
  if (t.isStringLiteral(value)) return value.value
  if (t.isJSXExpressionContainer(value) && t.isStringLiteral(value.expression)) {
    return value.expression.value
  }
  if (t.isJSXExpressionContainer(value) && t.isTemplateLiteral(value.expression)) {
    // simple template literal with no expressions
    if (
      value.expression.expressions.length === 0 &&
      value.expression.quasis.length === 1
    ) {
      return value.expression.quasis[0].value.raw
    }
  }
  return null
}

function getNumericValue(value: t.JSXAttribute['value']): number | null {
  if (!value) return null
  if (t.isJSXExpressionContainer(value)) {
    if (t.isNumericLiteral(value.expression)) return value.expression.value
    // negative: -10
    if (
      t.isUnaryExpression(value.expression) &&
      value.expression.operator === '-' &&
      t.isNumericLiteral(value.expression.argument)
    ) {
      return -value.expression.argument.value
    }
  }
  return null
}

// maps full CSS prop name → shorthand used in tamagui
const shorthandMap: Record<string, string> = {}
// populated lazily
let shorthandMapBuilt = false

function buildShorthandMap() {
  if (shorthandMapBuilt) return
  try {
    // import shorthands at runtime
    const { shorthands } = require('@tamagui/shorthands/v4')
    for (const [short, long] of Object.entries(shorthands)) {
      shorthandMap[short as string] = long as string
    }
  } catch {
    // fallback: hardcode common ones
    Object.assign(shorthandMap, {
      bg: 'backgroundColor',
      p: 'padding',
      pt: 'paddingTop',
      pr: 'paddingRight',
      pb: 'paddingBottom',
      pl: 'paddingLeft',
      px: 'paddingHorizontal',
      py: 'paddingVertical',
      m: 'margin',
      mt: 'marginTop',
      mr: 'marginRight',
      mb: 'marginBottom',
      ml: 'marginLeft',
      mx: 'marginHorizontal',
      my: 'marginVertical',
      rounded: 'borderRadius',
      t: 'top',
      r: 'right',
      b: 'bottom',
      l: 'left',
      z: 'zIndex',
      items: 'alignItems',
      justify: 'justifyContent',
      self: 'alignSelf',
      content: 'alignContent',
      grow: 'flexGrow',
      shrink: 'flexShrink',
      select: 'userSelect',
      text: 'textAlign',
      maxW: 'maxWidth',
      maxH: 'maxHeight',
      minW: 'minWidth',
      minH: 'minHeight',
    })
  }
  shorthandMapBuilt = true
}

function resolveShorthand(name: string): string {
  buildShorthandMap()
  return shorthandMap[name] || name
}

function formatStringValue(prop: string, value: string): string {
  // token reference: strip $
  if (value.startsWith('$')) {
    return value.slice(1)
  }

  // percentage values
  if (value.endsWith('%')) {
    const pctMap: Record<string, string> = {
      '100%': 'full',
      '50%': '1/2',
      '33.333%': '1/3',
      '66.666%': '2/3',
      '25%': '1/4',
      '75%': '3/4',
    }
    return pctMap[value] || `[${value}]`
  }

  // auto
  if (value === 'auto') return 'auto'
  // full
  if (value === '100%') return 'full'

  // named font weights
  if (prop === 'fontWeight') {
    const weightMap: Record<string, string> = {
      '100': 'thin',
      '200': 'extralight',
      '300': 'light',
      '400': 'normal',
      '500': 'medium',
      '600': 'semibold',
      '700': 'bold',
      '800': 'extrabold',
      '900': 'black',
      bold: 'bold',
      normal: 'normal',
    }
    return weightMap[value] || `[${value}]`
  }

  // css values that need brackets
  if (value.includes('(') || value.includes(' ') || value.startsWith('#')) {
    return `[${value}]`
  }

  return value
}

function formatNumericValue(prop: string, value: number): string {
  // opacity: 0.5 → 50
  if (prop === 'opacity') {
    return String(Math.round(value * 100))
  }

  // scale: 0.95 → [0.95], 1.05 → [1.05]
  if (prop === 'scale' || prop === 'scaleX' || prop === 'scaleY') {
    if (value === 0) return '0'
    if (value === 1) return '100'
    return `[${value}]`
  }

  // flex: 1 → 1
  if (prop === 'flex') {
    return String(value)
  }

  // flexGrow / flexShrink: just the number
  if (prop === 'flexGrow' || prop === 'flexShrink') {
    return value === 0 ? '0' : String(value)
  }

  // zIndex: just the number
  if (prop === 'zIndex') {
    return String(value)
  }

  // border widths: 0, 1, 2, 4, 8 are standard tailwind values
  if (prop.includes('Width') && prop.startsWith('border')) {
    if (value === 0) return '0'
    if (value === 1) return '' // border = border-1
    if ([2, 4, 8].includes(value)) return String(value)
    return `[${value}px]`
  }

  // outline width
  if (prop === 'outlineWidth') {
    return `[${value}px]`
  }

  // rotation: just degrees
  if (prop === 'rotate') {
    return `[${value}deg]`
  }

  // translation
  if (prop === 'x' || prop === 'y') {
    return `[${value}px]`
  }

  // negative values
  if (value < 0) {
    return `[-${Math.abs(value)}px]`
  }

  // default: use arbitrary value with px
  return `[${value}px]`
}
