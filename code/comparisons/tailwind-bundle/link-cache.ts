import { symlinkSync, existsSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

// use the retained campaign inputs, including its locally packed v3 tip.
const cache = resolve(process.argv[2] || '')
if (!process.argv[2])
  throw new Error('usage: bun link-cache.ts <prior-comparison-checkout>')
const root = import.meta.dirname
for (const [target, input] of [
  ['node_modules', 'node_modules'],
  ['tamagui/node_modules', 'code/comparisons/tamagui-tailwind-bench/node_modules'],
]) {
  const source = join(cache, input)
  if (!existsSync(source)) throw new Error(`missing ${source}`)
  const destination = join(root, target)
  if (existsSync(destination)) throw new Error(`already linked: ${destination}`)
  symlinkSync(source, destination, 'dir')
}
const core = JSON.parse(
  readFileSync(join(root, 'tamagui/node_modules/@tamagui/core/package.json'), 'utf8')
)
if (core.version !== '3.0.0-tip.728da51995')
  throw new Error(`expected measured tip, got ${core.version}`)
