import { Image, Text, TextInput, View } from 'react-native'

// limited support
export const RNComponents = new Set<any>([
  Image,
  TextInput,
  Text,
  View,
  // see fake-react-native + styled() check
  'Image',
  'TextInput',
  'Text',
  'View',
])
