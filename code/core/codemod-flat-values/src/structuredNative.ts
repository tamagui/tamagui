import { Node, SyntaxKind, type Expression } from 'ts-morph'
import { numericValue, unwrapExpression } from './expressions'
import { parseTransformString, sharedPayload, type ModifierRegistryView } from './grammar'

export interface StructuredNativeClassification {
  payload: string | null
  blocked: { code: string; detail: string } | null
}

const staticTransformOperations: ReadonlySet<string> = new Set([
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'skewX',
  'skewY',
  'translateX',
  'translateY',
])

function blocked(code: string, detail: string): StructuredNativeClassification {
  return { payload: null, blocked: { code, detail } }
}

function staticString(expression: Expression): string | null {
  const current = unwrapExpression(expression)
  return Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)
    ? current.getLiteralValue()
    : null
}

function hasOnlyStringValues(expression: Expression): boolean {
  const current = unwrapExpression(expression)
  if (
    Node.isStringLiteral(current) ||
    Node.isNoSubstitutionTemplateLiteral(current) ||
    Node.isTemplateExpression(current)
  ) {
    return true
  }

  const type = current.getType()
  const parts = type.isUnion() ? type.getUnionTypes() : [type]
  let strings = 0
  for (const part of parts) {
    if (part.isNull() || part.isUndefined()) continue
    if (!part.isString() && !part.isStringLiteral()) return false
    strings++
  }
  return strings > 0
}

function staticTransformArray(
  expression: Expression,
  source: string
): StructuredNativeClassification {
  const array = unwrapExpression(expression)
  if (!Node.isArrayLiteralExpression(array)) {
    return blocked(
      'structured-transform-dynamic',
      `transform value "${source}" is not an inline transform array; keep dynamic and Animated arrays authored`
    )
  }

  const functions: string[] = []
  for (const element of array.getElements()) {
    if (!Node.isObjectLiteralExpression(element)) {
      return blocked(
        'structured-transform-dynamic',
        `transform value "${source}" contains a spread or computed entry; keep dynamic and Animated arrays authored`
      )
    }
    const properties = element.getProperties()
    if (properties.length !== 1 || !Node.isPropertyAssignment(properties[0])) {
      return blocked(
        'structured-transform-entry',
        `transform value "${source}" must have exactly one static operation per array entry`
      )
    }

    const property = properties[0]
    const nameNode = property.getNameNode()
    if (!Node.isIdentifier(nameNode) && !Node.isStringLiteral(nameNode)) {
      return blocked(
        'structured-transform-entry',
        `transform value "${source}" contains a computed operation name`
      )
    }
    const operation = Node.isStringLiteral(nameNode)
      ? nameNode.getLiteralValue()
      : nameNode.getText()
    const initializer = unwrapExpression(property.getInitializerOrThrow())

    if (operation === 'matrix' || operation === 'matrix3d') {
      return blocked(
        'structured-transform-matrix',
        `transform value "${source}" contains "${operation}", whose React Native array and portable CSS function shapes do not match; keep it authored`
      )
    }
    if (!staticTransformOperations.has(operation)) {
      return blocked(
        'structured-transform-operation',
        `transform value "${source}" uses unsupported operation "${operation}"`
      )
    }

    const number = numericValue(initializer)
    let value: string
    if (number !== null) {
      if (
        operation === 'rotate' ||
        operation === 'rotateX' ||
        operation === 'rotateY' ||
        operation === 'rotateZ' ||
        operation === 'skewX' ||
        operation === 'skewY'
      ) {
        return blocked(
          'structured-transform-unit',
          `transform operation "${operation}" in "${source}" needs an explicit deg or rad string`
        )
      }
      value =
        operation === 'scale' || operation === 'scaleX' || operation === 'scaleY'
          ? String(number)
          : `${number}px`
    } else if (
      Node.isStringLiteral(initializer) ||
      Node.isNoSubstitutionTemplateLiteral(initializer)
    ) {
      value = initializer.getLiteralValue()
    } else {
      return blocked(
        'structured-transform-dynamic',
        `transform operation "${operation}" in "${source}" is computed; keep dynamic and Animated arrays authored`
      )
    }
    functions.push(`${operation}(${value})`)
  }

  if (functions.length === 0) {
    return blocked(
      'structured-transform-empty',
      `transform value "${source}" is empty; no portable flat base can preserve its reset semantics`
    )
  }

  const payload = functions.join(' ')
  const parsed = parseTransformString(payload)
  if (parsed.errors.length) {
    return blocked(
      `structured-transform-${parsed.errors[0].code}`,
      `${parsed.errors[0].message}; keep "${source}" authored`
    )
  }
  return { payload, blocked: null }
}

