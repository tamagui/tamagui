const noted = new Set<string>()

export function noteOnce(message: string): void {
  if (process.env.NODE_ENV === 'development' && !noted.has(message)) {
    if (noted.size > 1000) noted.clear()
    noted.add(message)
    console.warn(message)
  }
}
