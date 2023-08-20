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

const __cachedModules = {}

function __specialRequire(_mod) {
  if (_mod === 'react-native/Libraries/Pressability/Pressability')
    return globalThis['__ReactPressability__']()
  if (_mod === 'react-native/Libraries/Pressability/usePressability')
    return globalThis['__ReactUsePressability__']()
  if (___modules___[_mod]) {
    return ___modules___[_mod]({ exports: {} })
  }
}

function createRequire(importsMap) {  
  return function require(_mod) {    
    const special = __specialRequire(_mod)
    if (special) return special
    
    // handles relative imports rollup outputs
    const absPath = importsMap[_mod] || _mod
    let found = ___modules___[absPath]

    console.log('requireinsdsad' + absPath)

    if (!found) {
      throw new Error(`Not found: ${_mod} ${absPath}`)
    }
    
    try {
      if (!__cachedModules[absPath]) {
        const exported = {}
        found(exported)
        __cachedModules[absPath] = exported
      }

      return __cachedModules[absPath]
    } catch(err) {
      throw new Error(`Error running module ${_mod} ${absPath} ${err}`)
    }
  }
}

Object.defineProperty(globalThis, '____react____', {
  get() {
    return __specialRequire('react')
  }
})

Object.defineProperty(globalThis, '____jsx____', {
  get() {
    return __specialRequire('react/jsx-runtime')
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
