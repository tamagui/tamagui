module.exports = empty()

function empty() {
  return new Proxy(
    {},
    {
      get() {
        return empty()
      },
      apply() {
        return empty()
      },
    }
  )
}
