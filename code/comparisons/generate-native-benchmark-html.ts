#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const SCENARIOS = ['simple', 'themed', 'rich', 'group', 'heavy', 'animated'] as const
type ScenarioId = (typeof SCENARIOS)[number]
type Result = { mount: number; rerender: number } | null
type NativeResults = Record<string, Record<ScenarioId, Result>>

const LABELS: Record<ScenarioId, string> = {
  simple: 'Simple (static props)',
  themed: 'Themed (token background)',
  rich: 'Rich (pseudo states)',
  group: 'Group hover',
  heavy: 'Heavy page (60)',
  animated: 'Animated (spring)',
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function render(results: NativeResults) {
  const frameworks = Object.keys(results)
  const cell = (
    framework: string,
    scenario: ScenarioId,
    metric: 'mount' | 'rerender'
  ) => {
    const result = results[framework][scenario]
    return result
      ? `<span class="value">${result[metric].toFixed(1)}</span>`
      : '<span class="missing">not measured</span>'
  }
  const rows = (metric: 'mount' | 'rerender') =>
    SCENARIOS.map(
      (scenario) =>
        `<tr><td>${escapeHtml(LABELS[scenario])}</td>${frameworks.map((framework) => `<td>${cell(framework, scenario, metric)}</td>`).join('')}</tr>`
    ).join('\n')
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Native Benchmark Comparison (iOS)</title>
<style>
  body { font-family: system-ui; background: #0a0a0a; color: #eee; padding: 40px; max-width: 1100px; margin: 0 auto; }
  h1 { font-size: 24px; margin-bottom: 4px; }
  .sub, .missing { color: #888; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 12px; text-align: right; border-bottom: 1px solid #222; }
  th:first-child, td:first-child { text-align: left; }
  th { background: #141414; color: #aaa; font-size: 11px; text-transform: uppercase; }
  .section td { font-weight: 600; background: #1a1a1a; border-top: 2px solid #333; }
  .value { font-weight: 600; font-family: monospace; }
</style>
</head>
<body>
<h1>Native Benchmark Comparison (iOS)</h1>
<p class="sub">200/60 components · generated directly from benchmarks-native.json</p>
<table>
<thead><tr><th>Scenario</th>${frameworks.map((framework) => `<th>${escapeHtml(framework)}</th>`).join('')}</tr></thead>
<tbody>
<tr class="section"><td colspan="${frameworks.length + 1}">Mount (ms)</td></tr>
${rows('mount')}
<tr class="section"><td colspan="${frameworks.length + 1}">Re-render (ms)</td></tr>
${rows('rerender')}
</tbody>
</table>
</body>
</html>`
}

export function generateNativeBenchmarkHtml(jsonPath: string, htmlPath: string) {
  const results = JSON.parse(readFileSync(jsonPath, 'utf8')) as NativeResults
  writeFileSync(htmlPath, render(results))
}

if (import.meta.main) {
  const outputDir = join(import.meta.dir, 'output')
  const jsonPath = process.argv[2] ?? join(outputDir, 'benchmarks-native.json')
  const htmlPath = process.argv[3] ?? join(outputDir, 'benchmarks-native.html')
  generateNativeBenchmarkHtml(jsonPath, htmlPath)
  console.log(`HTML: ${htmlPath}`)
}
