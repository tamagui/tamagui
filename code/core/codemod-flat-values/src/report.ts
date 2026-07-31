import type { Flag, SiteReport } from './convert'

export interface FileReport {
  file: string
  sites: SiteReport[]
}

function countCodes(flags: Iterable<Flag>): Array<[string, number]> {
  const counts = new Map<string, number>()
  for (const flag of flags) counts.set(flag.code, (counts.get(flag.code) ?? 0) + 1)
  return [...counts].sort(
    ([leftCode, leftCount], [rightCode, rightCount]) =>
      rightCount - leftCount || leftCode.localeCompare(rightCode)
  )
}

export interface ReportSummary {
  sites: number
  clean: number
  needsRelocation: number
  unknownHost: number
  ineligible: number
  flagged: number
  /** sites with nothing to convert until the runtime catches up */
  waiting: number
}

export function renderReport(
  files: readonly FileReport[],
  corpus: readonly string[],
  registryDiagnostics: readonly string[]
): { text: string; summary: ReportSummary } {
  const sites = files.flatMap((file) => file.sites)
  const clean = sites.filter(
    (site) => site.flags.length === 0 && site.assessmentVerdict === 'clean'
  )
  const flagged = sites.filter((site) => site.flags.length > 0)
  const needsRelocation = sites.filter(
    (site) => site.assessmentVerdict === 'needs-relocation'
  )
  const unknownHost = sites.filter((site) => site.assessmentVerdict === 'unknown-host')
  const ineligible = sites.filter((site) => site.assessmentVerdict === 'ineligible')
  const waiting = clean.filter((site) => site.programs.length === 0)
  const jsx = sites.filter((site) => site.kind === 'jsx')
  const styled = sites.filter((site) => site.kind === 'styled')
  const cleanJsx = jsx.filter(
    (site) => site.flags.length === 0 && site.assessmentVerdict === 'clean'
  ).length
  const cleanStyled = styled.filter(
    (site) => site.flags.length === 0 && site.assessmentVerdict === 'clean'
  ).length
  const readyFiles = files.filter(
    (file) => file.sites.length > 0 && file.sites.every((site) => site.legacyLeft === 0)
  )
  const filesWithSites = files.filter((file) => file.sites.length > 0).length
  const blockedFiles = files
    .filter((file) => file.sites.some((site) => site.legacyLeft > 0))
    .map((file) => file.file)

  const lines = [
    '# Flat-values codemod dry-run',
    '',
    `Corpus: ${corpus.map((entry) => `\`${entry}\``).join(', ')}.`,
    '',
    'No source files were written, and no config was edited. All runtime gates are',
    'closed; enabling an apply/write mode requires explicit user approval.',
    '',
    '## Summary',
    '',
    `- ${sites.length} conversion sites found`,
    `- ${clean.length - waiting.length} converted with no open questions`,
    `- ${needsRelocation.length} need relocation because the authored target or host cannot evaluate the conversion`,
    `- ${unknownHost.length} have an unverified host type`,
    `- ${ineligible.length} use properties that cannot carry flat clauses`,
    `- ${waiting.length} have nothing to convert until the runtime catches up (see below)`,
    `- ${flagged.length} have syntax or ordering flags for manual work`,
    `- ${jsx.length} JSX sites: ${cleanJsx} clean, ${jsx.length - cleanJsx} need review`,
    `- ${styled.length} styled config sites: ${cleanStyled} clean, ${styled.length - cleanStyled} need review`,
    '',
    '### Turning off `legacyConditionObjects`',
    '',
    `${readyFiles.length} of ${filesWithSites} files have no legacy condition object left after`,
    'conversion. The setting lives in your `createTamagui` call and this tool never edits it:',
    blockedFiles.length
      ? `remove it once these files are migrated by hand: ${blockedFiles
          .map((file) => `\`${file}\``)
          .join(', ')}.`
      : 'every file in this corpus is ready, so the setting can be removed.',
    '',
    '### Flag reasons',
    '',
  ]

  const flagCounts = countCodes(flagged.flatMap((site) => site.flags))
  lines.push(
    ...(flagCounts.length
      ? flagCounts.map(([code, count]) => `- ${code}: ${count}`)
      : ['- none'])
  )

  const inventoryCounts = countCodes(sites.flatMap((site) => site.inventory))
  if (inventoryCounts.length) {
    lines.push(
      '',
      '### Values left authored for another migration',
      '',
      'These are not flat-value migration work. The conversion keeps them exactly as',
      'authored and records them so the transition and structured-native designs have',
      'a corpus inventory.',
      '',
      ...inventoryCounts.map(([code, count]) => `- ${code}: ${count}`)
    )
  }

  const pendingCounts = countCodes(sites.flatMap((site) => site.pending))
  if (pendingCounts.length) {
    lines.push(
      '',
      '### Waiting on runtime support',
      '',
      'The conversion is known but not offered, because the runtime cannot read it yet.',
      'Each pending reason below names the exact host or merge contract that must land',
      'before the suggested source is safe to apply.',
      '',
      ...pendingCounts.map(([code, count]) => `- ${code}: ${count}`)
    )
  }

  if (registryDiagnostics.length) {
    lines.push('', '### Modifier registry diagnostics', '')
    for (const diagnostic of registryDiagnostics) lines.push(`- ${diagnostic}`)
  }

  for (const file of files) {
    if (!file.sites.length) continue
    lines.push('', `## \`${file.file}\``, '')
    for (const site of file.sites) {
      const status = [
        site.assessmentVerdict === 'clean' ? null : site.assessmentVerdict,
        site.flags.length ? 'syntax-blocked' : null,
      ]
        .filter(Boolean)
        .join(', ')
      lines.push(
        `### ${site.label} at line ${site.line} (${status || 'clean'})`,
        '',
        'Before:',
        '',
        '```tsx',
        site.before,
        '```',
        '',
        'After:',
        '',
        '```tsx',
        site.after,
        '```'
      )
      if (site.flags.length) {
        lines.push('', 'Flags:', '')
        for (const flag of site.flags) lines.push(`- **${flag.code}**: ${flag.detail}`)
      }
      if (site.assessments.length) {
        lines.push('', 'Conversion assessment:', '')
        for (const assessment of site.assessments) {
          for (const reason of assessment.reasons) {
            lines.push(
              `- **${assessment.verdict}: ${assessment.property}**: ${reason.message}. Remedy: ${reason.remedy}.`
            )
          }
        }
      }
      if (site.inventory.length) {
        lines.push('', 'Left authored:', '')
        for (const flag of site.inventory)
          lines.push(`- **${flag.code}**: ${flag.detail}`)
      }
      if (site.pending.length) {
        lines.push('', 'Waiting on runtime support:', '')
        for (const flag of site.pending) lines.push(`- **${flag.code}**: ${flag.detail}`)
      }
      if (site.notes.length) {
        lines.push('', 'Notes:', '')
        for (const note of site.notes) lines.push(`- ${note}`)
      }
      lines.push('')
    }
  }

  return {
    text: `${lines.join('\n')}\n`,
    summary: {
      sites: sites.length,
      clean: clean.length,
      needsRelocation: needsRelocation.length,
      unknownHost: unknownHost.length,
      ineligible: ineligible.length,
      flagged: flagged.length,
      waiting: waiting.length,
    },
  }
}