function staticFontVariantArray(
  expression: Expression,
  source: string
): StructuredNativeClassification {
  const array = unwrapExpression(expression)
  if (!Node.isArrayLiteralExpression(array)) {
    return blocked(
      'structured-font-variant-dynamic',
      `fontVariant value "${source}" is not an inline string array`
    )
  }

  const variants: string[] = []
  for (const element of array.getElements()) {
    const variant = staticString(element)
    if (variant === null) {
      return blocked(
        'structured-font-variant-dynamic',
        `fontVariant value "${source}" contains a computed entry; keep it authored`
      )
    }
    variants.push(variant)
  }
  return variants.length
    ? { payload: variants.join(' '), blocked: null }
    : blocked(
        'structured-font-variant-empty',
        `fontVariant value "${source}" is empty; no CSS token list preserves that reset`
      )
}

function staticBackgroundImageArray(
  expression: Expression,
  source: string
): StructuredNativeClassification {
  const array = unwrapExpression(expression)
  if (!Node.isArrayLiteralExpression(array)) {
    return blocked(
      'structured-background-image-dynamic',
      `backgroundImage value "${source}" is not an inline gradient array`
    )
  }
  if (array.getElements().length !== 1) {
    return blocked(
      'structured-background-image-layers',
      `backgroundImage value "${source}" must contain exactly one gradient; native conditional evaluation does not accept multiple layers`
    )
  }

  const gradient = array.getElements()[0]
  if (!Node.isObjectLiteralExpression(gradient)) {
    return blocked(
      'structured-background-image-dynamic',
      `backgroundImage value "${source}" contains a spread or computed gradient`
    )
  }

  const fields = new Map<string, Expression>()
  for (const member of gradient.getProperties()) {
    if (!Node.isPropertyAssignment(member)) {
      return blocked(
        'structured-background-image-dynamic',
        `backgroundImage value "${source}" contains a spread or computed gradient field`
      )
    }
    const nameNode = member.getNameNode()
    if (!Node.isIdentifier(nameNode) && !Node.isStringLiteral(nameNode)) {
      return blocked(
        'structured-background-image-dynamic',
        `backgroundImage value "${source}" contains a computed gradient field`
      )
    }
    const name = Node.isStringLiteral(nameNode)
      ? nameNode.getLiteralValue()
      : nameNode.getText()
    if (
      fields.has(name) ||
      (name !== 'type' && name !== 'direction' && name !== 'colorStops')
    ) {
      return blocked(
        'structured-background-image-shape',
        `backgroundImage value "${source}" contains unsupported field "${name}"`
      )
    }
    fields.set(name, member.getInitializerOrThrow())
  }

  const type = fields.get('type')
  const typeName = type ? staticString(type) : null
  if (typeName !== 'linear-gradient') {
    return blocked(
      'structured-background-image-kind',
      `backgroundImage value "${source}" is not a static linear-gradient object`
    )
  }

  const parts: string[] = []
  const direction = fields.get('direction')
  if (direction) {
    const value = staticString(direction)
    if (value === null) {
      return blocked(
        'structured-background-image-dynamic',
        `backgroundImage value "${source}" has a computed direction`
      )
    }
    parts.push(value)
  }

  const colorStopsExpression = fields.get('colorStops')
  const colorStops = colorStopsExpression
    ? unwrapExpression(colorStopsExpression)
    : undefined
  if (!colorStops || !Node.isArrayLiteralExpression(colorStops)) {
    return blocked(
      'structured-background-image-dynamic',
      `backgroundImage value "${source}" does not have an inline colorStops array`
    )
  }
  if (colorStops.getElements().length < 2) {
    return blocked(
      'structured-background-image-stops',
      `backgroundImage value "${source}" needs at least two color stops`
    )
  }

  const stopElements = colorStops.getElements()
  for (const [stopIndex, stop] of stopElements.entries()) {
    if (!Node.isObjectLiteralExpression(stop)) {
      return blocked(
        'structured-background-image-dynamic',
        `backgroundImage value "${source}" contains a spread or computed color stop`
      )
    }

    let color: string | null | undefined
    let hasColor = false
    let positions: string[] = []
    let hasPositions = false
    for (const member of stop.getProperties()) {
      if (!Node.isPropertyAssignment(member)) {
        return blocked(
          'structured-background-image-dynamic',
          `backgroundImage value "${source}" contains a spread or computed color-stop field`
        )
      }
      const nameNode = member.getNameNode()
      if (!Node.isIdentifier(nameNode) && !Node.isStringLiteral(nameNode)) {
        return blocked(
          'structured-background-image-dynamic',
          `backgroundImage value "${source}" contains a computed color-stop field`
        )
      }
      const name = Node.isStringLiteral(nameNode)
        ? nameNode.getLiteralValue()
        : nameNode.getText()
      if (name === 'color' && !hasColor) {
        hasColor = true
        const value = unwrapExpression(member.getInitializerOrThrow())
        if (value.getKind() === SyntaxKind.NullKeyword) {
          color = null
          continue
        }
        const staticColor = staticString(value)
        if (staticColor === null) {
          return blocked(
            'structured-background-image-dynamic',
            `backgroundImage value "${source}" contains a computed color`
          )
        }
        color = staticColor
        continue
      }
      if (name === 'positions' && !hasPositions) {
        hasPositions = true
        const value = unwrapExpression(member.getInitializerOrThrow())
        if (!Node.isArrayLiteralExpression(value)) {
          return blocked(
            'structured-background-image-dynamic',
            `backgroundImage value "${source}" contains computed color-stop positions`
          )
        }
        positions = []
        for (const positionExpression of value.getElements()) {
          const number = numericValue(positionExpression)
          if (number !== null) {
            positions.push(`${number}px`)
            continue
          }
          const position = staticString(positionExpression)
          if (position === null) {
            return blocked(
              'structured-background-image-dynamic',
              `backgroundImage value "${source}" contains a computed color-stop position`
            )
          }
          if (!position.endsWith('%')) {
            return blocked(
              'structured-background-image-position',
              `backgroundImage value "${source}" has position "${position}"; React Native gradient objects accept numeric points or percentage strings`
            )
          }
          positions.push(position)
        }
        continue
      }
      return blocked(
        'structured-background-image-shape',
        `backgroundImage value "${source}" contains unsupported or repeated color-stop field "${name}"`
      )
    }
    if (!hasColor || color === undefined) {
      return blocked(
        'structured-background-image-shape',
        `backgroundImage value "${source}" contains a color stop without a color`
      )
    }
    if (color === null) {
      if (
        positions.length !== 1 ||
        stopIndex === 0 ||
        stopIndex === stopElements.length - 1
      ) {
        return blocked(
          'structured-background-image-hint',
          `backgroundImage value "${source}" has an invalid transition hint; it needs one position between two colored stops`
        )
      }
      parts.push(positions[0])
    } else if (positions.length > 2) {
      for (const position of positions) parts.push(`${color} ${position}`)
    } else {
      parts.push([color, ...positions].join(' '))
    }
  }

  return { payload: `linear-gradient(${parts.join(', ')})`, blocked: null }
}

