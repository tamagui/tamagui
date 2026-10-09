// dumps tamagui's native output for every class rivals.cjs wrote to out/registry.json:
// the final style and props from getSplitStyles on a view, a text and an input, minus
// each component's own defaults, and the class walk's entries for composer parts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { defaultConfig } from '../../core/config/src/v6'
import { createTamagui } from '@tamagui/web'
import { test } from 'vitest'

import { resolveTailwindCandidate } from '../../core/tailwind/src/candidate'
import { Text, View, html } from '../../core/tailwind/src/index'
import { splitTailwindStyles, styleOf } from '../../core/tailwind/src/__tests__/utils'

const out = new URL('./out/', import.meta.url)

test('dump tamagui native coverage', () => {
  const config = createTamagui(defaultConfig as any)
  mkdirSync(out, { recursive: true })
  const registry: string[] = [
    ...JSON.parse(readFileSync(new URL('registry.json', out), 'utf8')),
    ...JSON.parse(readFileSync(new URL('../combos.json', out), 'utf8')),
  ]
  const components = [View, Text, (html as any).input]
  const baseline = new Map(
    components.map((component) => {
      const styles = splitTailwindStyles(component as any, {})
      return [component, { ...styleOf(styles), ...styles.viewProps }]
    })
  )
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
  const runtime: Record<string, Record<string, unknown>> = {}
  const entries: Record<string, [string, unknown][] | null> = {}
  const { warn, error } = console
  console.warn = console.error = () => {}
  for (const className of registry) {
    const merged: Record<string, unknown> = {}
    for (const component of components) {
      const styles = splitTailwindStyles(component as any, { className })
      const base = baseline.get(component)!
      for (const [key, value] of Object.entries(styleOf(styles))) {
        if (!same(base[key], value)) merged[key] = value
      }
      for (const [key, value] of Object.entries(styles.viewProps || {})) {
        if (key === 'className' || key === 'style' || value === undefined) continue
        if (!same(base[key], value)) merged[`prop:${key}`] = value
      }
    }
    runtime[className] = merged
    const walked: [string, unknown][] = []
    const raw = resolveTailwindCandidate(className, config, (entry) => {
      walked.push([entry[0], entry[1]])
    })
    entries[className] = raw === false ? walked : null
  }
  console.warn = warn
  console.error = error
  writeFileSync(new URL('tamagui-runtime.json', out), JSON.stringify(runtime))
  writeFileSync(new URL('tamagui-native.json', out), JSON.stringify(entries))
}, 600_000)
