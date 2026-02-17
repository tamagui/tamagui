import { isWeb } from '@tamagui/constants'
import type { CreateTamaguiProps, Variable } from '../types'
import { getVariableVariable, isVariable } from '../createVariable'
import { autoVariables, registerCSSVariable, variableToCSS } from './registerCSSVariable'
import { getThemeCSSRules } from './getThemeCSSRules'
import { getAllRules } from './insertStyleRule'

type ThemeConfig = {
  cssRuleSets: string[]
  getThemeRulesSets: () => string[]
}

// helper to get font property CSS declarations
function getFontPropertyDeclarations(
  fontParsed: any,
  tokenKey: string = '$true'
): string[] {
  const props: string[] = ['font-family: var(--f-family)']

  const getVarRef = (obj: any) => {
    const val = obj?.[tokenKey]
    if (isVariable(val)) {
      return getVariableVariable(val)
    }
    return undefined
  }

  const letterSpacing = getVarRef(fontParsed.letterSpacing)
  if (letterSpacing) props.push(`letter-spacing: ${letterSpacing}`)

  const lineHeight = getVarRef(fontParsed.lineHeight)
  if (lineHeight) props.push(`line-height: ${lineHeight}`)

  const fontStyle = getVarRef(fontParsed.style)
  if (fontStyle) props.push(`font-style: ${fontStyle}`)

  const fontWeight = getVarRef(fontParsed.weight)
  if (fontWeight) props.push(`font-weight: ${fontWeight}`)

  return props
}

export { getFontPropertyDeclarations }

/**
 * Generates CSS for tokens - registers CSS variables and builds declaration strings
 */
export function createTokenCSS(
  tokens: Record<string, Record<string, Variable>>,
  shouldTokenCategoryHaveUnits: (category: string) => boolean
): string[] {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    const declarations: string[] = []
    const sortedTokenKeys = Object.keys(tokens).sort()

    for (const key of sortedTokenKeys) {
      const sortedSubKeys = Object.keys(tokens[key]).sort()
      for (const skey of sortedSubKeys) {
        const variable = tokens[key][skey] as Variable

        if (isWeb) {
          registerCSSVariable(variable)
          const variableNeedsPx = variable.needsPx === true
          const categoryNeedsPx = shouldTokenCategoryHaveUnits(key)
          const shouldBeUnitless = !(variableNeedsPx || categoryNeedsPx)
          declarations.push(variableToCSS(variable, shouldBeUnitless))
        }
      }
    }

    return declarations
  }
  return []
}

/**
 * Generates CSS for fonts
 */
export function createFontCSS(
  fontsParsed: Record<string, any> | undefined,
  registerFontVariables: (fontParsed: any) => string[]
): Record<
  string,
  { name: string; declarations: string[]; language?: string; fontParsed: any }
> {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    const fontDeclarations: Record<
      string,
      { name: string; declarations: string[]; language?: string; fontParsed: any }
    > = {}

    if (!fontsParsed) return fontDeclarations

    const sortedFontKeys = Object.keys(fontsParsed).sort()
    for (const key of sortedFontKeys) {
      const fontParsed = fontsParsed[key]
      const [name, language] = key.includes('_') ? key.split('_') : [key]
      const fontVars = registerFontVariables(fontParsed)
      fontDeclarations[key] = {
        name: name.slice(1),
        declarations: fontVars,
        language,
        fontParsed,
      }
    }

    return fontDeclarations
  }
  return {}
}

/**
 * Builds CSS rulesets from declarations
 */
