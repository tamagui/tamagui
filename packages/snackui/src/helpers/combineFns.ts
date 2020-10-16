export const combineFns = (...fns: (Function | null | undefined)[]) => {
  const validFns = fns.filter(Boolean)
  if (validFns.length === 1) return validFns[0]
  return (...args: any[]) => {
    validFns.forEach((fn) => fn!(...args))
  }
}
