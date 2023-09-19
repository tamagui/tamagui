/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

// -----------------------------------------------------------------------------

const RE_MEDIA_QUERY = /(?:(only|not)?\s*([^\s\(\)]+)(?:\s*and)?\s*)?(.+)?/i
const RE_MQ_EXPRESSION = /\(\s*([^\s\:\)]+)\s*(?:\:\s*([^\s\)]+))?\s*\)/
const RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/
const RE_LENGTH_UNIT = /(em|rem|px|cm|mm|in|pt|pc)?$/
const RE_RESOLUTION_UNIT = /(dpi|dpcm|dppx)?$/

export function matchQuery(mediaQuery: string, values) {
  return parseQuery(mediaQuery).some((query) => {
    if (!query) return

    const inverse = query.inverse

    // Either the parsed or specified `type` is "all", or the types must be
    // equal for a match.
    const typeMatch = query.type === 'all' || values.type === query.type

    // Quit early when `type` doesn't match, but take "not" into account.
    if ((typeMatch && inverse) || !(typeMatch || inverse)) {
      return false
    }

    const expressionsMatch = query.expressions.every((expression) => {
      const feature = expression.feature
      const modifier = expression.modifier
      let expValue = expression.value
      let value = values[feature]

      // Missing or falsy values don't match.
      if (!value) {
        return false
      }

      switch (feature) {
        case 'orientation':
        case 'scan':
          return value.toLowerCase() === expValue.toLowerCase()

        case 'width':
        case 'height':
        case 'device-width':
        case 'device-height':
          expValue = toPx(expValue)
          value = toPx(value)
          break

        case 'resolution':
          expValue = toDpi(expValue)
          value = toDpi(value)
          break

        case 'aspect-ratio':
        case 'device-aspect-ratio':
        case /* Deprecated */ 'device-pixel-ratio':
          expValue = toDecimal(expValue)
          value = toDecimal(value)
          break

        case 'grid':
        case 'color':
        case 'color-index':
        case 'monochrome':
          expValue = parseInt(expValue, 10) || 1
          value = parseInt(value, 10) || 0
          break
      }

      switch (modifier) {
        case 'min':
          return value >= expValue
        case 'max':
          return value <= expValue
        default:
          return value === expValue
      }
    })

    return (expressionsMatch && !inverse) || (!expressionsMatch && inverse)
  })
}

export function parseQuery(mediaQuery: string) {
  return mediaQuery.split(',').map(function (query) {
    query = query.trim()

    const captures = query.match(RE_MEDIA_QUERY)

    if (!captures) return null

    const modifier = captures[1]
    const type = captures[2]
    const expressionsCapture = captures[3] || ''
    // Split expressions into a list.
    const expressions = expressionsCapture.match(/\([^\)]+\)/g) || []

    return {
      inverse: !!modifier && modifier.toLowerCase() === 'not',
      type: type ? type.toLowerCase() : 'all',
      expressions: expressions.map(function (expression) {
        var captures = expression.match(RE_MQ_EXPRESSION),
          feature = captures[1].toLowerCase().match(RE_MQ_FEATURE)

        return {
          modifier: feature[1],
          feature: feature[2],
          value: captures[2],
        }
      }),
    }
  })
}

// -- Utilities ----------------------------------------------------------------

function toDecimal(ratio) {
  var decimal = Number(ratio),
    numbers

  if (!decimal) {
    numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/)
    decimal = numbers[1] / numbers[2]
  }

  return decimal
}

function toDpi(resolution: string) {
  const value = parseFloat(resolution)
  const units = String(resolution).match(RE_RESOLUTION_UNIT)?.[1]

  switch (units) {
    case 'dpcm':
      return value / 2.54
    case 'dppx':
      return value * 96
    default:
      return value
  }
}

function toPx(length: string) {
  const value = parseFloat(length)
  const units = String(length).match(RE_LENGTH_UNIT)?.[1]
  switch (units) {
    case 'em':
      return value * 16
    case 'rem':
      return value * 16
    case 'cm':
      return (value * 96) / 2.54
    case 'mm':
      return (value * 96) / 2.54 / 10
    case 'in':
      return value * 96
    case 'pt':
      return value * 72
    case 'pc':
      return (value * 72) / 12
    default:
      return value
  }
}
