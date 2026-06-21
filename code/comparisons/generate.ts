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

// weighted coverage %: full=1, web-only=1 (it works on its target platform),
// partial=0.5 (incomplete native support is the caveat). cross-platform delta
// is what the "Full" column already shows separately.
function coveragePct(s: { full: number; partial: number; webOnly: number; total: number }) {
  return ((s.full + s.partial * 0.5 + s.webOnly) / s.total) * 100
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
    'Coverage % is weighted: Full = 1.0, Web-only = 1.0 (works on its target platform), Partial = 0.5, None = 0. ' +
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
  const frameworks = ['tamagui', 'tailwind', 'nativewind', 'uniwind'] as const
  const frameworkLabels = {
    tamagui: 'Tamagui',
    tailwind: 'Tailwind',
    nativewind: 'NativeWind v5',
    uniwind: 'Uniwind',
  }

  // serialize the data so the page can recompute coverage per view client-side
  const dataJson = JSON.stringify(
    categories.map((c) => ({
      name: c.name,
      utilities: c.utilities.map((u) => ({
        name: u.name,
        description: u.description,
        notes: u.notes ?? '',
        support: u.support,
      })),
    }))
  )

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
    --accent: #a78bfa;
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
  .subtitle { color: var(--text-muted); margin-bottom: 24px; font-size: 15px; }

  /* view filter */
  .view-bar {
    display: flex; flex-wrap: wrap;
    gap: 8px; align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
  }
  .view-bar-label {
    font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
    color: var(--text-muted); margin-right: 8px;
  }
  .view-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
  }
  .view-btn:hover { border-color: var(--accent); }
  .view-btn.active {
    background: color-mix(in srgb, var(--accent) 20%, transparent);
    border-color: var(--accent);
    color: #fff;
  }
  .view-explain {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 28px;
    padding: 0 4px;
  }

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
  .category.empty { display: none; }
  .category h2 {
    font-size: 20px; margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: baseline; gap: 12px;
  }
  .category h2 .count {
    font-size: 12px; color: var(--text-muted); font-weight: 400;
    letter-spacing: 0.5px; text-transform: uppercase;
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
  tr.row-hidden { display: none; }
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
</style>
</head>
<body>

<h1>CSS Utility Coverage Comparison</h1>
<p class="subtitle">Tamagui flat-styles vs Tailwind CSS vs NativeWind v5 vs Uniwind</p>

<div class="view-bar">
  <span class="view-bar-label">Platform view</span>
  <button class="view-btn" data-view="cross">Cross-platform (web + native)</button>
  <button class="view-btn" data-view="strict">Strict (no native caveats)</button>
  <button class="view-btn" data-view="web-only">Web-only</button>
  <button class="view-btn" data-view="all">All</button>
</div>
<div class="view-explain" id="viewExplain"></div>

<div class="legend">
  <div class="legend-item"><div class="legend-dot full"></div> Full support (web + native)</div>
  <div class="legend-item"><div class="legend-dot partial"></div> Partial (cross-platform with caveats)</div>
  <div class="legend-item"><div class="legend-dot web-only"></div> Web-only</div>
  <div class="legend-item"><div class="legend-dot none"></div> Not supported</div>
</div>

<div class="summary" id="summary"></div>

<div id="categories">
${categories
  .map(
    (cat, ci) => `<div class="category" data-cat-idx="${ci}">
  <h2>${cat.name} <span class="count" data-count></span></h2>
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
  .map((util, ui) => {
    const tagsAttr = JSON.stringify({
      t: util.support.tamagui,
      tw: util.support.tailwind,
      n: util.support.nativewind,
      u: util.support.uniwind,
    })
    return `      <tr data-util-idx="${ui}" data-support='${tagsAttr}'>
        <td>
          <div class="util-name">${util.name}</div>
          <div class="util-desc">${util.description}</div>
        </td>
        <td><span class="support-badge ${supportClass(util.support.tamagui)}">${supportLabel(util.support.tamagui)}</span></td>
        <td><span class="support-badge ${supportClass(util.support.tailwind)}">${supportLabel(util.support.tailwind)}</span></td>
        <td><span class="support-badge ${supportClass(util.support.nativewind)}">${supportLabel(util.support.nativewind)}</span></td>
        <td><span class="support-badge ${supportClass(util.support.uniwind)}">${supportLabel(util.support.uniwind)}</span></td>
        <td class="notes">${(util.notes ?? '').replace(/'/g, "&#39;")}</td>
      </tr>`
  })
  .join('\n')}
    </tbody>
  </table>
</div>`
  )
  .join('\n\n')}
</div>

<script>
const FRAMEWORKS = ${JSON.stringify(frameworks)};
const FW_LABELS = ${JSON.stringify(frameworkLabels)};
const DATA = ${dataJson};

const VIEW_EXPLAIN = {
  cross: "Only utilities where at least one cross-platform framework reaches <b>Full or Partial</b> support — meaning the utility runs on both web and native, with or without caveats. Coverage % = (Full + Partial × 0.5) / total. This is the number that matters for a write-once-run-everywhere library.",
  strict: "Only utilities where at least one cross-platform framework reaches <b>Full</b> support — no native caveats. Coverage % = Full / total. The strictest read: how many CSS utilities work identically on web and native.",
  'web-only': "Only utilities that no cross-platform framework supports on native (they exist on web only). Useful for seeing which CSS features simply don't translate to React Native and which framework still ships a web shim for them.",
  all: "Every utility tracked. Coverage % = (Full + Web-only + Partial × 0.5) / total. Web-only is full credit because it works on its target platform — cross-platform delta is what the <b>Cross-platform</b> view above measures.",
};

// determine if a utility row belongs to the current view
function rowMatchesView(s, view) {
  const cross = [s.t, s.n, s.u]; // cross-platform contenders
  const all = [s.t, s.tw, s.n, s.u];
  if (view === 'cross') {
    return cross.some(l => l === 'full' || l === 'partial');
  }
  if (view === 'strict') {
    return cross.some(l => l === 'full');
  }
  if (view === 'web-only') {
    const someoneWebOnly = all.some(l => l === 'web-only');
    const nooneNative = cross.every(l => l !== 'full' && l !== 'partial');
    return someoneWebOnly && nooneNative;
  }
  return true; // 'all'
}

// per-framework coverage % for the current view
function computeView(view) {
  const out = {};
  for (const fw of FRAMEWORKS) out[fw] = { full:0, partial:0, webOnly:0, none:0, total:0 };
  for (const cat of DATA) {
    for (const u of cat.utilities) {
      const s = { t: u.support.tamagui, tw: u.support.tailwind, n: u.support.nativewind, u: u.support.uniwind };
      if (!rowMatchesView(s, view)) continue;
      for (const fw of FRAMEWORKS) {
        const lvl = u.support[fw];
        out[fw].total++;
        if (lvl === 'full') out[fw].full++;
        else if (lvl === 'partial') out[fw].partial++;
        else if (lvl === 'web-only') out[fw].webOnly++;
        else out[fw].none++;
      }
    }
  }
  return out;
}

function pctForView(view, s) {
  if (!s.total) return 0;
  if (view === 'strict') {
    return (s.full / s.total) * 100;
  }
  if (view === 'cross') {
    return ((s.full + s.partial * 0.5) / s.total) * 100;
  }
  if (view === 'web-only') {
    return ((s.full + s.webOnly + s.partial * 0.5) / s.total) * 100;
  }
  return ((s.full + s.partial * 0.5 + s.webOnly) / s.total) * 100;
}

function renderSummary(view) {
  const stats = computeView(view);
  const wrap = document.getElementById('summary');
  wrap.innerHTML = '';
  for (const fw of FRAMEWORKS) {
    const s = stats[fw];
    const pct = pctForView(view, s).toFixed(1);
    const t = s.total || 1;
    const fullW = ((s.full / t) * 100).toFixed(1);
    const partialW = ((s.partial / t) * 100).toFixed(1);
    const webW = ((s.webOnly / t) * 100).toFixed(1);
    const div = document.createElement('div');
    div.className = 'summary-card';
    div.innerHTML = \`
      <h3>\${FW_LABELS[fw]}</h3>
      <div class="pct \${fw}">\${pct}%</div>
      <div class="stat-row"><span>Full (web+native)</span><span>\${s.full}/\${s.total}</span></div>
      <div class="stat-row"><span>Partial</span><span>\${s.partial}/\${s.total}</span></div>
      <div class="stat-row"><span>Web-only</span><span>\${s.webOnly}/\${s.total}</span></div>
      <div class="stat-row"><span>None</span><span>\${s.none}/\${s.total}</span></div>
      <div class="bar">
        <div class="bar-full" style="width:\${fullW}%"></div>
        <div class="bar-partial" style="width:\${partialW}%"></div>
        <div class="bar-web" style="width:\${webW}%"></div>
      </div>
    \`;
    wrap.appendChild(div);
  }
}

function applyRowFilter(view) {
  const cats = document.querySelectorAll('.category');
  cats.forEach((catEl) => {
    let shown = 0;
    catEl.querySelectorAll('tbody tr').forEach((tr) => {
      const s = JSON.parse(tr.getAttribute('data-support'));
      const match = rowMatchesView(s, view);
      tr.classList.toggle('row-hidden', !match);
      if (match) shown++;
    });
    catEl.classList.toggle('empty', shown === 0);
    const countEl = catEl.querySelector('[data-count]');
    if (countEl) countEl.textContent = \`\${shown} utilities\`;
  });
}

function setView(view) {
  document.querySelectorAll('.view-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-view') === view);
  });
  document.getElementById('viewExplain').innerHTML = VIEW_EXPLAIN[view] || '';
  renderSummary(view);
  applyRowFilter(view);
  try {
    history.replaceState(null, '', '?view=' + view);
  } catch (e) {}
  try { localStorage.setItem('coverageView', view); } catch (e) {}
}

document.querySelectorAll('.view-btn').forEach((b) => {
  b.addEventListener('click', () => setView(b.getAttribute('data-view')));
});

const urlView = new URLSearchParams(location.search).get('view');
const storedView = (() => { try { return localStorage.getItem('coverageView'); } catch (e) { return null; } })();
const initialView = urlView || storedView || 'cross';
setView(['cross','strict','web-only','all'].includes(initialView) ? initialView : 'cross');
</script>

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
  const pct = (((s.full + s.partial * 0.5 + s.webOnly) / s.total) * 100).toFixed(1)
  const bar = '█'.repeat(Math.round(Number(pct) / 5)) + '░'.repeat(20 - Math.round(Number(pct) / 5))
  console.log(`  ${fw.padEnd(12)} ${bar} ${pct}%  (${s.full} full, ${s.partial} partial, ${s.webOnly} web-only, ${s.none} none)`)
}
console.log('')
