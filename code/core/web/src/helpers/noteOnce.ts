// process.env is a slow native lookup in Node, so production reads it once here
const isProd = process.env.NODE_ENV === 'production'
const noted = new Set<string>()

export function noteOnce(message: string): void {
  if (!isProd && process.env.NODE_ENV === 'development' && !noted.has(message)) {
    if (noted.size > 1000) noted.clear()
    noted.add(message)
    console.warn(message)
  }
}
