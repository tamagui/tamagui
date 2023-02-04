let hasWarned

export function warnOnce(key: string, warning: string) {
  if (process.env.NODE_ENV === 'development') {
    hasWarned ??= {}
    if (!hasWarned[key]) {
      hasWarned[key] = true
      console.warn(warning)
    }
  }
}
