const global =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof global !== 'undefined'
    ? global
    : typeof window !== 'undefined'
    ? window
    : this

global.performance = {
  now: () => Date.now(),
}

global.ErrorUtils = {
  setGlobalHandler: (...args) => {
    console.log('args', args)
  },
  reportFatalError: (err) => {
    alert(err)
  },
}

globalThis['require'] = function require(_mod) {
  if (_mod === 'react') return React
  if (_mod === 'react-native') return RequireReactNative
  if (_mod === 'react/jsx-runtime') return RequireReactJSXRuntime
}

const React = (function () {
  // -- react --
})()

const RequireReactJSXRuntime = (function () {
  // -- react/jsx-runtime --
})()

// rn fix
const jsx = RequireReactJSXRuntime.jsx
global['react'] = (type, props, children) => {
  return jsx(type, { children, ...props })
}

global['React'] = React

const RequireReactNative = (function () {
  // -- react-native --
})()

// -- app --
