import { isWeb } from '@tamagui/constants'
import type { CreateTamaguiProps, Variable } from '../types'
import { autoVariables, registerCSSVariable, variableToCSS } from './registerCSSVariable'
import { getThemeCSSRules } from './getThemeCSSRules'
import { getAllRules, wrapStyleRules } from './insertStyleRule'

type ThemeConfig = {
  cssRuleSets: string[]
  getThemeRulesSets: () => string[]
}

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
        name,
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
  defaultFontToken = ''
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
    // this resets fonts on Views like React Native does; the declarations must
    // follow settings.defaultFont, never the sorted selector order
    if (fontSelectors.length) {
      const defaultFont = fontDeclarations[defaultFontToken]
      if (defaultFont?.fontParsed) {
        // These are defaults, so an atomic style prop must be able to override
        // them regardless of stylesheet insertion order.
        const sharedSelectors = `:where(${[...fontSelectors, '.is_View'].join(', ')})`
        cssRuleSets.push(`${sharedSelectors} {font-family: var(--f-family)}`)
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
      return wrapStyleRules(newRules.join(separator))
    }

    lastIndex.value = 0

    const runtimeStyles = getAllRules().join(separator)

    if (exclude === 'design-system') {
      return wrapStyleRules(runtimeStyles)
    }

    const themeRules = exclude ? '' : themeConfig.getThemeRulesSets().join(separator)

    // auto-generated vars from theme values not in tokens
    const autoVarCSS = autoVariables.length
      ? `:root{${autoVariables.map((v) => `--${v.name}:${v.val}`).join(';')}}`
      : ''

    // notes:
    // @scope (.is_Text) to (.is_View) - inherit text styles in nested Text without View boundary
    // display: inline breaks css transform styles

    // !important or else random css easily overrides, the prop is absolute (local-first styling)
    const hideScrollBarsCSS = `._hsb-x::-webkit-scrollbar:horizontal { display: none !important; }
._hsb-y::-webkit-scrollbar:vertical { display: none !important; }
._hsb-x { scrollbar-width: none !important; }
._hsb-y { scrollbar-width: none !important; }`
    const pointerEventsCSS = `:root ._pe-boxonly>* {pointer-events:none;}
:root ._pe-boxnone>* {pointer-events:auto;}`

    const designSystem = `._ovs-contain {overscroll-behavior:contain;}
.t_unmounted .is_View, .t_unmounted .is_Text { transition: none !important; }
:where(.is_View) { display: flex; align-items: stretch; flex-direction: column; flex-basis: auto; box-sizing: border-box; min-height: 0; min-width: 0; flex-shrink: 0; }
:where(.is_Text) { display: inline; box-sizing: border-box; word-wrap: break-word; white-space: pre-wrap; margin: 0; }
@scope (.is_Text) to (.is_View) { :where(.is_Text) { white-space: inherit; word-wrap: inherit; } }
._dsp_contents {display:contents;}
._no_backdrop::backdrop {display: none;}
.is_Input::selection, .is_TextArea::selection {background-color: var(--t_selectionColor);}
.is_Input::placeholder, .is_TextArea::placeholder {color: var(--t_placeholderColor);}
${pointerEventsCSS}
${hideScrollBarsCSS}
${autoVarCSS}
${themeConfig.cssRuleSets.join(separator)}`

    return wrapStyleRules(`${designSystem}
${themeRules}
${runtimeStyles}`)
  }
  return ''
}
