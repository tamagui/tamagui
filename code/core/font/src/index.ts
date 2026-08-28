import { isWeb } from '@tamagui/constants'
import { getConfig } from '@tamagui/web'
import {
  createVariables,
  parseFont,
  registerFontVariables,
} from '@tamagui/web/internal-runtime'
import type { CreateTamaguiProps } from '@tamagui/web'

type FontDefinition = NonNullable<CreateTamaguiProps['fonts']>[string]

export function addFont(props: {
  fontFamilyName: string
  fontFamily: FontDefinition
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
    // @ts-ignore
    process.env.NODE_ENV === 'development' ? config.cssStyleSeparator || ' ' : ''
  function declarationsToRuleSet(decs: string[], selector = '') {
    return `:root${selector} {${sep}${[...decs].join(`;${sep}`)}${sep}}`
  }

  if (isWeb) {
    const fontFamilyToken: FontDefinition = createVariables(fontFamilyIn, 'f', true)
    const parsedFontFamily = parseFont(fontFamilyToken)
    const fontFamilyNameParsed = fontFamilyNameIn
    config.fontsParsed[fontFamilyNameParsed] = parsedFontFamily

    if (props.insertCSS) {
      const [ff_name, ff_language] = fontFamilyNameParsed.includes('_')
        ? fontFamilyNameParsed.split('_')
        : [fontFamilyNameParsed]
      const fontVars: string[] = registerFontVariables(parsedFontFamily)
      const fontDeclaration = {
        [fontFamilyNameIn]: {
          name: ff_name,
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
