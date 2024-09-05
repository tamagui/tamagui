if (typeof globalThis['__DEV__'] === 'undefined') {
  globalThis['__DEV__'] = process.env.NODE_ENV === 'development'
}
