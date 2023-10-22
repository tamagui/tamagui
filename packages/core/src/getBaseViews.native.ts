export function getBaseViews() {
  const native = require('react-native')
  const View = require('react-native/Libraries/Components/View/ViewNativeComponent')
  const TextAncestor = require('react-native/Libraries/Text/TextAncestor')

  return {
    View,
    Text: native.Text || native.default.Text,
    TextAncestor,
    Pressable: native.Pressable || native.default.Pressable,
  }
}
