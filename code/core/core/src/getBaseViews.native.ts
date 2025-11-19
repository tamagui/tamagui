export function getBaseViews() {
  const native = require('react-native')

  return {
    View: native.View || native.default?.View,
    Text: native.Text || native.default?.Text,
    TextAncestor: native.unstable_TextAncestorContext,
    StyleSheet: native.StyleSheet || native.default?.StyleSheet,
    Pressable: native.Pressable || native.default?.Pressable,
  }
}
