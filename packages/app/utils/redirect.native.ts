import * as Linking from 'expo-linking'

export const redirect = (url: string) => {
  Linking.openURL(url)
}
