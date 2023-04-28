export function createProxy<A extends object>(target: A, handler: ProxyHandler<A>) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof target !== 'object' || !target) {
      // rome-ignore lint/nursery/noConsoleLog: ok
      console.warn(
        'Invalid object given for proxy:',
        target,
        `
  
  This can be due to a missing theme or configuration given to Tamagui.`,
        new Error().stack
      )
    }
  }
  return new Proxy(target || {}, handler)
}
