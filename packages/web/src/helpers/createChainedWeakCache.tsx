export const createChainedWeakCache = () => {
  const baseMap = new WeakMap()

  return {
    get: (args: any[]) => {
      let cur = baseMap
      for (let arg of args) {
        if (cur.has(arg)) {
          cur = cur.get(arg)
        } else {
          return
        }
      }
      return cur
    },

    set(args: any[], result: any) {
      const len = args.length
      let cur = baseMap

      for (let i = 0; i < len; i++) {
        const arg = args[i]
        const isLast = i === len - 1

        if (isLast) {
          cur!.set(arg, result)
        } else {
          if (cur.has(arg)) {
            cur = cur.get(arg)
          } else {
            const next = new WeakMap()
            cur.set(arg, next)
            cur = next
          }
        }
      }
    },
  }
}
