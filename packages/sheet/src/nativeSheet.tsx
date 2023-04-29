const nativeSheets = {
  ios: null,
}

export function getNativeSheet(platform: 'ios') {
  return nativeSheets[platform]
}

export function setupNativeSheet(platform: 'ios', next: any) {
  nativeSheets[platform] = next
}
