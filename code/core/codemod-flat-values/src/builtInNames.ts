import { v6ThemeNameReplacements } from '@tamagui/style-grammar/tooling'

export const v6CodemodBuiltInNameReplacements = {
  ...v6ThemeNameReplacements,
  // v3 removed backgroundActive after its component defaults had already
  // stopped resolving; press is the corrected active-state default
  backgroundActive: 'background-press',
  // v3 configs no longer alias `true`; the default config pointed it at `4`
  true: '4',
} as const

const builtInTokenPattern = new RegExp(
  `\\$(${Object.keys(v6CodemodBuiltInNameReplacements).join('|')})(?![\\w-])`,
  'g'
)

export function replaceV6BuiltInTokens(value: string): string {
  return value.replace(
    builtInTokenPattern,
    (_, name: keyof typeof v6CodemodBuiltInNameReplacements) =>
      `$${v6CodemodBuiltInNameReplacements[name]}`
  )
}
