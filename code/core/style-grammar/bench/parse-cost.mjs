import {
  createModifierRegistry,
  evaluateProgram,
  parseValue,
  splitBackgroundValue,
} from '../src/index.ts'

const inputs = {
  plain: 'red',
  twoClause: 'red hover:green dark:hover:blue',
  gradient: 'linear-gradient(135deg, rgba(255, 0, 0, 0.5), blue)',
  sixClause:
    'red press:orange focus:yellow disabled:gray lg:purple light:white dark:press:blue',
  background: 'url(x.png) surface hover:surface-hover',
}

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'lg'],
  themeNames: { light: {}, dark: {} },
})

function parsed(input) {
  const result = parseValue(input, registry)
  if (!result.ok) {
    throw new Error(`benchmark input failed to parse: ${JSON.stringify(result.errors)}`)
  }
  return result.value
}

const twoClauseValue = parsed(inputs.twoClause)
const sixClauseValue = parsed(inputs.sixClause)
const active = {
  states: new Set(['hover']),
  themes: new Set(['dark', 'dark_blue']),
  media: new Set(['sm']),
  platform: 'ios',
  groups: () => false,
}
const colorTokens = new Set(['surface', 'surface-hover'])

const cacheProperties = ['backgroundColor', 'paddingTop']
const cacheInputs = [inputs.twoClause, inputs.sixClause]
const cache = new Map([
  [
    cacheProperties[0] + '\0' + cacheInputs[0],
    { property: cacheProperties[0], value: twoClauseValue },
  ],
  [
    cacheProperties[1] + '\0' + cacheInputs[1],
    { property: cacheProperties[1], value: sixClauseValue },
  ],
])

let sink

function timeLoop(iterations, operation) {
  const start = performance.now()
  let value
  for (let index = 0; index < iterations; index++) {
    value = operation(index)
  }
  sink = value
  return performance.now() - start
}

function benchmark(name, operation) {
  timeLoop(50_000, operation)

  const targetMs = 250
  let iterations = 10_000
  let elapsed = timeLoop(iterations, operation)
  while (elapsed < targetMs) {
    const scale = Math.max(2, Math.ceil(targetMs / Math.max(elapsed, 0.01)))
    iterations = Math.min(iterations * scale, 50_000_000)
    elapsed = timeLoop(iterations, operation)
    if (iterations === 50_000_000) break
  }

  const samples = [
    elapsed,
    timeLoop(iterations, operation),
    timeLoop(iterations, operation),
  ].sort((a, b) => a - b)
  const medianMs = samples[1]
  const nanoseconds = (medianMs * 1_000_000) / iterations
  const operationsPerSecond = 1_000_000_000 / nanoseconds

  console.log(
    `${name.padEnd(34)} ${Math.round(operationsPerSecond)
      .toLocaleString('en-US')
      .padStart(14)} ops/sec  ${nanoseconds.toFixed(1).padStart(9)} ns/op`
  )
}

console.log(`Bun ${Bun.version} ${process.platform}/${process.arch}`)
console.log('')

benchmark('parse: plain', () => parseValue(inputs.plain, registry))
benchmark('parse: two clauses', () => parseValue(inputs.twoClause, registry))
benchmark('parse: gradient', () => parseValue(inputs.gradient, registry))
benchmark('parse: six clauses', () => parseValue(inputs.sixClause, registry))
benchmark('evaluate: two clauses', () =>
  evaluateProgram(twoClauseValue, registry, active)
)
benchmark('evaluate: six clauses', () =>
  evaluateProgram(sixClauseValue, registry, active)
)
benchmark('cold: parse + split bg', () => {
  const result = parseValue(inputs.background, registry)
  return result.ok ? splitBackgroundValue(result.value, colorTokens) : result
})
benchmark('cache: key build + Map.get', (index) => {
  const item = index & 1
  const key = cacheProperties[item] + '\0' + cacheInputs[item]
  return cache.get(key)
})

if (sink === undefined) {
  throw new Error('benchmark operations did not produce a value')
}
