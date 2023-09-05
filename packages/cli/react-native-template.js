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
global["___modules___"] = {};
// to avoid it looking like browser...
delete globalThis["window"];

const __cachedModules = {};

function __getRequire(absPath) {
  const found = ___modules___[absPath];
  if (!__cachedModules[absPath]) {
    const exported = {};
    const defaultExported = {};
    found(exported, defaultExported);
    __cachedModules[absPath] = defaultExported.exports || exported
  }
  return __cachedModules[absPath];
}

const __specialRequireMap = {
  'react-native': '_virtual/virtual_react-native.js',
  'react': '_virtual/virtual_react.js',
  'react/jsx-runtime': '_virtual/virtual_react-jsx.js',
  'react-native/Libraries/Pressability/Pressability': '__ReactPressability__',
  'react-native/Libraries/Pressability/usePressability': '__ReactUsePressability__',
}

function createRequire(importsMap) {
  return function require(_mod) {
    try {
      const cached = __cachedModules[__specialRequireMap[_mod]]
      if (cached) return cached
      const found = __specialRequireMap[_mod]
      if (___modules___[found]) {
        return __getRequire(found)
      }
      if (found && globalThis[found]) {
        const output = globalThis[found]()  
        __cachedModules[_mod] = output
        return output
      }
      // handles relative imports rollup outputs
      const absPath = importsMap[_mod] || _mod;
      if (!___modules___[absPath]) {
        throw new Error(`Not found: ${_mod} => ${absPath}`);
      }
      return __getRequire(absPath)
    } catch (err) {
      throw new Error(`Error running module ${_mod} "${err}"`);
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
    // rome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("err" + err["message"] + err["stack"]);
  },
};
