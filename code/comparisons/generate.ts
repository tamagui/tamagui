/**
 * generates coverage comparison tables in markdown and HTML
 *
 * usage:
 *   bun code/comparisons/generate.ts
 *   bun code/comparisons/generate.ts --format=html
 *   bun code/comparisons/generate.ts --format=md
 *   bun code/comparisons/generate.ts --format=all
 */

import { categories, computeCoverage, type SupportLevel, type Category } from './data'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const format = process.argv.find((a) => a.startsWith('--format='))?.split('=')[1] ?? 'all'
const outDir = join(import.meta.dir, 'output')
mkdirSync(outDir, { recursive: true })

const frameworks = ['tamagui', 'tailwind', 'nativewind', 'uniwind'] as const
type Framework = (typeof frameworks)[number]
const frameworkLabel: Record<Framework, string> = {
  tamagui: 'Tamagui',
  tailwind: 'Tailwind',
  nativewind: 'NativeWind v5',
  uniwind: 'Uniwind',
}

// weighted coverage %: full=1, partial & web-only=0.5
function coveragePct(s: { full: number; partial: number; webOnly: number; total: number }) {
  return ((s.full + s.partial * 0.5 + s.webOnly * 0.5) / s.total) * 100
}

// count of utilities at a given level for a framework within a set of categories
function countLevel(cats: Category[], fw: Framework, level: SupportLevel) {
  let n = 0
  for (const cat of cats) for (const u of cat.utilities) if (u.support[fw] === level) n++
  return n
}

// per-category stats for one framework
function categoryStats(cat: Category, fw: Framework) {
  const s = { full: 0, partial: 0, webOnly: 0, none: 0, total: 0 }
  for (const u of cat.utilities) {
    s.total++
    const lvl = u.support[fw]
    if (lvl === 'full') s.full++
    else if (lvl === 'partial') s.partial++
    else if (lvl === 'web-only') s.webOnly++
    else s.none++
  }
  return s
}

// ── markdown ──────────────────────────────────────────

function supportIcon(level: SupportLevel): string {
  switch (level) {
    case 'full':
      return '✅'
    case 'partial':
      return '⚠️'
    case 'web-only':
      return '🌐'
    case 'none':
      return '❌'
  }
}

