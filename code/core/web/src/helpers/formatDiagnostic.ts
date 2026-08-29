const maxDiagnosticValueLength = 160

function formatDiagnosticValue(
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>()
): string {
  if (typeof value === 'string') {
    const output =
      value.length > maxDiagnosticValueLength
        ? `${value.slice(0, maxDiagnosticValueLength - 1)}…`
        : value
    return JSON.stringify(output)
  }
  if (value == null || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`
  if (typeof value !== 'object') return String(value)
  if (seen.has(value)) return '[Circular]'
  if (depth === 2) return Array.isArray(value) ? '[Array]' : '[Object]'

  seen.add(value)
  if (Array.isArray(value)) {
    const items = value
      .slice(0, 5)
      .map((item) => formatDiagnosticValue(item, depth + 1, seen))
    if (value.length > 5) items.push(`… ${value.length - 5} more`)
    return `[${items.join(', ')}]`
  }

  const keys: string[] = []
  for (const key in value) {
    keys.push(key)
    if (keys.length === 6) break
  }
  const hasMore = keys.length === 6
  if (hasMore) keys.pop()
  const items = keys.map((key) => {
    try {
      return `${key}: ${formatDiagnosticValue((value as Record<string, unknown>)[key], depth + 1, seen)}`
    } catch {
      return `${key}: [Unavailable]`
    }
  })
  if (hasMore) items.push('… more')
  return `{ ${items.join(', ')} }`
}

export function formatDiagnostic(
  code: string,
  component: string,
  message: string,
  action: string,
  prop?: string,
  received?: unknown
) {
  if (process.env.NODE_ENV === 'production') {
    return `${code}: ${message}`
  }
  const formattedValue = prop ? formatDiagnosticValue(received) : ''
  const boundedValue =
    formattedValue.length > maxDiagnosticValueLength
      ? `${formattedValue.slice(0, maxDiagnosticValueLength - 1)}…`
      : formattedValue
  const value = prop ? ` Received ${prop}=${boundedValue}.` : ''
  return `${code} ${component}: ${message}.${value} ${action}`
}
