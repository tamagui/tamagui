// developer-tools contract: exact token provenance for a component's final
// winning native style object.
//
// this is a pure inspection side channel. it records, per resolved style key,
// which token produced the value and the full theme name that resolved it
// (e.g. { backgroundColor: { token: '$background', theme: 'light_accent' } }).
// a literal value produces NO entry, which is how a literal that happens to
// equal a token value stays distinguishable from the token.
//
// the data is attached as a NON-ENUMERABLE, symbol-keyed property so it never
// changes the style object's enumerable keys or the React Native output, and
// tamagui's own rendering never reads it back. this mirrors the
// `styleOriginalValues` WeakMap precedent (metadata beside the style, keyed off
// to the side), but uses an own-property so a cross-package consumer can read it
// without importing tamagui.
//
// consumers read the property by the SAME registered symbol —
// `Symbol.for(STYLE_TOKEN_PROVENANCE_KEY)` — which shares one global registry
// per realm, so no shared module import is required.

export const STYLE_TOKEN_PROVENANCE_KEY = 'tamagui.styleTokenProvenance'

const provenanceSymbol = /* @__PURE__ */ Symbol.for(STYLE_TOKEN_PROVENANCE_KEY)

export type StyleTokenBinding = {
  /** original token string before resolution, e.g. '$background' or '$color9' */
  token: string
  /** full resolved theme name that produced the value, e.g. 'light_accent' */
  theme: string
}

export type StyleTokenProvenance = Record<string, StyleTokenBinding>

export function setStyleTokenProvenance(
  style: object,
  provenance: StyleTokenProvenance
) {
  Object.defineProperty(style, provenanceSymbol, {
    value: provenance,
    enumerable: false,
    configurable: true,
    writable: true,
  })
}

export function getStyleTokenProvenance(
  style: object | null | undefined
): StyleTokenProvenance | undefined {
  if (!style) return undefined
  return (style as Record<symbol, StyleTokenProvenance>)[provenanceSymbol]
}