export function buildCSSRuleSets(
  declarations: string[],
  fontDeclarations: Record<
    string,
    { name: string; declarations: string[]; language?: string; fontParsed: any }
  >,
  defaultFontToken: string = '$true'
): string[] {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    const cssRuleSets: string[] = []
    const sep = ' '

    function declarationsToRuleSet(decs: string[], selector = '') {
      return `:root${selector} {${sep}${[...decs].join(`;${sep}`)}\n}`
    }

    // non-font tokens
    if (declarations.length) {
      cssRuleSets.push(declarationsToRuleSet(declarations))
    }

    // fonts - each font_* sets CSS variables
    const fontSelectors: string[] = []
    const sortedFontDeclarationKeys = Object.keys(fontDeclarations).sort()
    for (const key of sortedFontDeclarationKeys) {
      const { name, declarations, language = 'default' } = fontDeclarations[key]
      const fontSelector = `.font_${name}`
      fontSelectors.push(fontSelector)
      const langSelector = `:root .t_lang-${name}-${language} ${fontSelector}`
      const selectors =
        language === 'default' ? ` ${fontSelector}, ${langSelector}` : langSelector
      const specificRuleSet = declarationsToRuleSet(declarations, selectors)
      cssRuleSets.push(specificRuleSet)
    }

    // shared rule: all font_* classes + is_View apply font properties
    // this resets fonts on Views like React Native does
    if (fontSelectors.length) {
      const firstFont = fontDeclarations[sortedFontDeclarationKeys[0]]
      if (firstFont?.fontParsed) {
        const fontProps = getFontPropertyDeclarations(
          firstFont.fontParsed,
          defaultFontToken
        )
        const sharedSelectors = [...fontSelectors, '.is_View'].join(', ')
        cssRuleSets.push(`${sharedSelectors} {${fontProps.join('; ')}}`)
      }
    }

    return cssRuleSets
  }
  return []
}

/**
 * Generates theme CSS rules
 */
export function createThemeCSS(
  dedupedThemes: Array<{ names: string[]; theme: any }>,
  configIn: CreateTamaguiProps
): string[] {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    let themeRuleSets: string[] = []

    if (isWeb) {
      for (const { names, theme } of dedupedThemes) {
        const nextRules = getThemeCSSRules({
          config: configIn,
          themeName: names[0],
          names,
          theme,
        })
        themeRuleSets = [...themeRuleSets, ...nextRules]
      }
    }

    return themeRuleSets
  }
  return []
}

/**
 * Gets all generated CSS - design system + runtime styles
 */
export function getCSS(
  themeConfig: ThemeConfig,
  opts: {
    separator?: string
    sinceLastCall?: boolean
    exclude?: 'themes' | 'design-system' | string | null
  } = {},
  lastIndex: { value: number }
): string {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS && process.env.TAMAGUI_TARGET === 'web') {
    const { separator = '\n', sinceLastCall, exclude } = opts

    if (sinceLastCall && lastIndex.value >= 0) {
      const rules = getAllRules()
      const newRules = rules.slice(lastIndex.value)
      lastIndex.value = rules.length
      return newRules.join(separator)
    }

    lastIndex.value = 0

    const runtimeStyles = getAllRules().join(separator)

    if (exclude === 'design-system') {
      return runtimeStyles
    }

    const themeRules = exclude ? '' : themeConfig.getThemeRulesSets().join(separator)

    // auto-generated vars from theme values not in tokens
    const autoVarCSS = autoVariables.length
      ? `:root{${autoVariables.map((v) => `--${v.name}:${v.val}`).join(';')}}`
      : ''

    // notes:
    // .is_Text .is_Text - we just override the text default styles here
    // display: inline breaks css transform styles

    const designSystem = `._ovs-contain {overscroll-behavior:contain;}
.is_View { display: flex; align-items: stretch; flex-direction: column; flex-basis: auto; box-sizing: border-box; min-height: 0; min-width: 0; flex-shrink: 0; }
.is_Text { display: inline; box-sizing: border-box; word-wrap: break-word; white-space: pre-wrap; margin: 0; }
._dsp_contents {display:contents;}
._no_backdrop::backdrop {display: none;}
.is_Input::selection, .is_TextArea::selection {background-color: var(--selectionColor);}
.is_Input::placeholder, .is_TextArea::placeholder {color: var(--placeholderColor);}
._hsb-x > div::-webkit-scrollbar:horizontal { display: none; }
._hsb-y > div::-webkit-scrollbar:vertical { display: none; }
${autoVarCSS}
${themeConfig.cssRuleSets.join(separator)}`

    return `${designSystem}
${themeRules}
${runtimeStyles}`
  }
  return ''
}
