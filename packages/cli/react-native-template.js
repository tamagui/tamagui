const global =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : this;

globalThis["global"] = global;
global["react"] = {};
global["exports"] = {};
global["module"] = {};
global["__DEV__"] = true;
global["___modules___"] = {};
// to avoid it looking like browser...
delete globalThis["window"];

globalThis['__cachedModules'] = {};

function __getRequire(absPath) {
  if (!__cachedModules[absPath]) {
    const runModule = ___modules___[absPath];
    if (runModule) {
      const mod = { exports: {} };
      runModule(mod.exports, mod);
      __cachedModules[absPath] = mod.exports || mod
    }
  }
  return __cachedModules[absPath];
}

const __specialRequireMap = {
  'react-native': '_virtual/virtual_react-native.js',
  'react': '_virtual/virtual_react.js',
  'react/jsx-runtime': '_virtual/virtual_react-jsx.js',
  'react/jsx-dev-runtime': '_virtual/virtual_react-jsx.js',
}

function createRequire(importsMap) {
  return function require(_mod) {
    try {
      const path = __specialRequireMap[_mod] || importsMap[_mod] || _mod
      const found = __getRequire(path)
      if (found) {
        return found
      }
      if (globalThis[path]) {
        const output = globalThis[path]()  
        __cachedModules[_mod] = output
        return output
      }

      // find our import.meta.glob which don't get the nice path addition, for now hardcode but this shouldnt be hard to fix properly:
      const foundGlob = __getRequire(
        path
          .replace('../app', 'apps/tamastack/app')
          .replace('.tsx', '.js')
          .replace('.ts', '.js')
      )
      if (foundGlob) {
        return foundGlob
      }
      
      console.error(`Not found: ${_mod}`);
      return {}
    } catch (err) {
      throw new Error(`\n◆ ${_mod} "${err}"`.replace('Error: ', '').replaceAll('"', ''));
    }
  };
}

globalThis["setImmediate"] = (cb) => cb();
//cb => Promise.resolve().then(() => cb())

// idk why
console._tmpLogs = [];
["trace", "info", "warn", "error", "log", "group", "groupCollapsed", "groupEnd", "debug"].forEach(
  (level) => {
    const og = globalThis["console"][level];
    globalThis["_ogConsole" + level] = og;
    const ogConsole = og.bind(globalThis["console"]);
    globalThis["console"][level] = (...data) => {
      if (console._tmpLogs) {
        console._tmpLogs.push({ level, data });
      }
      return ogConsole(...data);
    };
  },
);

console._isPolyfilled = true;

global.performance = {
  now: () => Date.now(),
};

global.ErrorUtils = {
  setGlobalHandler: () => {},
  reportFatalError: (err) => {
    console.info("err" + err["message"] + err["stack"]);
  },
};
