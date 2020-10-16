import { useEffect, useState } from 'react'

// maybe just remove and use useAsyncFn?

export function usePromise<A extends () => Promise<any>>(
  fn: A,
  mountArgs: any[] = []
): ReturnType<A> extends Promise<infer U> ? U : A {
  const [val, setVal] = useState(null)
  useEffect(() => {
    let cancelled = false
    fn().then((res) => {
      if (!cancelled) {
        setVal(res)
      }
    })
    return () => {
      cancelled = true
    }
  }, mountArgs)
  return val as any
}
