import type { LonghandProgram, ParsedValue } from './valueTypes'

export const longhandExpansionTable: Readonly<Record<string, readonly string[]>> = {
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  paddingHorizontal: ['paddingLeft', 'paddingRight'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  marginHorizontal: ['marginLeft', 'marginRight'],
  marginVertical: ['marginTop', 'marginBottom'],
  inset: ['top', 'right', 'bottom', 'left'],
  borderWidth: [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ],
  borderColor: [
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
  ],
  borderStyle: [
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
  ],
  borderRadius: [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ],
  overflow: ['overflowX', 'overflowY'],
  gap: ['rowGap', 'columnGap'],
}

export function expandToLonghands(
  prop: string,
  shorthands?: Record<string, string>
): readonly string[] {
  const resolvedProp = shorthands?.[prop] ?? prop
  return longhandExpansionTable[resolvedProp] ?? [resolvedProp]
}

export function mergePrograms(
  entries: ReadonlyArray<{ prop: string; value: ParsedValue }>,
  shorthands?: Record<string, string>
): Map<string, LonghandProgram> {
  const programs = new Map<string, LonghandProgram>()

  for (const { prop, value } of entries) {
    for (const property of expandToLonghands(prop, shorthands)) {
      programs.delete(property)
      programs.set(property, { property, value, sourceProp: prop })
    }
  }

  return programs
}