type StructuredNativeSerializer = (
  expression: Expression,
  source: string
) => StructuredNativeClassification

/**
 * Each entry names one native structure with a verified CSS-shaped spelling.
 * A new object or array shape stays authored until it has its own serializer.
 */
const structuredNativeSerializers: Readonly<
  Partial<Record<string, StructuredNativeSerializer>>
> = Object.freeze({
  backgroundImage: staticBackgroundImageArray,
  fontVariant: staticFontVariantArray,
  transform: staticTransformArray,
})

/**
 * The migration table is intentionally property-shaped. A structured value
 * stays in its natural React Native representation until a condition forces it
 * into one flat string program.
 */
export function classifyStructuredNativeValue(
  property: string,
  expression: Expression,
  source: string,
  registry: ModifierRegistryView
): StructuredNativeClassification | null {
  const serializer = structuredNativeSerializers[property]
  if (serializer) {
    if (hasOnlyStringValues(expression)) return null
    const result = serializer(expression, source)
    if (result.payload === null) return result

    const flattened = sharedPayload(property, result.payload, registry)
    const error = flattened.errors[0]
    if (error || flattened.payload === null) {
      return blocked(
        error?.code ?? 'unsupported-structured-value',
        `${property}: ${error?.message ?? `"${result.payload}" has no flat spelling`}`
      )
    }
    return { payload: flattened.payload, blocked: null }
  }
  const current = unwrapExpression(expression)
  if (
    !Node.isObjectLiteralExpression(current) &&
    !Node.isArrayLiteralExpression(current)
  ) {
    return null
  }

  const code = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  return blocked(
    `structured-${code}`,
    `${property} value "${source}" has no verified CSS-shaped migration rule; keep it authored`
  )
}
