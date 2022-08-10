import { getConfig } from '../conf'
import { GenericFonts } from '../types'
import { LanguageContextType } from '../views/FontLanguage.types'

const extrasCache = new WeakMap()

export function getVariantExtras(
  props: any,
  languageContext?: LanguageContextType,
  theme?: any,
  defaultProps?: any,
  avoidDefaultProps = false
) {
  const conf = getConfig()

  if (extrasCache.has(props)) {
    return extrasCache.get(props)
  }

  const fonts = languageContext
    ? getFontsForLanguage(conf.fontsParsed, languageContext)
    : conf.fontsParsed

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    theme,
    // TODO do this in splitstlye
    // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
    props: avoidDefaultProps
      ? props
      : new Proxy(props, {
          // handles shorthands
          get(target, key) {
            const shorthand = conf.inverseShorthands[key as any]
            // shorthands before longhand because a styled() with longhand combined with inline shorthand
            // shorthand will always be the overriding key
            if (shorthand && Reflect.has(target, shorthand)) {
              return Reflect.get(target, shorthand)
            }
            if (Reflect.has(target, key)) {
              return Reflect.get(target, key)
            }
            // these props may be extracted into classNames, but we still want to access them
            // at runtime, so we proxy back to defaultProps but don't pass them
            if (defaultProps) {
              if (shorthand && Reflect.has(defaultProps, shorthand)) {
                return Reflect.get(defaultProps, shorthand)
              }
              if (Reflect.has(defaultProps, key)) {
                return Reflect.get(defaultProps, key)
              }
            }
          },
        }),
  }

  extrasCache.set(props, next)

  return next
}

const fontLanguageCache = new WeakMap()

export function getFontsForLanguage(fonts: GenericFonts, language: LanguageContextType) {
  if (fontLanguageCache.has(language)) {
    return fontLanguageCache.get(language)
  }
  const next = {
    ...fonts,
    ...Object.fromEntries(
      Object.entries(language).map(([name, lang]) => {
        if (lang === 'default') {
          return []
        }
        const langKey = `$${name}_${lang}`
        return [`$${name}`, fonts[langKey]]
      })
    ),
  }
  fontLanguageCache.set(language, next)
  return next
}