function generateMarkdown(): string {
  const lines: string[] = []
  const stats = computeCoverage()

  lines.push('# CSS Utility Coverage Comparison')
  lines.push('')
  lines.push(
    '_Tamagui flat-styles vs Tailwind CSS v4 vs NativeWind v5 vs Uniwind. ' +
      'Support is judged by whether a **named style prop / utility** does the right thing, ' +
      'not whether a raw value can be smuggled through `style={{}}`._'
  )
  lines.push('')
  lines.push('**Legend:** ✅ Full (works web + native) | ⚠️ Partial (works but with real caveats) | 🌐 Web-only | ❌ None')
  lines.push('')

  // ── summary table ──
  lines.push('## Summary')
  lines.push('')
  lines.push(
    'Coverage % is weighted: Full = 1.0, Partial = 0.5, Web-only = 0.5, None = 0. ' +
      'It rewards breadth; for the cross-platform story read the **Full** column (web + native) below.'
  )
  lines.push('')
  lines.push('| Framework | Full (web+native) | Partial | Web-only | None | Total | Coverage % |')
  lines.push('|-----------|-------------------|---------|----------|------|-------|------------|')
  for (const fw of frameworks) {
    const s = stats[fw]
    lines.push(
      `| **${frameworkLabel[fw]}** | ${s.full} | ${s.partial} | ${s.webOnly} | ${s.none} | ${s.total} | ${coveragePct(s).toFixed(1)}% |`
    )
  }
  lines.push('')

  // ── cross-platform advantage ──
  lines.push('## Cross-platform coverage (web + native)')
  lines.push('')
  lines.push(
    'The number that matters most for a write-once-render-everywhere library is how many utilities ' +
      'work **fully on both web and native** (✅), excluding anything that is web-only (🌐). ' +
      'Tailwind is excluded here because it does not target native at all.'
  )
  lines.push('')
  const crossPlat = (['tamagui', 'nativewind', 'uniwind'] as const)
    .map((fw) => ({ fw, full: countLevel(categories, fw, 'full') }))
    .sort((a, b) => b.full - a.full)
  const total = stats.tamagui.total
  lines.push('| Framework | Fully cross-platform | of total | Share |')
  lines.push('|-----------|----------------------|----------|-------|')
  for (const { fw, full } of crossPlat) {
    const share = ((full / total) * 100).toFixed(0)
    const bar = '█'.repeat(Math.round((full / total) * 20)).padEnd(20, '░')
    lines.push(`| **${frameworkLabel[fw]}** | ${full} | ${total} | \`${bar}\` ${share}% |`)
  }
  lines.push('')
  const leader = crossPlat[0]
  const second = crossPlat[1]
  lines.push(
    `**${frameworkLabel[leader.fw]}** leads cross-platform with **${leader.full}** fully-supported ` +
      `utilities vs **${frameworkLabel[second.fw]}**'s ${second.full}. ` +
      'NativeWind closes the gap on web-leaning CSS features but marks several native paths ' +
      'experimental (transitions/animations) or web-only (space/divide, peer, structural selectors, sr-only a11y wiring).'
  )
  lines.push('')

  // ── per-category tables (with per-category coverage in the header) ──
  for (const cat of categories) {
    const headerStats = frameworks
      .map((fw) => {
        const cs = categoryStats(cat, fw)
        return `${frameworkLabel[fw]} ${coveragePct(cs).toFixed(0)}%`
      })
      .join(' · ')
    lines.push(`## ${cat.name}`)
    lines.push('')
    lines.push(`_Coverage: ${headerStats}_`)
    lines.push('')
    lines.push('| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |')
    lines.push('|---------|---------|----------|------------|---------|-------|')
    for (const util of cat.utilities) {
      // surface notes inline for any non-trivial row; mark partials explicitly
      let notes = util.notes ?? ''
      const partials = frameworks.filter((fw) => util.support[fw] === 'partial')
      if (partials.length && notes) {
        notes = `**⚠️ ${partials.map((p) => frameworkLabel[p]).join(', ')}:** ${notes}`
      }
      const row = [
        `**${util.name}**`,
        supportIcon(util.support.tamagui),
        supportIcon(util.support.tailwind),
        supportIcon(util.support.nativewind),
        supportIcon(util.support.uniwind),
        notes.replace(/\n/g, ' '),
      ]
      lines.push(`| ${row.join(' | ')} |`)
    }
    lines.push('')
  }

  // ── notable gaps ──
  lines.push('## Notable gaps')
  lines.push('')
  lines.push(
    'For each framework, the most impactful utilities it does **not** support (None or, for native, Web-only) ' +
      'that at least one competitor does. Sorted roughly by how commonly the feature is used.'
  )
  lines.push('')
  for (const fw of frameworks) {
    const gaps = collectGaps(fw)
    if (!gaps.length) continue
    lines.push(`### ${frameworkLabel[fw]}`)
    lines.push('')
    for (const g of gaps.slice(0, 10)) {
      lines.push(`- **${g.name}** (${g.category}) — ${g.reason}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// pick utilities a framework lacks (none, or web-only when a rival is full) that a rival supports better.
// ordered by category priority so the most-used buckets float to the top.
const categoryPriority = [
  'Layout',
  'Flexbox',
  'Spacing',
  'Sizing',
  'Typography',
  'Backgrounds',
  'Borders',
  'Effects',
  'Interactive States',
  'Responsive & Media',
  'Transitions & Animation',
  'Transforms',
  'Platform',
  'Design Tokens & Theming',
  'Accessibility',
  'Pseudo Elements',
  'Grid',
  'Filters',
  'SVG',
  'Tables',
  'Interactivity',
]

const levelRank: Record<SupportLevel, number> = { full: 3, partial: 2, 'web-only': 1, none: 0 }

function collectGaps(fw: Framework) {
  const others = frameworks.filter((f) => f !== fw)
  const gaps: {
    name: string
    category: string
    reason: string
    prio: number
    crossPlatformRival: boolean
  }[] = []
  for (const cat of categories) {
    for (const u of cat.utilities) {
      const mine = u.support[fw]
      // a "gap" = a rival is strictly better (higher rank), and mine is none or web-only
      if (mine === 'full' || mine === 'partial') continue
      const better = others
        .map((o) => ({ o, lvl: u.support[o] }))
        .filter((x) => levelRank[x.lvl] > levelRank[mine])
      if (!better.length) continue
      // for tailwind (web framework), web-only isn't really a gap — skip those
      if (fw === 'tailwind' && mine === 'web-only') continue
      // does any rival actually have real cross-platform (full/partial) support? that's the meaningful gap.
      const crossPlatformRival = better.some((b) => b.lvl === 'full' || b.lvl === 'partial')
      const rivals = better.map((b) => `${frameworkLabel[b.o]} ${b.lvl === 'web-only' ? '🌐' : b.lvl}`)
      const reason =
        mine === 'web-only'
          ? `web-only here; ${rivals.join(', ')}`
          : `no support; ${rivals.join(', ')}`
      const prio = categoryPriority.indexOf(cat.name)
      gaps.push({
        name: u.name,
        category: cat.name,
        reason,
        prio: prio === -1 ? 99 : prio,
        crossPlatformRival,
      })
    }
  }
  // surface gaps where a rival has genuine cross-platform support first (those are the ones that hurt),
  // then fall back to category priority.
  return gaps.sort(
    (a, b) => Number(b.crossPlatformRival) - Number(a.crossPlatformRival) || a.prio - b.prio
  )
}

// ── html ──────────────────────────────────────────────

function supportClass(level: SupportLevel): string {
  return `support-${level}`
}

function supportLabel(level: SupportLevel): string {
  switch (level) {
    case 'full':
      return 'Full'
    case 'partial':
      return 'Partial'
    case 'web-only':
      return 'Web'
    case 'none':
      return '—'
  }
}

function generateHTML(): string {
  const stats = computeCoverage()
  const frameworks = ['tamagui', 'tailwind', 'nativewind', 'uniwind'] as const
  const frameworkLabels = {
    tamagui: 'Tamagui',
    tailwind: 'Tailwind',
    nativewind: 'NativeWind v5',
    uniwind: 'Uniwind',
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CSS Utility Coverage Comparison</title>
<style>
  :root {
    --full: #22c55e;
    --partial: #f59e0b;
    --web-only: #3b82f6;
    --none: #ef4444;
    --bg: #0a0a0a;
    --surface: #141414;
    --surface-2: #1e1e1e;
    --text: #e5e5e5;
    --text-muted: #999;
    --border: #2a2a2a;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  h1 { font-size: 32px; margin-bottom: 8px; }
  .subtitle { color: var(--text-muted); margin-bottom: 40px; font-size: 15px; }
  .legend {
    display: flex; gap: 20px; margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 13px; }
  .legend-dot {
    width: 12px; height: 12px; border-radius: 3px;
  }
  .legend-dot.full { background: var(--full); }
  .legend-dot.partial { background: var(--partial); }
  .legend-dot.web-only { background: var(--web-only); }
  .legend-dot.none { background: var(--none); }

  /* summary cards */
  .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 48px; }
  .summary-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  .summary-card h3 { font-size: 18px; margin-bottom: 12px; }
  .pct { font-size: 36px; font-weight: 700; margin-bottom: 8px; }
  .pct.tamagui { color: #a78bfa; }
  .pct.tailwind { color: #38bdf8; }
  .pct.nativewind { color: #f472b6; }
  .pct.uniwind { color: #fb923c; }
  .stat-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); padding: 2px 0; }
  .bar { height: 6px; border-radius: 3px; background: var(--surface-2); margin-top: 12px; overflow: hidden; display: flex; }
  .bar-full { background: var(--full); }
  .bar-partial { background: var(--partial); }
  .bar-web { background: var(--web-only); }
  .bar-none { background: var(--none); }

  /* category sections */
  .category { margin-bottom: 40px; }
  .category h2 {
    font-size: 20px; margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th {
    text-align: left;
    padding: 8px 12px;
    background: var(--surface);
    color: var(--text-muted);
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td { padding: 8px 12px; border-bottom: 1px solid var(--border); }
  tr:hover td { background: var(--surface); }
  .util-name { font-weight: 600; }
  .util-desc { color: var(--text-muted); font-size: 12px; }

  .support-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  .support-full { background: color-mix(in srgb, var(--full) 20%, transparent); color: var(--full); }
  .support-partial { background: color-mix(in srgb, var(--partial) 20%, transparent); color: var(--partial); }
  .support-web-only { background: color-mix(in srgb, var(--web-only) 20%, transparent); color: var(--web-only); }
  .support-none { background: color-mix(in srgb, var(--none) 20%, transparent); color: var(--none); }

  .example { font-family: 'SF Mono', Monaco, monospace; font-size: 11px; color: var(--text-muted); }
  .notes { font-size: 12px; color: var(--text-muted); font-style: italic; max-width: 200px; }

  .expandable { cursor: pointer; }
  .expandable .examples-row { display: none; }
  .expandable.open .examples-row { display: table-row; }
</style>
</head>
<body>

<h1>CSS Utility Coverage Comparison</h1>
<p class="subtitle">Tamagui flat-styles vs Tailwind CSS vs NativeWind v5 vs Uniwind</p>

<div class="legend">
  <div class="legend-item"><div class="legend-dot full"></div> Full support</div>
  <div class="legend-item"><div class="legend-dot partial"></div> Partial support</div>
  <div class="legend-item"><div class="legend-dot web-only"></div> Web-only</div>
  <div class="legend-item"><div class="legend-dot none"></div> Not supported</div>
</div>

<div class="summary">
${frameworks
  .map((fw) => {
    const s = stats[fw]
    const pct = (((s.full + s.partial * 0.5 + s.webOnly * 0.5) / s.total) * 100).toFixed(1)
    const fullW = ((s.full / s.total) * 100).toFixed(1)
    const partialW = ((s.partial / s.total) * 100).toFixed(1)
    const webW = ((s.webOnly / s.total) * 100).toFixed(1)
    const noneW = ((s.none / s.total) * 100).toFixed(1)
    return `  <div class="summary-card">
    <h3>${frameworkLabels[fw]}</h3>
    <div class="pct ${fw}">${pct}%</div>
    <div class="stat-row"><span>Full</span><span>${s.full}/${s.total}</span></div>
    <div class="stat-row"><span>Partial</span><span>${s.partial}/${s.total}</span></div>
    <div class="stat-row"><span>Web-only</span><span>${s.webOnly}/${s.total}</span></div>
    <div class="stat-row"><span>None</span><span>${s.none}/${s.total}</span></div>
    <div class="bar">
      <div class="bar-full" style="width:${fullW}%"></div>
      <div class="bar-partial" style="width:${partialW}%"></div>
      <div class="bar-web" style="width:${webW}%"></div>
      <div class="bar-none" style="width:${noneW}%"></div>
    </div>
  </div>`
  })
  .join('\n')}
</div>

${categories
  .map(
    (cat) => `<div class="category">
  <h2>${cat.name}</h2>
  <table>
    <thead>
      <tr>
        <th style="width:22%">Utility</th>
        <th style="width:12%">Tamagui</th>
        <th style="width:12%">Tailwind</th>
        <th style="width:12%">NativeWind v5</th>
        <th style="width:12%">Uniwind</th>
        <th style="width:30%">Notes</th>
      </tr>
    </thead>
    <tbody>
${cat.utilities
  .map(
    (util) => `      <tr>
        <td>
          <div class="util-name">${util.name}</div>
          <div class="util-desc">${util.description}</div>
        </td>
        <td><span class="support-badge ${supportClass(util.support.tamagui)}">${supportLabel(util.support.tamagui)}</span></td>
        <td><span class="support-badge ${supportClass(util.support.tailwind)}">${supportLabel(util.support.tailwind)}</span></td>
        <td><span class="support-badge ${supportClass(util.support.nativewind)}">${supportLabel(util.support.nativewind)}</span></td>
        <td><span class="support-badge ${supportClass(util.support.uniwind)}">${supportLabel(util.support.uniwind)}</span></td>
        <td class="notes">${util.notes ?? ''}</td>
      </tr>`
  )
  .join('\n')}
    </tbody>
  </table>
</div>`
  )
  .join('\n\n')}

</body>
</html>`
}

// ── output ────────────────────────────────────────────

if (format === 'md' || format === 'all') {
  const md = generateMarkdown()
  writeFileSync(join(outDir, 'coverage.md'), md)
  console.log(`wrote ${outDir}/coverage.md`)
}

if (format === 'html' || format === 'all') {
  const html = generateHTML()
  writeFileSync(join(outDir, 'coverage.html'), html)
  console.log(`wrote ${outDir}/coverage.html`)
}

// always print summary to stdout
const stats = computeCoverage()
console.log('\n📊 Coverage Summary:\n')
for (const fw of frameworks) {
  const s = stats[fw]
  const pct = (((s.full + s.partial * 0.5 + s.webOnly * 0.5) / s.total) * 100).toFixed(1)
  const bar = '█'.repeat(Math.round(Number(pct) / 5)) + '░'.repeat(20 - Math.round(Number(pct) / 5))
  console.log(`  ${fw.padEnd(12)} ${bar} ${pct}%  (${s.full} full, ${s.partial} partial, ${s.webOnly} web-only, ${s.none} none)`)
}
console.log('')
