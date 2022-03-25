module.exports = empty()

function empty() {
  return new Proxy(
    {
      get default() {
        return empty()
      },
    },
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
