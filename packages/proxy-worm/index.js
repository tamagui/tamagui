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

  obj.displayName = `ProxyWorm - Check excludeReactNativeWebExports`
  obj._isProxyWorm = true

  return new Proxy(obj, {
    get(_, key) {
      if (Reflect.has(obj, key)) return Reflect.get(obj, key)
      return worm()
    },
    apply() {
      return worm()
    },
  })
}
