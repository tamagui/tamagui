import type { Flag, SiteReport } from './convert'
import type { FunctionalVariantReport } from './functionalVariants'
import type { SheetFrameReport } from './sheetAnatomy'

export interface FileReport {
  file: string
  sites: SiteReport[]
  functionalVariants: FunctionalVariantReport[]
  sheetFrames: SheetFrameReport[]
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
  warnings: number
  /** sites with nothing to convert until the runtime catches up */
  waiting: number
  ignoredFiles: number
  functionalVariantSites: number
  functionalVariantConverted: number
  functionalVariantFlagged: number
  functionalVariantFlags: Record<string, number>
  sheetFrames: number
  /** rewritten, but with a spread or a styled target a human has to place */
  sheetFramesFlagged: number
}

export function renderReport(
  files: readonly FileReport[],
  corpus: readonly string[],
  registryDiagnostics: readonly string[],
  ignoredFiles = 0,
  write = false
): { text: string; summary: ReportSummary } {
  const sites = files.flatMap((file) => file.sites)
  const functionalVariants = files.flatMap((file) => file.functionalVariants)
  const sheetFrames = files.flatMap((file) => file.sheetFrames)
  const flaggedSheetFrames = sheetFrames.filter((site) => site.flags.length > 0)
  const convertedFunctionalVariants = functionalVariants.filter((site) => site.converted)
  const flaggedFunctionalVariants = functionalVariants.filter((site) => !site.converted)
  const clean = sites.filter(
    (site) =>
      site.flags.length === 0 &&
      site.warnings.length === 0 &&
      site.assessmentVerdict === 'clean'
  )
  const flagged = sites.filter((site) => site.flags.length > 0)
  const warnings = sites.filter((site) => site.warnings.length > 0)
  const needsRelocation = sites.filter(
    (site) => site.assessmentVerdict === 'needs-relocation'
  )
  const unknownHost = sites.filter((site) => site.assessmentVerdict === 'unknown-host')
  const ineligible = sites.filter((site) => site.assessmentVerdict === 'ineligible')
  const waiting = clean.filter((site) => site.programs.length === 0)
  const jsx = sites.filter((site) => site.kind === 'jsx')
  const styled = sites.filter((site) => site.kind === 'styled')
  const cleanJsx = jsx.filter(
    (site) =>
      site.flags.length === 0 &&
      site.warnings.length === 0 &&
      site.assessmentVerdict === 'clean'
  ).length
  const cleanStyled = styled.filter(
    (site) =>
      site.flags.length === 0 &&
      site.warnings.length === 0 &&
      site.assessmentVerdict === 'clean'
  ).length
  const touched = (file: FileReport) =>
    file.sites.length > 0 ||
    file.functionalVariants.length > 0 ||
    file.sheetFrames.length > 0
  const blocked = (file: FileReport) =>
    file.sites.some((site) => site.legacyLeft > 0) ||
    file.functionalVariants.some((site) => !site.converted) ||
    file.sheetFrames.some((site) => site.flags.length > 0)
  const readyFiles = files.filter((file) => touched(file) && !blocked(file))
  const filesWithSites = files.filter(touched).length
  const blockedFiles = files.filter(blocked).map((file) => file.file)
  const functionalFlagCounts = countCodes(
    flaggedFunctionalVariants.flatMap((site) => [
      ...new Map(site.flags.map((flag) => [flag.code, flag])).values(),
    ])
  )

  const lines = [
    '# Flat-values codemod dry-run',
    '',
    `Corpus: ${corpus.map((entry) => `\`${entry}\``).join(', ')}.`,
    '',
    write
      ? 'Statically safe conversions were written in place. Flagged legacy syntax remains for manual migration.'
      : 'Dry run only: no source files were written. Pass `--write` to apply statically safe conversions.',
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
    `- ${warnings.length} have configuration warnings for manual review`,
    `- ${ignoredFiles} source files skipped by \`.tamagui-flat-values-ignore\` markers`,
    `- ${jsx.length} JSX sites: ${cleanJsx} clean, ${jsx.length - cleanJsx} need review`,
    `- ${styled.length} styled config sites: ${cleanStyled} clean, ${styled.length - cleanStyled} need review`,
    `- ${functionalVariants.length} functional variant sites found`,
    `- ${convertedFunctionalVariants.length} functional variants have automatic styled.dynamic rewrites`,
    `- ${flaggedFunctionalVariants.length} functional variants need manual migration`,
    `- ${sheetFrames.length} Sheet.Frame sites rewritten to Sheet.Container plus Sheet.Background`,
    `- ${flaggedSheetFrames.length} Sheet.Frame sites need a human to place a spread or a styled target`,
    '',
    '### Functional variant flag reasons',
    '',
    ...(functionalFlagCounts.length
      ? functionalFlagCounts.map(([code, count]) => `- ${code}: ${count}`)
      : ['- none']),
    '',
    '### Remaining manual migration',
    '',
    `${readyFiles.length} of ${filesWithSites} files have no legacy condition object, flagged functional variant, or flagged Sheet.Frame left after`,
    'conversion. V3 has no compatibility setting; finish the remaining files directly:',
    blockedFiles.length
      ? blockedFiles.map((file) => `\`${file}\``).join(', ')
      : 'every file in this corpus is fully migrated.',
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

  const warningCounts = countCodes(warnings.flatMap((site) => site.warnings))
  lines.push(
    '',
    '### Configuration warning reasons',
    '',
    ...(warningCounts.length
      ? warningCounts.map(([code, count]) => `- ${code}: ${count}`)
      : ['- none'])
  )

  const inventoryCounts = countCodes(sites.flatMap((site) => site.inventory))
  if (inventoryCounts.length) {
    lines.push(
      '',
      '### Values left authored for another migration',
      '',
      'These are not flat-value migration work. The conversion keeps them exactly as',
      'authored and records them so their follow-up migrations have a corpus inventory.',
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
    if (!touched(file)) continue
    lines.push('', `## \`${file.file}\``, '')
    for (const site of file.sheetFrames) {
      lines.push(
        `### ${site.label} at line ${site.line} (${site.flags.length ? 'review' : 'automatic'})`,
        '',
        'Before:',
        '',
        '```tsx',
        site.before,
        '```',
        '',
        'Automatic rewrite:',
        '',
        '```tsx',
        site.after,
        '```'
      )
      if (site.flags.length) {
        lines.push('', 'Flags:', '')
        for (const flag of site.flags) lines.push(`- **${flag.code}**: ${flag.detail}`)
      }
      lines.push('')
    }
    for (const site of file.functionalVariants) {
      lines.push(
        `### ${site.label} functional variant at line ${site.line} (${site.converted ? 'automatic' : 'manual'})`,
        '',
        'Before:',
        '',
        '```tsx',
        site.before,
        '```',
        '',
        site.converted ? 'Automatic rewrite:' : 'Left authored:',
        '',
        '```tsx',
        site.after,
        '```'
      )
      if (site.flags.length) {
        lines.push('', 'Flags:', '')
        for (const flag of site.flags) lines.push(`- **${flag.code}**: ${flag.detail}`)
      }
      if (site.draft) {
        lines.push('', 'Generated `.resolve` draft:', '', '```tsx', site.draft, '```')
      }
      if (site.notes.length) {
        lines.push('', 'Notes:', '')
        for (const note of site.notes) lines.push(`- ${note}`)
      }
      lines.push('')
    }
    for (const site of file.sites) {
      const status = [
        site.assessmentVerdict === 'clean' ? null : site.assessmentVerdict,
        site.flags.length ? 'syntax-blocked' : null,
        site.warnings.length ? 'configuration-warning' : null,
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
      if (site.warnings.length) {
        lines.push('', 'Configuration warnings:', '')
        for (const warning of site.warnings) {
          lines.push(`- **${warning.code}**: ${warning.detail}`)
        }
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
      warnings: warnings.length,
      waiting: waiting.length,
      ignoredFiles,
      functionalVariantSites: functionalVariants.length,
      functionalVariantConverted: convertedFunctionalVariants.length,
      functionalVariantFlagged: flaggedFunctionalVariants.length,
      functionalVariantFlags: Object.fromEntries(functionalFlagCounts),
      sheetFrames: sheetFrames.length,
      sheetFramesFlagged: flaggedSheetFrames.length,
    },
  }
}
