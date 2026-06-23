// perf sensitive so doing some weird stuff

/**
 * next - take objects:
 *
 * { _shorthand: 'postfix' }
 *
 */

export function concatClassName(...args: any[]): any
export function concatClassName(_cn: Record<string, any> | null | undefined): string {
  const args = arguments
  const usedPrefixes = new Set<string>()
  let final = ''

  const len = args.length
  let propObjects: any = null
  for (let x = len; x >= 0; x--) {
    const cns = args[x]

    if (!cns) continue
    if (!Array.isArray(cns) && typeof cns !== 'string') {
      // is prop object
      propObjects = propObjects || []
      propObjects.push(cns)
      continue
    }

    const names = Array.isArray(cns) ? cns : cns.split(' ')
    const numNames = names.length
    for (let i = numNames - 1; i >= 0; i--) {
      const name = names[i]

      if (!name || name === ' ') continue
      if (name[0] !== '_') {
        // not snack style (todo slightly stronger heuristic)
        final = name + ' ' + final
        continue
      }

      const splitIndex = name.indexOf('-')
      if (splitIndex < 1) {
        final = name + ' ' + final
        // if (shouldDebug) console.log('debug exclude:', name, final)
        continue
      }

      const styleKey = name.slice(1, name.indexOf('-'))
      const { mediaKey, pseudoKey } = getClassNameScope(name, splitIndex)
      const uid = `${styleKey}${mediaKey ? `@${mediaKey}` : ''}${pseudoKey ? `:${pseudoKey}` : ''}`

      if (usedPrefixes.has(uid)) {
        // if (shouldDebug) console.log('debug exclude:', usedPrefixes, name)
        continue
      }
      usedPrefixes.add(uid)

      // overrides for full safety
      const propName = styleKey
      if (propName && propObjects) {
        if (
          propObjects.some((po) => {
            if (pseudoKey) {
              const propKey = pseudoInvert[pseudoKey]
              return po && po[propKey] && propName in po[propKey] && po[propKey] !== null
            }
            const res = po && propName in po && po[propName] !== null
            return res
          })
        ) {
          // if (shouldDebug) console.log('debug exclude:', name)
          continue
        }
      }

      final = name + ' ' + final
    }
  }

  return final.trim()
}

function getClassNameScope(name: string, splitIndex: number) {
  let mediaKey = ''
  let pseudoKey = ''
  let valueStart = splitIndex + 1

  if (name[valueStart] === '_') {
    const mediaEnd = name.indexOf('_', valueStart + 1)
    if (mediaEnd > valueStart + 1) {
      mediaKey = name.slice(valueStart + 1, mediaEnd)
      valueStart = mediaEnd + 1
    }
  }

  if (name[valueStart] === '0') {
    const pseudoStart = valueStart + 1
    for (const nextPseudoKey of pseudoKeys) {
      if (name.startsWith(`${nextPseudoKey}-`, pseudoStart)) {
        pseudoKey = nextPseudoKey
        break
      }
    }
  }

  return { mediaKey, pseudoKey }
}

const pseudoInvert = {
  hover: 'hoverStyle',
  active: 'pressStyle',
  focus: 'focusStyle',
  'focus-visible': 'focusVisibleStyle',
  'focus-within': 'focusWithinStyle',
  focusVisible: 'focusVisibleStyle',
  focusWithin: 'focusWithinStyle',
  disabled: 'disabledStyle',
  enter: 'enterStyle',
  exit: 'exitStyle',
}

const pseudoKeys = Object.keys(pseudoInvert).sort((a, b) => b.length - a.length)
