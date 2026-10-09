import { createTamagui, Text, styled } from '@tamagui/web'

const config = createTamagui({
  shorthands: {},
  fonts: {
    body: { family: 'Body', size: { 1: 16 } },
    display: { family: 'Display', size: { 1: 24 } },
    serif: { family: 'Brand Serif', size: { 1: 16 } },
  },
  settings: {
    allowedStyleValues: 'somewhat-strict-web',
  },
})

declare module '@tamagui/web' {
  interface TamaguiCustomConfig extends typeofConfig {}
}
type typeofConfig = typeof config

const valid = <Text fontFamily="display" />
const configuredGeneric = <Text fontFamily="serif" />
const validStyled = styled(Text, { fontFamily: 'body' })

// @ts-expect-error unconfigured fonts cannot bypass configured family names
const unknown = <Text fontFamily="missing-font" />
// @ts-expect-error css generic families must be explicitly configured
const fantasy = <Text fontFamily="fantasy" />
// @ts-expect-error css generic families must be explicitly configured
const cursive = <Text fontFamily="cursive" />
// @ts-expect-error styled defaults follow the same configured font contract
const unknownStyled = styled(Text, { fontFamily: 'math' })
