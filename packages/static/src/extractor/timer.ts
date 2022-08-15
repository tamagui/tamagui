export const timer = () => {
  const start = Date.now()
  let last = start
  return {
    mark: (name: string, print = false) => {
      if (print) {
        const took = Date.now() - last
        last = Date.now()
        // eslint-disable-next-line no-console
        console.log(`Time ${name}: ${took}ms`)
        if (took > 10) {
          // eslint-disable-next-line no-console
          console.log('  long timer')
        }
      }
    },
    done: (print = false) => {
      if (print) {
        const total = Date.now() - start
        // eslint-disable-next-line no-console
        console.log(`Total time: ${total}ms`)
        if (total > 50) {
          // eslint-disable-next-line no-console
          console.log('  long timer')
        }
      }
    },
  }
}
