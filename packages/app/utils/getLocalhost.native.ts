import Constants from 'expo-constants'

let localhost: string | undefined

export function getLocalhost() {
  if (localhost) return localhost
  const debuggerHost = Constants.expoConfig?.hostUri
  localhost = debuggerHost?.split(':')[0]
  if (!localhost) {
    localhost = 'localhost'
  }
  return localhost
  // alternative:
  //    const hostname = NativeModules.SourceCode.scriptURL
  //   .split('://')[1] // Remove the scheme
  //   .split('/')[0] // Remove the path
  //   .split(':')[0] // Remove the port
}

// replace localhost with the hostname - this will not do anything if using a production / remote URL, as they don't contain `localhost`
export function replaceLocalhost(address: string) {
  return address.replace('://localhost:', `://${getLocalhost()}:`)
}
