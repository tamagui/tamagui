// published a patched version that works on native
import ow from '@tamagui/ow/dev-only'

export const validateConfig = (conf: any) => {
  if (!conf) {
    console.warn('no conf?')
    return
  }
  try {
    ow(conf, validConfig)
  } catch (err: any) {
    console.warn('Given config:\n', JSON.stringify(conf, null, 2), err)
  }
}

const validConfig = ow.object.exactShape({
  defaultTheme: ow.optional.string,
  disableRootThemeClass: ow.optional.boolean,
  shorthands: ow.optional.object.valuesOfType(ow.string),
  themes: ow.object.valuesOfType(ow.object),
  tokens: ow.object.valuesOfType(ow.object),
  media: ow.object.valuesOfType(ow.object),
  animations: ow.object.valuesOfType(ow.object),
})

const validFont = ow.object.exactShape({
  family: ow.string,
  size: ow.object.nonEmpty.valuesOfType(ow.number),
  lineHeight: ow.object.nonEmpty.valuesOfType(ow.number),
  weight: ow.object.nonEmpty.valuesOfType(ow.string),
  letterSpacing: ow.object.nonEmpty.valuesOfType(ow.number),
})

const validTokens = ow.object.exactShape({
  font: ow.object.valuesOfType(validFont),
  size: ow.object.nonEmpty.valuesOfType(ow.number),
  space: ow.object.nonEmpty.valuesOfType(ow.number),
  zIndex: ow.object.nonEmpty.valuesOfType(ow.number),
  radius: ow.object.nonEmpty.valuesOfType(ow.number),
  color: ow.object.nonEmpty.valuesOfType(ow.string),
})

export const validateTokens = (tokens: any) => {
  try {
    ow(tokens, validTokens)
  } catch (err: any) {
    console.warn('Given tokens:\n', JSON.stringify(tokens, null, 2), err)
  }
}

export const validateFont = (font: any) => {
  try {
    ow(font, validFont)
  } catch (err: any) {
    console.warn('Given font:\n', JSON.stringify(font, null, 2), err)
  }
}
