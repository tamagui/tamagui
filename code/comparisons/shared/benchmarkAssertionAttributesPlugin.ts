export function benchmarkAssertionAttributesPlugin(strip: boolean) {
  if (!strip) return null
  return {
    name: 'strip-benchmark-assertion-attributes',
    enforce: 'pre' as const,
    transform(source: string, id: string) {
      if (!id.endsWith('/src/index.tsx')) return
      return source.replace(/^\s*data-bench-[^\n]+\n/gm, '')
    },
  }
}
