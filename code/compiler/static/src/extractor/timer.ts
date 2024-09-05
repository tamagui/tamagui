export const timer = () => {
  const start = Date.now()
  let last = start
  return {
    mark: (name: string, print = false) => {
      if (print) {
        const took = Date.now() - last
        last = Date.now()
        console.info(`Time ${name}: ${took}ms`)
        if (took > 10) {
          console.info('  long timer')
        }
      }
    },
    done: (print = false) => {
      if (print) {
        const total = Date.now() - start
        console.info(`Total time: ${total}ms`)
        if (total > 50) {
          console.info('  long timer')
        }
      }
    },
  }
}
