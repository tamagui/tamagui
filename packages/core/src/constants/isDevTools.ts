// for verbose logging outside node/cli

export const isDevTools =
  process.env.NODE_ENV === 'development'
    ? new Function('try {return this===window;}catch(e){ return false;}')()
    : false
