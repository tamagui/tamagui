export function getBaseViews() {
  const native = require('react-native')

  return {
    View: native.View || native.default.View,
    Text: native.Text || native.default.Text,
    Pressable: native.Pressable || native.default.Pressable,
  }
}
