import { NativeToast as Toast } from './NativeToast'

function isExpoStoreClient() {
  try {
    const constantsModule = require('expo-constants')
    const Constants = constantsModule.default ?? constantsModule
    const { ExecutionEnvironment } = constantsModule

    return Constants?.executionEnvironment === ExecutionEnvironment?.StoreClient
  } catch {
    return false
  }
}

export const CustomToast = () => {
  if (isExpoStoreClient()) {
    return null
  }
  return <Toast />
}
