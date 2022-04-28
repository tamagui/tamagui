export const timer = () => {
  const start = Date.now()
  let last = start
  return {
    mark: (name: string, print = false) => {
      if (print) {
        const took = Date.now() - last
        last = Date.now()
        console.log(`Time ${name}: ${took}ms`)
      }
    },
    done: (print = false) => {
      if (print) {
        console.log(`Total time: ${Date.now() - start}ms`)
      }
    },
  }
}
