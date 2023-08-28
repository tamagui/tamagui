import { SafeAreaProvider as SafeAreaProviderOG } from 'react-native-safe-area-context'

export const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaProviderOG>{children}</SafeAreaProviderOG>
}
