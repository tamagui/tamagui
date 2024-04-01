import { isServer } from '@tamagui/constants'

if (isServer) {
  module.exports = require('./fake-react')
} else {
  module.exports = require('./real-react')
}
