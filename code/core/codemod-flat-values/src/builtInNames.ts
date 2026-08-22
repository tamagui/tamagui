import { v6ThemeNameReplacements } from '@tamagui/style-grammar/tooling'

export const v6CodemodBuiltInNameReplacements = {
  ...v6ThemeNameReplacements,
  // v3 removed backgroundActive after its component defaults had already
  // stopped resolving; press is the corrected active-state default
  backgroundActive: 'background-press',
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
