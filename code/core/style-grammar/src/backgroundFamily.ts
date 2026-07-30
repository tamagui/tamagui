import type { ParsedClause, ParsedValue } from './valueTypes'

export const namedCssColors: ReadonlySet<string> = new Set(
  'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'.split(
    ' '
  )
)

const colorFunctions = new Set([
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'color',
])

function splitTopLevelComponents(value: string): string[] {
  const components: string[] = []
  let current = ''
  let depth = 0
  let quote = ''
  let escaped = false

  for (let index = 0; index < value.length; index++) {
    const char = value[index]
    if (escaped) {
      current += char
      escaped = false
      continue
    }
    if (char === '\\') {
      current += char
      escaped = true
      continue
    }
    if (quote) {
      current += char
      if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'") {
      current += char
      quote = char
      continue
    }
    if (char === '(') depth++
    if (char === ')') depth--

    const code = value.charCodeAt(index)
    const whitespace =
      code === 9 || code === 10 || code === 12 || code === 13 || code === 32
    if (depth === 0 && whitespace) {
      if (current) {
        components.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }

  if (current) components.push(current)
  return components
}

function classifyComponent(
  component: string,
  colorTokens: ReadonlySet<string>
): 'color' | 'image' | null {
  const functionMatch = /^([a-z][a-z0-9-]*)\([\s\S]*\)$/i.exec(component)
  if (functionMatch) {
    const name = functionMatch[1].toLowerCase()
    if (name === 'url' || name === 'image-set' || name.endsWith('-gradient')) {
      return 'image'
    }
    if (colorFunctions.has(name)) return 'color'
  }

  if (/^#[\da-f]{3}(?:[\da-f]{1}|[\da-f]{3}(?:[\da-f]{2})?)?$/i.test(component)) {
    return 'color'
  }

  const tokenName = component.replace(/\/\d+$/, '')
  if (colorTokens.has(tokenName)) return 'color'

  const lower = component.toLowerCase()
  if (lower === 'transparent' || lower === 'currentcolor' || namedCssColors.has(lower)) {
    return 'color'
  }

  return null
}

export function splitBackgroundValue(
  value: ParsedValue,
  colorTokens: ReadonlySet<string>
): {
  entries: Array<{
    property: 'backgroundColor' | 'backgroundImage'
    value: ParsedValue
  }>
  errors: Array<{
    code: 'unsupported-bg-component'
    component: string
    where: 'base' | number
  }>
} {
  const colorProgram: { base: string | null; clauses: ParsedClause[] } = {
    base: null,
    clauses: [],
  }
  const imageProgram: { base: string | null; clauses: ParsedClause[] } = {
    base: null,
    clauses: [],
  }
  const errors: Array<{
    code: 'unsupported-bg-component'
    component: string
    where: 'base' | number
  }> = []
  let hasColor = false
  let hasImage = false

  for (let clauseIndex = -1; clauseIndex < value.clauses.length; clauseIndex++) {
    const isBase = clauseIndex === -1
    const payload = isBase ? value.base : value.clauses[clauseIndex].payload
    if (payload === null) continue

    let colorComponent: string | null = null
    const imageComponents: string[] = []
    const where = isBase ? 'base' : clauseIndex

    for (const component of splitTopLevelComponents(payload)) {
      const kind = classifyComponent(component, colorTokens)
      if (kind === 'image') {
        imageComponents.push(component)
      } else if (kind === 'color' && colorComponent === null) {
        colorComponent = component
      } else {
        errors.push({ code: 'unsupported-bg-component', component, where })
      }
    }

    if (colorComponent !== null) {
      hasColor = true
      if (isBase) {
        colorProgram.base = colorComponent
      } else {
        colorProgram.clauses.push({
          modifiers: value.clauses[clauseIndex].modifiers,
          payload: colorComponent,
        })
      }
    }

    if (imageComponents.length) {
      hasImage = true
      const imagePayload = imageComponents.join(' ')
      if (isBase) {
        imageProgram.base = imagePayload
      } else {
        imageProgram.clauses.push({
          modifiers: value.clauses[clauseIndex].modifiers,
          payload: imagePayload,
        })
      }
    }
  }

  const entries: Array<{
    property: 'backgroundColor' | 'backgroundImage'
    value: ParsedValue
  }> = []
  if (hasColor) entries.push({ property: 'backgroundColor', value: colorProgram })
  if (hasImage) entries.push({ property: 'backgroundImage', value: imageProgram })

  return { entries, errors }
}
