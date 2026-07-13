import {
  grammarDecisions,
  grammarEntries,
  wholeClassConveniences,
  wholeClassUtilities,
} from './registry'

export function generateGrammarTable(): string {
  const rows = [
    '| Candidate | Props | Token category | Convenience |',
    '| --- | --- | --- | --- |',
  ]
  const byPrefix = new Map<string, (typeof grammarEntries)[number][]>()
  for (const entry of grammarEntries) {
    if (!entry.prefix) continue
    const entries = byPrefix.get(entry.prefix) || []
    entries.push(entry)
    byPrefix.set(entry.prefix, entries)
  }
  for (const [prefix, entries] of [...byPrefix].sort(([a], [b]) => a.localeCompare(b))) {
    rows.push(
      `| \`${prefix}-<value>\` | ${entries.map((entry) => `\`${entry.prop}\``).join(', ')} | ${
        [...new Set(entries.map((entry) => entry.tokenCategory).filter(Boolean))].join(
          ', '
        ) || 'raw/enum'
      } | ${
        [...new Set(entries.flatMap((entry) => entry.conveniences || []))].join(', ') ||
        'none'
      } |`
    )
  }
  rows.push(
    '| arbitrary values | `<prefix>-[<value>]` | none | canonical raw-value form |'
  )
  rows.push('', '| Whole-class utility | Props | Kind |', '| --- | --- | --- |')
  for (const candidate of Object.keys(wholeClassUtilities).sort()) {
    const properties = Object.keys(wholeClassUtilities[candidate])
      .map((prop) => `\`${prop}\``)
      .join(', ')
    rows.push(
      `| \`${candidate}\` | ${properties} | ${wholeClassConveniences[candidate] || 'enum'} |`
    )
  }
  rows.push('', '| Convenience syntax | Decision | Reason |', '| --- | --- | --- |')
  for (const decision of grammarDecisions) {
    rows.push(`| \`${decision.syntax}\` | ${decision.decision} | ${decision.reason} |`)
  }
  return rows.join('\n')
}

export const grammarTable: string = generateGrammarTable()
