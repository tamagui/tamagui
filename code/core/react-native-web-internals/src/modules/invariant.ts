export function invariant(condition: any, log: string, ...logVars: string[]) {
  if (!condition) {
    throw new Error(
      process.env.NODE_ENV === 'development'
        ? log
            .split('%s')
            .flatMap((chunk, i) => [chunk, logVars[i]])
            .join('')
        : log
    )
  }
}

export function warning(condition: any, log: string, ...logVars: string[]) {
  if (process.env.NODE_ENV === 'development') {
    try {
      invariant(condition, log, ...logVars)
    } catch (err) {
      console.warn(err)
      // allow to pass through
    }
  }
}
