/**
 * parses CSS string values into RN object format on native,
 * preserving DynamicColorIOS objects from the token map.
 *
 * supports: backgroundImage (linear-gradient), boxShadow, textShadow
 * filter has no RN object equivalent, returns undefined (falls back to string)
 *
 * only called inside process.env.TAMAGUI_TARGET === 'native' checks,
 * so this code is dead-code-eliminated on web builds.
 */

type TokenMap = Map<string, any>

export function parseNativeStyle(
  key: string,
  cssString: string,
  tokenMap?: TokenMap
): any | undefined {
  switch (key) {
    case 'backgroundImage':
      return parseBackgroundImage(cssString, tokenMap)
    case 'boxShadow':
      return parseBoxShadow(cssString, tokenMap)
    case 'textShadow':
      return parseTextShadow(cssString, tokenMap)
    default:
      return undefined
  }
}

function resolveColor(raw: string, tokenMap?: TokenMap): any {
  if (tokenMap && tokenMap.has(raw)) {
    return tokenMap.get(raw)
  }
  return raw
}

// the direction grammar RN 0.83 itself accepts, sourced from
// react-native/Libraries/StyleSheet/processBackgroundImage.js — signed and
// leading-decimal angles, case-insensitive units and keywords. what matters
// is what React Native reads, not what the CSS spec permits
const gradientAngle = /^([+-]?\d*\.?\d+)(deg|grad|rad|turn)$/i
const gradientKeyword = /^to\s+(?:top|bottom|left|right)(?:\s+(?:top|bottom|left|right))?$/i

// RN's object path accepts a position as a NUMBER (points) or a string
// ending in % — mirroring its own getPositionFromCSSValue: px becomes
// parseFloat points, % stays a string, anything else is not a position
function gradientPosition(token: string): number | string | undefined {
  if (/px$/i.test(token)) return Number.parseFloat(token)
  if (token.endsWith('%')) return token
  return undefined
}

// parse "linear-gradient(direction, color1 pos1, color2 pos2, ...)"
function parseBackgroundImage(css: string, tokenMap?: TokenMap): any[] | undefined {
  const match = css.match(/^linear-gradient\((.+)\)$/s)
  if (!match) return undefined

  const inner = match[1]
  // split on commas that are not inside parentheses
  const parts = splitOutsideParens(inner)
  if (parts.length < 2) return undefined

  let direction: string | undefined
  let startIdx = 0

  const firstPart = parts[0].trim()
  if (gradientAngle.test(firstPart) || gradientKeyword.test(firstPart)) {
    direction = firstPart
    startIdx = 1
  }

  // tokens classify by what they ARE, never by falling through to the color
  // slot — the direction, position, and transition-hint misreads were all one
  // assumption ("any unrecognized token is a color") wearing three costumes
  const colorStops: any[] = []
  const stops = parts.slice(startIdx)
  let prevWasHint = false
  for (let i = 0; i < stops.length; i++) {
    const stopParts = stops[i].trim().match(/\S+\([^)]*\)|\S+/g)
    if (!stopParts) continue

    // a lone position is a transition hint (RN string parser case 4):
    // {color:null, positions:[n]} — invalid first, last, or after another
    // hint, which invalidates the gradient exactly as RN and the web do
    if (stopParts.length === 1) {
      const hint = gradientPosition(stopParts[0])
      if (hint !== undefined) {
        if (i === 0 || i === stops.length - 1 || prevWasHint) return undefined
        colorStops.push({ color: null, positions: [hint] })
        prevWasHint = true
        continue
      }
    }
    prevWasHint = false

    const color = resolveColor(stopParts[0], tokenMap)
    const stop: any = { color }
    if (stopParts.length > 1) {
      const positions: (number | string)[] = []
      for (let p = 1; p < stopParts.length; p++) {
        const position = gradientPosition(stopParts[p])
        if (position === undefined) return undefined
        positions.push(position)
      }
      stop.positions = positions
    }
    colorStops.push(stop)
  }

  const gradient: any = {
    type: 'linear-gradient',
    colorStops,
  }
  if (direction) {
    gradient.direction = direction
  }

  return [gradient]
}

// parse "offsetX offsetY [blur [spread]] [color]" (comma-separated for multiple)
function parseBoxShadow(css: string, tokenMap?: TokenMap): any[] | undefined {
  // split on commas for multiple shadows
  const shadowStrings = splitOutsideParens(css)
  const shadows: any[] = []

  for (const raw of shadowStrings) {
    const s = raw.trim()
    if (!s) continue

    const tokens = s.split(/\s+/)
    if (tokens.length < 2) return undefined

    let startIdx = 0
    let inset = false
    if (tokens[0] === 'inset') {
      inset = true
      startIdx = 1
    }

    // find where the color starts - numbers/dimensions come first
    const numericParts: number[] = []
    let colorParts: string[] = []

    for (let i = startIdx; i < tokens.length; i++) {
      const n = parseDimension(tokens[i])
      if (n !== undefined) {
        numericParts.push(n)
      } else {
        // rest is color (could be "rgba(..." which was split, so rejoin)
        colorParts = tokens.slice(i)
        break
      }
    }

    if (numericParts.length < 2) return undefined

    const shadow: any = {
      offsetX: numericParts[0],
      offsetY: numericParts[1],
    }
    if (inset) {
      shadow.inset = true
    }
    if (numericParts.length >= 3) {
      shadow.blurRadius = numericParts[2]
    }
    if (numericParts.length >= 4) {
      shadow.spreadDistance = numericParts[3]
    }
    if (colorParts.length > 0) {
      const colorStr = colorParts.join(' ')
      shadow.color = resolveColor(colorStr, tokenMap)
    }

    shadows.push(shadow)
  }

  return shadows.length > 0 ? shadows : undefined
}

// parse "offsetX offsetY blur color"
function parseTextShadow(css: string, tokenMap?: TokenMap): [string, any][] | undefined {
  const tokens = css.trim().split(/\s+/)
  if (tokens.length < 3) return undefined

  const offsetX = parseDimension(tokens[0])
  const offsetY = parseDimension(tokens[1])
  const blur = parseDimension(tokens[2])

  if (offsetX === undefined || offsetY === undefined || blur === undefined) {
    return undefined
  }

  const result: [string, any][] = [
    ['textShadowOffset', { width: offsetX, height: offsetY }],
    ['textShadowRadius', blur],
  ]

  if (tokens.length >= 4) {
    const colorStr = tokens.slice(3).join(' ')
    result.push(['textShadowColor', resolveColor(colorStr, tokenMap)])
  }

  return result
}

function parseDimension(s: string): number | undefined {
  // strip px/dp suffix (css units are case-insensitive)
  const cleaned = s.replace(/px$|dp$/i, '')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : undefined
}

// split a string on commas that are not inside parentheses
function splitOutsideParens(s: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i)
    if (ch === 40 /* ( */) depth++
    else if (ch === 41 /* ) */) depth--
    else if (ch === 44 /* , */ && depth === 0) {
      parts.push(s.slice(start, i))
      start = i + 1
    }
  }
  parts.push(s.slice(start))
  return parts
}
