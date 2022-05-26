const View = require('react-native').View
module.exports = new Proxy(
  {
    get default() {
      return View
    },
  },
  {
    get() {
      return View
    },
  }
)
