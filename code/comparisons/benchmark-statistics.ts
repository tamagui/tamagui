export interface Statistic {
  n: number
  mean: number
  standardDeviation: number
  ci95: { low: number; high: number; margin: number }
}

export function createRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const shuffled = [...values]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!]
  }
  return shuffled
}

function tCritical95(degreesOfFreedom: number) {
  const values = [
    0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201,
    2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064,
    2.06, 2.056, 2.052, 2.048, 2.045,
  ]
  return values[Math.min(degreesOfFreedom, 30)] ?? 1.96
}

export function summarize(values: readonly number[]): Statistic {
  if (values.length < 2) {
    throw new Error('at least two values are required for a sample statistic')
  }
  const mean = values.reduce((total, value) => total + value, 0) / values.length
  const variance =
    values.reduce((total, value) => total + (value - mean) ** 2, 0) / (values.length - 1)
  const standardDeviation = Math.sqrt(variance)
  const margin =
    tCritical95(values.length - 1) * (standardDeviation / Math.sqrt(values.length))
  return {
    n: values.length,
    mean,
    standardDeviation,
    ci95: { low: mean - margin, high: mean + margin, margin },
  }
}

export function median(values: readonly number[]) {
  if (values.length === 0) {
    throw new Error('at least one value is required for a median')
  }
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1]! + sorted[middle]!) / 2
    : sorted[middle]!
}
