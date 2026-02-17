import { isWeb } from '@tamagui/constants'
import type { CreateTamaguiProps, Variable } from '../types'
import { autoVariables, registerCSSVariable, variableToCSS } from './registerCSSVariable'
import { getThemeCSSRules } from './getThemeCSSRules'
import { getAllRules } from './insertStyleRule'

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
): Record<string, { name: string; declarations: string[]; language?: string }> {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    const fontDeclarations: Record<
      string,
      { name: string; declarations: string[]; language?: string }
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
    { name: string; declarations: string[]; language?: string }
  >
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

    // fonts
    const sortedFontDeclarationKeys = Object.keys(fontDeclarations).sort()
    for (const key of sortedFontDeclarationKeys) {
      const { name, declarations, language = 'default' } = fontDeclarations[key]
      const fontSelector = `.font_${name}`
      const langSelector = `:root .t_lang-${name}-${language} ${fontSelector}`
      const selectors =
        language === 'default' ? ` ${fontSelector}, ${langSelector}` : langSelector
      const specificRuleSet = declarationsToRuleSet(declarations, selectors)
      cssRuleSets.push(specificRuleSet)
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

    const designSystem = `._ovs-contain {overscroll-behavior:contain;}
.is_Text .is_Text {display:inline-flex; font-family: inherit; font-weight: inherit; font-style: inherit; line-height: inherit;}
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
