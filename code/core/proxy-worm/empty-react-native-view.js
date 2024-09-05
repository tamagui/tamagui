const View = require('react-native').View
module.exports = new Proxy(
  {
    get default() {
      return View
    },
  },
  {
    get(_, key) {
      if (key === 'createAnimatedComponent') {
        return (x) => x
      }
      return View
    },
  }
)
