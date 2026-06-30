/**
 * shared benchmark harness used by all framework bench apps.
 *
 * each app imports this and calls runBenchmark() which:
 * 1. mounts N components, measures time
 * 2. re-renders with new props, measures time
 * 3. writes results to DOM elements with standardized IDs
 *
 * playwright tests read results via the same IDs across all apps.
 */

export const ITEM_COUNT = 500

export interface BenchResult {
  mount: number
  rerender: number
}

export interface BenchScenario {
  id: string
  name: string
}

export const scenarios: BenchScenario[] = [
  { id: 'simple', name: '1. Simple (basic layout props)' },
  { id: 'rich', name: '2. Rich (pseudo states + dynamic)' },
  { id: 'animated', name: '3. Animated (transitions)' },
]

/**
 * renders a results table to a container element.
 * uses plain DOM so it works without any framework.
 */
export function renderResults(
  container: HTMLElement,
  framework: string,
  results: Record<string, BenchResult>
) {
  container.id = 'bench-results-table'
  container.innerHTML = ''
  container.style.cssText =
    'padding:16px;background:#111;border-radius:12px;border:1px solid #333;color:#eee;font-family:monospace;'

  const h2 = document.createElement('h2')
  h2.textContent = `${framework} — ${ITEM_COUNT} components`
  h2.style.cssText = 'margin:0 0 16px;font-size:18px;'
  container.appendChild(h2)

  for (const scenario of scenarios) {
    const r = results[scenario.id]
    if (!r) continue

    const row = document.createElement('div')
    row.style.cssText = 'margin-bottom:12px;'

    const label = document.createElement('div')
    label.textContent = scenario.name
    label.style.cssText = 'font-size:13px;font-weight:600;margin-bottom:4px;'
    row.appendChild(label)

    const mountEl = document.createElement('div')
    mountEl.id = `bench-result-${scenario.id}-mount`
    mountEl.dataset.value = r.mount.toFixed(2)
    mountEl.textContent = `mount: ${r.mount.toFixed(2)}ms`
    mountEl.style.cssText = 'font-size:14px;'
    row.appendChild(mountEl)

    const rerenderEl = document.createElement('div')
    rerenderEl.id = `bench-result-${scenario.id}-rerender`
    rerenderEl.dataset.value = r.rerender.toFixed(2)
    rerenderEl.textContent = `re-render: ${r.rerender.toFixed(2)}ms`
    rerenderEl.style.cssText = 'font-size:14px;'
    row.appendChild(rerenderEl)

    container.appendChild(row)
  }
}
