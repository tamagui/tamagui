// process.env is a slow native lookup in Node, so production reads it once here
const isProd = process.env.NODE_ENV === 'production'
// for verbose logging outside node/cli

export const isDevTools = (() => {
  if (!isProd && process.env.NODE_ENV === 'development') {
    try {
      return new Function('try {return this===window;}catch(e){ return false;}')()
    } catch {
      //
    }
  }
  return false
})()
