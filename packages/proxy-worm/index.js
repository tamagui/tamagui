module.exports = worm(true)

function worm(root = false) {
  const obj = root
    ? {
        get default() {
          return worm()
        },
      }
    : function () {
        return worm()
      }

  return new Proxy(obj, {
    get() {
      return worm()
    },
    apply() {
      return worm()
    },
  })
}
