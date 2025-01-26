import { useEffect, useState } from 'react'

export const useReplaceTokens = (code, mappedTokens) => {
  const [codeWithReplacedTokens, setcodeWithReplacedTokens] = useState(code)
  useEffect(() => {
    if (!mappedTokens) return
    const replacedText = replaceObjectTokenValues(code)
    setcodeWithReplacedTokens(replacedText)
  }, [code, mappedTokens])

  const mapTokenToAttribute = (_, key1, token1, key2, token2) => {
    const key = key1 || key2
    const token = token1 || token2
    const sizeAttributes = [
      'width',
      'height',
      'minWidth',
      'minHeight',
      'maxWidth',
      'maxHeight',
    ]
    const zIndexAttributes = ['zIndex']
    const radiusAttributes = [
      'borderRadius',
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
    ]
    const colorAttributes = [
      'color',
      'backgroundColor',
      'borderColor',
      'borderBottomColor',
      'borderTopColor',
      'borderLeftColor',
      'borderRightColor',
    ]
    const spaceAttributes = [
      'gap', // not referenced in docs for space attributes
      'margin',
      'padding',
      'marginLeft',
      'marginTop',
      'marginRight',
      'marginBottom',
      'paddingLeft',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
    ]

    let attributeCategory

    if (sizeAttributes.includes(key)) {
      attributeCategory = 'size'
    } else if (zIndexAttributes.includes(key)) {
      attributeCategory = 'zIndex'
    } else if (radiusAttributes.includes(key)) {
      attributeCategory = 'radius'
    } else if (spaceAttributes.includes(key)) {
      attributeCategory = 'space'
    } else {
      return `${key}="${'$' + token}"`
    }

    const tokenValue =
      mappedTokens[attributeCategory]?.[token].userMatch.key || '$' + token

    return `${key}="${tokenValue}"`
  }

  /**
   * Matches the pattern $ followed by any word or number, ensuring it's within an object or a component prop.
   * This pattern ensures matching only values within objects or component props by looking for a $ sign that is immediately followed by a word or number, and ensuring it's within curly braces or component props.
   * It captures the key associated with the value to be replaced and handles nested structures as well.
   */
  const replaceObjectTokenValues = (code: string) => {
    const pattern =
      /([a-zA-Z0-9]+)\s*:\s*['"]?\$([a-zA-Z0-9.]+)['"]?|([a-zA-Z0-9]+)=['"]\$([a-zA-Z0-9.]+)['"]/g
    return code.replace(pattern, mapTokenToAttribute)
  }
  return { codeWithReplacedTokens }
}
