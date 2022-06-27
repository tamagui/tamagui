// published a patched version that works on native
// @ts-ignore
import { default as ow } from '@tamagui/ow/dev-only'

let Config: any
let Tokens: any
let FontRequired: any
let FontOptional: any

export const validateConfig = (conf: any) => {
  if (!conf) {
    console.warn('no conf?')
    return
  }
  try {
    ow(conf, Config)
  } catch (err: any) {
    console.warn('Given config:\n', JSON.stringify(conf, null, 2), err)
  }
}

export const validateTokens = (tokens: any) => {
  try {
    ow(tokens, Tokens)
  } catch (err: any) {
    console.warn('Given tokens:\n', JSON.stringify(tokens, null, 2), err)
  }
}

export const validateFont = (font: any) => {
  try {
    const { style, transform, color, ...required } = font
    ow(required, FontRequired)
    ow({ style, transform, color }, FontOptional)
  } catch (err: any) {
    console.warn('Given font:\n', JSON.stringify(font, null, 2), err)
  }
}

if (process.env.NODE_ENV === 'development') {
  const fontReq = {
    family: ow.string,
    size: ow.object.nonEmpty.valuesOfType(ow.number),
    lineHeight: ow.object.nonEmpty.valuesOfType(ow.number),
    weight: ow.object.nonEmpty.valuesOfType(ow.string),
    letterSpacing: ow.object.nonEmpty.valuesOfType(ow.number),
  }
  const fontOpt = {
    style: ow.optional.object.valuesOfType(ow.string),
    transform: ow.optional.object.valuesOfType(ow.string),
    color: ow.optional.object.valuesOfType(ow.any(ow.string, ow.object)),
  }

  Config = ow.object.exactShape({
    defaultTheme: ow.optional.string,
    disableRootThemeClass: ow.optional.boolean,
    shorthands: ow.optional.object.valuesOfType(ow.string),
    themes: ow.object.valuesOfType(ow.object),
    tokens: ow.object.valuesOfType(ow.object),
    media: ow.object.valuesOfType(ow.object),
    animations: ow.object.valuesOfType(ow.object),
    fonts: ow.object.valuesOfType(
      ow.object.partialShape({
        ...fontReq,
        ...fontOpt,
      })
    ),
  })

  FontRequired = ow.object.exactShape(fontReq)
  FontOptional = ow.object.partialShape(fontOpt)

  Tokens = ow.object.exactShape({
    size: ow.object.nonEmpty.valuesOfType(ow.any(ow.number, ow.object)),
    space: ow.object.nonEmpty.valuesOfType(ow.any(ow.number, ow.object)),
    zIndex: ow.object.nonEmpty.valuesOfType(ow.any(ow.number, ow.object)),
    radius: ow.object.nonEmpty.valuesOfType(ow.any(ow.number, ow.object)),
    color: ow.object.nonEmpty.valuesOfType(ow.any(ow.string, ow.object)),
  })
}
