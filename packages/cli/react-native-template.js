const global =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
    ? window
    : this

// to avoid it looking like browser...
delete globalThis['window']

const cachedModules = {}

// just used for entry, the rest use createRequire
function require(mod) {
  return ___modules___[mod]({ exports: {} })
}

function createRequire(importsMap) {
  return function require(_mod) {
    if (_mod === 'react-native') return RN
    if (_mod === 'react') return global['__React__']()
    if (_mod === 'react/jsx-runtime' || _mod === 'react/jsx-dev-runtime') {
      const mod = global['__JSX__']()
      mod.jsxDEV = mod.jsxDEV || mod.jsx
      return mod
    }
    if (_mod === 'react-native/Libraries/Pressability/Pressability') return globalThis['__ReactPressability__']()
    if (_mod === 'react-native/Libraries/Pressability/usePressability') return globalThis['__ReactUsePressability__']()

    // handles relative imports rollup outputs
    let found = ___modules___[importsMap[_mod]] || ___modules___[_mod]
    if (found) {
      if (!cachedModules[found]) {
        const exported = { exports: {} }
        found(exported)
        cachedModules[found] = exported.exports
      }
      return cachedModules[found]
    }
    
    throw new Error(`Not found: ${_mod}`)
  }
}

Object.defineProperty(globalThis, '____react____', {
  get() {
    return require('react')
  }
})

Object.defineProperty(globalThis, '____jsx____', {
  get() {
    return require('react/jsx-runtime')
  }
})

globalThis['global'] = global
global['react'] = {}
global['exports'] = {}
global['module'] = {}
global['___modules___'] = {}

globalThis['setImmediate'] = cb => cb()
//cb => Promise.resolve().then(() => cb())

// idk why
console._tmpLogs = []
;["trace", "info", "warn", "error", "log", "group", "groupCollapsed", "groupEnd", "debug"].forEach(level => {
  const og = globalThis['console'][level]
  globalThis['_ogConsole' + level] = og
  const ogConsole = og.bind(globalThis['console'])
  globalThis['console'][level] = (...data) => {
    if (console._tmpLogs) {
      console._tmpLogs.push({ level, data })
    }
    return ogConsole(...data)
  }
})

console._isPolyfilled = true

global.performance = {
  now: () => Date.now(),
}

global.ErrorUtils = {
  setGlobalHandler: () => {},
  reportFatalError: (err) => {
    console.log('err' + err['message'] + err['stack'])
  },
}
