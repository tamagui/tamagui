export function getBaseViews() {
  const native = require('react-native')
  const View =
    require('react-native/Libraries/Components/View/ViewNativeComponent').default
  const TextAncestor = require('react-native/Libraries/Text/TextAncestor')

  return {
    View,
    Text: native.Text || native.default.Text,
    StyleSheet: native.StyleSheet || native.default.StyleSheet,
    TextAncestor,
    Pressable: native.Pressable || native.default.Pressable,
  }
}
