process.on('message', (path) => {
  if (typeof path !== 'string') {
    throw new Error(`Not a string: ${path}`)
  }
  try {
    const out = require(path)
    process.send?.(JSON.stringify(out))
  } catch (err) {
    if (err instanceof Error) {
      process.send?.(`-${err.message}\n${err.stack}`)
    } else {
      process.send?.(`-${err}`)
    }
  }
})

setInterval(() => {}, 1000)
