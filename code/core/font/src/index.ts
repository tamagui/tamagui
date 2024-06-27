import { isWeb } from '@tamagui/constants'
import {
  createVariables,
  getConfig,
  parseFont,
  registerFontVariables,
} from '@tamagui/web'
import type { CreateTamaguiProps } from '@tamagui/web'

export function addFont(props: {
  fontFamilyName: string
  fontFamily: CreateTamaguiProps['fonts'][keyof CreateTamaguiProps['fonts']]
  insertCSS?: boolean
  // TODO make sure to add updateFont
  update?: boolean
}) {
  const config = getConfig()
  const { fontFamilyName: fontFamilyNameIn, fontFamily: fontFamilyIn } = props

  if (process.env.NODE_ENV === 'development') {
    if (!config) {
      throw new Error('No config')
    }
    const fontFamily = config.fonts[fontFamilyNameIn]
    if (!props.update && fontFamily) {
      return { fontFamily }
    }
  }

  config.fonts[fontFamilyNameIn] = fontFamilyIn

  const sep =
    process.env.NODE_ENV === 'development' ? config.cssStyleSeparator || ' ' : ''
  function declarationsToRuleSet(decs: string[], selector = '') {
    return `:root${selector} {${sep}${[...decs].join(`;${sep}`)}${sep}}`
  }

  if (isWeb) {
    const fontFamilyToken = createVariables(fontFamilyIn, 'f', true)
    const parsedFontFamily = parseFont(fontFamilyToken)
    const fontFamilyNameParsed = `$${fontFamilyNameIn}`
    config.fontsParsed[fontFamilyNameParsed] = parsedFontFamily

    if (props.insertCSS) {
      const [ff_name, ff_language] = fontFamilyNameParsed.includes('_')
        ? fontFamilyNameParsed.split('_')
        : [fontFamilyNameParsed]
      const fontVars = registerFontVariables(parsedFontFamily)
      const fontDeclaration = {
        [fontFamilyNameIn]: {
          name: ff_name.slice(1),
          declarations: fontVars,
          language: ff_language,
        },
      }

      const {
        name,
        declarations,
        language = 'default',
      } = fontDeclaration[fontFamilyNameIn]
      const fontSelector = `.font_${name}`
      const langSelector = `:root .t_lang-${name}-${language} ${fontSelector}`
      const selectors =
        language === 'default' ? ` ${fontSelector}, ${langSelector}` : langSelector
      const cssRuleSets = declarationsToRuleSet(declarations, selectors)

      const id = `t_font_style_${fontFamilyNameIn}`
      const existing = document.querySelector(`#${id}`)
      const style = document.createElement('style')
      style.id = id
      style.appendChild(document.createTextNode(`${cssRuleSets}`))
      document.head.appendChild(style)
      if (existing) {
        existing.parentElement?.removeChild(existing)
      }
      return {
        fontFamilyToken,
        fontDeclaration,
      }
    }
  }
}
