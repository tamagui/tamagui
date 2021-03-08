/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../../../packages/async/src/cancellablePromise.ts":
/*!***************************************************************!*\
  !*** ../../../../../packages/async/src/cancellablePromise.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.cancelPromise = exports.createCancellablePromise = exports.CancellablePromise = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const cancelsMap = new WeakMap();

const emptyFn = () => {};

class CancellablePromise extends Promise {
  constructor(executor) {
    super(executor);

    _defineProperty(this, "cancel", emptyFn);
  }

}

exports.CancellablePromise = CancellablePromise;

const createCancellablePromise = cb => {
  let canceller = null;
  const promise = new Promise((res, rej) => {
    cb(res, rej, onCancel => {
      canceller = onCancel;
    });
  });
  promise['cancel'] = canceller;
  cancelsMap.set(promise, canceller);
  return promise;
};

exports.createCancellablePromise = createCancellablePromise;

const cancelPromise = promise => {
  var _cancelsMap$get;

  if (!promise) return;

  if ('cancel' in promise) {
    var _promise$cancel;

    (_promise$cancel = promise.cancel) === null || _promise$cancel === void 0 ? void 0 : _promise$cancel.call(promise);
  }

  (_cancelsMap$get = cancelsMap.get(promise)) === null || _cancelsMap$get === void 0 ? void 0 : _cancelsMap$get();
};

exports.cancelPromise = cancelPromise;

/***/ }),

/***/ "../../../../../packages/async/src/fullyIdle.ts":
/*!******************************************************!*\
  !*** ../../../../../packages/async/src/fullyIdle.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.fullyIdle = fullyIdle;

var _requestIdle = __webpack_require__(/*! ./requestIdle */ "../../../../../packages/async/src/requestIdle.ts");

var _sleep = __webpack_require__(/*! ./sleep */ "../../../../../packages/async/src/sleep.ts");

async function fullyIdle({
  min = 1,
  max = 500
} = {}) {
  return await Promise.all([(0, _sleep.sleep)(min), Promise.race([(0, _sleep.sleep)(max), (0, _requestIdle.requestIdle)()])]);
}

/***/ }),

/***/ "../../../../../packages/async/src/idle.ts":
/*!*************************************************!*\
  !*** ../../../../../packages/async/src/idle.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.idle = void 0;

var _requestIdle = __webpack_require__(/*! ./requestIdle */ "../../../../../packages/async/src/requestIdle.ts");

var _sleep = __webpack_require__(/*! ./sleep */ "../../../../../packages/async/src/sleep.ts");

const idle = async max => {
  await Promise.race([(0, _requestIdle.requestIdle)(), (0, _sleep.sleep)(max)]);
};

exports.idle = idle;

/***/ }),

/***/ "../../../../../packages/async/src/index.ts":
/*!**************************************************!*\
  !*** ../../../../../packages/async/src/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _cancellablePromise = __webpack_require__(/*! ./cancellablePromise */ "../../../../../packages/async/src/cancellablePromise.ts");

Object.keys(_cancellablePromise).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _cancellablePromise[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cancellablePromise[key];
    }
  });
});

var _series = __webpack_require__(/*! ./series */ "../../../../../packages/async/src/series.ts");

Object.keys(_series).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _series[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _series[key];
    }
  });
});

var _sleep = __webpack_require__(/*! ./sleep */ "../../../../../packages/async/src/sleep.ts");

Object.keys(_sleep).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _sleep[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sleep[key];
    }
  });
});

var _requestIdle = __webpack_require__(/*! ./requestIdle */ "../../../../../packages/async/src/requestIdle.ts");

Object.keys(_requestIdle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _requestIdle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _requestIdle[key];
    }
  });
});

var _fullyIdle = __webpack_require__(/*! ./fullyIdle */ "../../../../../packages/async/src/fullyIdle.ts");

Object.keys(_fullyIdle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _fullyIdle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fullyIdle[key];
    }
  });
});

var _idle = __webpack_require__(/*! ./idle */ "../../../../../packages/async/src/idle.ts");

Object.keys(_idle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _idle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _idle[key];
    }
  });
});

/***/ }),

/***/ "../../../../../packages/async/src/requestIdle.ts":
/*!********************************************************!*\
  !*** ../../../../../packages/async/src/requestIdle.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.requestIdle = void 0;

var _cancellablePromise = __webpack_require__(/*! ./cancellablePromise */ "../../../../../packages/async/src/cancellablePromise.ts");

const requestIdle = () => {
  return (0, _cancellablePromise.createCancellablePromise)((res, _rej, onCancel) => {
    // @ts-ignore
    let tm = requestIdleCallback(res);
    onCancel(() => {
      clearTimeout(tm);
    });
  });
};

exports.requestIdle = requestIdle;

/***/ }),

/***/ "../../../../../packages/async/src/series.ts":
/*!***************************************************!*\
  !*** ../../../../../packages/async/src/series.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.series = series;

var _cancellablePromise = __webpack_require__(/*! ./cancellablePromise */ "../../../../../packages/async/src/cancellablePromise.ts");

var _sleep = __webpack_require__(/*! ./sleep */ "../../../../../packages/async/src/sleep.ts");

// type AsyncFlowFn<A = any, B = any> = ((arg?: A extends Promise<infer X> ? X : A) => B)
// type AsyncFlowReturn = {
//   (): void;
//   value(): any;
// }
// prettier-ignore
// type AsyncFlow<A, B, C, D, E, F, G, H> =
// | AsyncFlowFn[]
// // sanity check
// series([
//   () => Promise.resolve(1),
//   (x) => x,
//   (y) => y.charAt(0),
//   // (z) => z,
// ])
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, F>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, F>, AsyncFlowFn<F, G>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, F>, AsyncFlowFn<F, G>, AsyncFlowFn<G, H>]
// export function series<A, B>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, any>]): AsyncFlowReturn
// export function series<A, B, C>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, any>]): AsyncFlowReturn
function series(fns) {
  let current;
  let cancelled = false;
  let val;

  async function run() {
    for (const fn of fns) {
      if (cancelled) return;
      current = fn(val);

      if (current instanceof Promise) {
        val = await current;
      } else {
        val = current;
      }
    }
  }

  run();

  function cancel() {
    cancelled = true;
    (0, _cancellablePromise.cancelPromise)(current);
  }

  cancel.value = () => val;

  return cancel;
} // simple sanity test


if (false) {}

/***/ }),

/***/ "../../../../../packages/async/src/sleep.ts":
/*!**************************************************!*\
  !*** ../../../../../packages/async/src/sleep.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sleep = void 0;

var _cancellablePromise = __webpack_require__(/*! ./cancellablePromise */ "../../../../../packages/async/src/cancellablePromise.ts");

const sleep = ms => {
  return (0, _cancellablePromise.createCancellablePromise)((res, _rej, onCancel) => {
    const tm = setTimeout(res, ms);
    onCancel(() => {
      clearTimeout(tm);
    });
  });
};

exports.sleep = sleep;

/***/ }),

/***/ "../../../../../packages/fast-compare/src/index.ts":
/*!*********************************************************!*\
  !*** ../../../../../packages/fast-compare/src/index.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isEqual = isEqual;
exports.EQUALITY_KEY = void 0;
const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;
const hasElementType = typeof Element !== 'undefined';
const EQUALITY_KEY = Symbol('EQUALITY_KEY');
exports.EQUALITY_KEY = EQUALITY_KEY;

function isEqual(a, b, options) {
  if (true) {
    return isEqualInner(a, b, options);
  }

  try {
    return isEqualInner(a, b, options);
  } catch (err) {
    if (err.message && err.message.match(/stack|recursion/i) || err.number === -2146828260) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('Warning: @dish/fast-compare does not handle circular references.', err.name, err.message);
      return false;
    }

    throw err;
  }
} // const weakCache = new WeakMap<any, number>()
// const isEqualWeak = (a: any, b: any) => {
//   if (weakCache.has(a) && weakCache.has(b)) {
//     const res = weakCache.get(a) === weakCache.get(b)
//     if (res) console.log('weak cache hit', a, b)
//     return res
//   }
//   weakCache.set(a, Math.random())
//   weakCache.set(b, Math.random())
//   return false
// }


function isEqualInner(a, b, options) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a[EQUALITY_KEY] && a[EQUALITY_KEY] === b[EQUALITY_KEY]) return true;
    let arrA = isArray(a),
        arrB = isArray(b),
        i,
        length,
        key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;

      if (length > 200 || b.length > 200) {
        console.warn('comparing large props! ignoring this, may want to fix');
        return false;
      }

      for (i = length; i-- !== 0;) {
        if (!isEqualInner(a[i], b[i])) return false;
      }

      return true;
    }

    if (arrA != arrB) return false;
    var dateA = a instanceof Date,
        dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();
    var regexpA = a instanceof RegExp,
        regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();
    let setA = a instanceof Set;
    let setB = b instanceof Set;
    if (setA != setB) return false;

    if (setA && setB) {
      if (a.size !== b.size) return false;

      for (let item of a) {
        if (!b.has(item)) return false;
      }

      return true;
    }

    var keys = keyList(a);
    length = keys.length;
    if (length !== keyList(b).length) return false;

    for (i = length; i-- !== 0;) if (!hasProp.call(b, keys[i])) return false; // end fast-deep-equal
    // start @dish/fast-compare
    // custom handling for DOM elements


    if (hasElementType && a instanceof Element && b instanceof Element) return a === b;

    for (i = length; i-- !== 0;) {
      key = keys[i];

      if (options) {
        if (options.ignoreKeys && options.ignoreKeys[key]) {
          continue;
        }

        if (options.simpleCompareKeys && options.simpleCompareKeys[key]) {
          if (a[key] === b[key]) {
            continue;
          } else {
            return false;
          }
        }
      } // custom handling for React


      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!isEqualInner(a[key], b[key])) return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
}

/***/ }),

/***/ "../../../helpers/src/concatClassName.ts":
/*!***********************************************!*\
  !*** ../../../helpers/src/concatClassName.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.concatClassName = concatClassName;

var _uniqueStyleKeys = __webpack_require__(/*! ./uniqueStyleKeys */ "../../../helpers/src/uniqueStyleKeys.ts");

// synced to static-ui constants
const MEDIA_SEP = '_';

function concatClassName(className, ...propObjects) {
  const usedPrefixes = new Set();
  let mediaAllowed;
  const final = [];
  const names = className.split(' ');
  const hasPropObjects = propObjects.length; // const shouldLog = className.includes('debugme ')
  // if (shouldLog) console.log('INIT', className)

  for (let i = names.length - 1; i >= 0; i--) {
    const name = names[i];
    if (!name || name === ' ') continue;

    if (name[0] !== '_') {
      // not snack style (todo slightly stronger heuristic)
      final.push(name);
      continue;
    }

    const splitIndex = name.lastIndexOf('-');

    if (splitIndex < 1) {
      final.push(name);
      continue;
    }

    let uid = name.slice(1, splitIndex); // special handling for media queries
    // a bit awkward to save runtime perf
    //   IF we see a media query like this: _flex-_sm_[hash]
    //   THEN we continue to accept medias within that key
    //   UNTIL we see a NON media, then we STOP ACCEPTING further media queries

    const isMediaQuery = name[splitIndex + 1] === MEDIA_SEP;

    if (isMediaQuery) {
      if (usedPrefixes.has(uid)) {
        continue;
      }

      mediaAllowed = mediaAllowed || new Set();
      mediaAllowed.add(uid);
    } else {
      var _mediaAllowed;

      // we found a non-media on a used media key, time to stop allowing
      if ((_mediaAllowed = mediaAllowed) !== null && _mediaAllowed !== void 0 && _mediaAllowed.has(uid)) {
        mediaAllowed.delete(uid);
        usedPrefixes.add(uid);
      }

      if (usedPrefixes.has(uid)) {
        continue;
      }
    }

    const key = name.slice(1, name.indexOf('-'));
    const propName = _uniqueStyleKeys.uniqueKeyToStyleName[key]; // if defined in a prop object, ignore
    // TODO we need to preserve ordering...

    if (propName && hasPropObjects) {
      if (propObjects.some(po => po && propName in po)) {
        continue;
      }
    }

    if (!isMediaQuery) {
      usedPrefixes.add(uid);
    }

    final.push(name);
  } // if (shouldLog) console.log('FINAL', final.join(' '))


  return final.join(' ');
}

/***/ }),

/***/ "../../../helpers/src/getNiceKey.ts":
/*!******************************************!*\
  !*** ../../../helpers/src/getNiceKey.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getNiceKey = getNiceKey;

function getNiceKey(name, len = 3) {
  let key = '';

  for (const [index, char] of name.split('').entries()) {
    if (index === 0 || char.toUpperCase() === char) {
      key += name.slice(index, index + len);
    }
  }

  return key;
}

/***/ }),

/***/ "../../../helpers/src/index.ts":
/*!*************************************!*\
  !*** ../../../helpers/src/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _concatClassName = __webpack_require__(/*! ./concatClassName */ "../../../helpers/src/concatClassName.ts");

Object.keys(_concatClassName).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _concatClassName[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _concatClassName[key];
    }
  });
});

var _validStyleProps = __webpack_require__(/*! ./validStyleProps */ "../../../helpers/src/validStyleProps.ts");

Object.keys(_validStyleProps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _validStyleProps[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validStyleProps[key];
    }
  });
});

var _uniqueStyleKeys = __webpack_require__(/*! ./uniqueStyleKeys */ "../../../helpers/src/uniqueStyleKeys.ts");

Object.keys(_uniqueStyleKeys).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _uniqueStyleKeys[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _uniqueStyleKeys[key];
    }
  });
});

var _getNiceKey = __webpack_require__(/*! ./getNiceKey */ "../../../helpers/src/getNiceKey.ts");

Object.keys(_getNiceKey).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getNiceKey[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getNiceKey[key];
    }
  });
});

/***/ }),

/***/ "../../../helpers/src/uniqueStyleKeys.ts":
/*!***********************************************!*\
  !*** ../../../helpers/src/uniqueStyleKeys.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getOrCreateStylePrefix = getOrCreateStylePrefix;
exports.uniqueKeyToStyleName = exports.uniqueStyleKeys = void 0;

var _getNiceKey = __webpack_require__(/*! ./getNiceKey */ "../../../helpers/src/getNiceKey.ts");

var _validStyleProps = __webpack_require__(/*! ./validStyleProps */ "../../../helpers/src/validStyleProps.ts");

const existing = new Set(); // unique shortkey for each style key
// for atomic styles prefixing and collision dedupe

const uniqueStyleKeys = {};
exports.uniqueStyleKeys = uniqueStyleKeys;
const uniqueKeyToStyleName = {};
exports.uniqueKeyToStyleName = uniqueKeyToStyleName;

for (const name in _validStyleProps.stylePropsAll) {
  addStylePrefix(name);
}

function getOrCreateStylePrefix(name) {
  var _uniqueStyleKeys$name;

  return (_uniqueStyleKeys$name = uniqueStyleKeys[name]) !== null && _uniqueStyleKeys$name !== void 0 ? _uniqueStyleKeys$name : addStylePrefix(name);
}

function addStylePrefix(name) {
  let len = 1;
  let key = (0, _getNiceKey.getNiceKey)(name);

  while (existing.has(key)) {
    len++;
    key = (0, _getNiceKey.getNiceKey)(name, len);
  }

  existing.add(key);
  uniqueStyleKeys[name] = key;
  uniqueKeyToStyleName[key] = name;
  return key;
}

/***/ }),

/***/ "../../../helpers/src/validStyleProps.ts":
/*!***********************************************!*\
  !*** ../../../helpers/src/validStyleProps.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.stylePropsAll = exports.stylePropsText = exports.stylePropsTextOnly = exports.stylePropsView = void 0;
const stylePropsView = Object.freeze({
  pointerEvents: true,
  userSelect: true,
  cursor: true,
  backfaceVisibility: true,
  backgroundColor: true,
  borderBottomColor: true,
  borderBottomEndRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderBottomStartRadius: true,
  borderBottomWidth: true,
  borderColor: true,
  borderEndColor: true,
  borderLeftColor: true,
  borderLeftWidth: true,
  borderRadius: true,
  borderRightColor: true,
  borderRightWidth: true,
  borderStartColor: true,
  borderStyle: true,
  borderTopColor: true,
  borderTopEndRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderTopStartRadius: true,
  borderTopWidth: true,
  borderWidth: true,
  opacity: true,
  transform: true,
  transformMatrix: true,
  rotation: true,
  scaleX: true,
  scaleY: true,
  translateX: true,
  translateY: true,
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  aspectRatio: true,
  borderEndWidth: true,
  borderStartWidth: true,
  bottom: true,
  display: true,
  end: true,
  flex: true,
  flexBasis: true,
  flexDirection: true,
  flexGrow: true,
  flexShrink: true,
  flexWrap: true,
  height: true,
  justifyContent: true,
  left: true,
  margin: true,
  marginBottom: true,
  marginEnd: true,
  marginHorizontal: true,
  marginLeft: true,
  marginRight: true,
  marginStart: true,
  marginTop: true,
  marginVertical: true,
  maxHeight: true,
  maxWidth: true,
  minHeight: true,
  minWidth: true,
  overflow: true,
  padding: true,
  paddingBottom: true,
  paddingEnd: true,
  paddingHorizontal: true,
  paddingLeft: true,
  paddingRight: true,
  paddingStart: true,
  paddingTop: true,
  paddingVertical: true,
  position: true,
  right: true,
  start: true,
  top: true,
  width: true,
  zIndex: true,
  direction: true,
  shadowColor: true,
  shadowOffset: true,
  shadowOpacity: true,
  shadowRadius: true
});
exports.stylePropsView = stylePropsView;
const stylePropsTextOnly = Object.freeze({
  color: true,
  fontFamily: true,
  fontSize: true,
  fontStyle: true,
  fontWeight: true,
  letterSpacing: true,
  lineHeight: true,
  textAlign: true,
  textDecorationLine: true,
  textDecorationStyle: true,
  textDecorationColor: true,
  textShadowColor: true,
  textShadowOffset: true,
  textShadowRadius: true,
  textTransform: true
});
exports.stylePropsTextOnly = stylePropsTextOnly;
const stylePropsText = Object.freeze({ ...stylePropsView,
  ...stylePropsTextOnly
});
exports.stylePropsText = stylePropsText;
const stylePropsAll = stylePropsText;
exports.stylePropsAll = stylePropsAll;

/***/ }),

/***/ "./constants.tsx":
/*!***********************!*\
  !*** ./constants.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.testColor = void 0;
const testColor = 'blue';
exports.testColor = testColor;

/***/ }),

/***/ "./extract-spec-constants.ts":
/*!***********************************!*\
  !*** ./extract-spec-constants.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.nestedStyle = exports.baseStyle = void 0;
const baseStyle = {
  backgroundColor: 'red'
};
exports.baseStyle = baseStyle;
const nestedStyle = { ...baseStyle,
  backgroundColor: 'white',
  color: 'blue'
};
exports.nestedStyle = nestedStyle;

/***/ }),

/***/ "../../../snackui/src/constants.ts":
/*!*****************************************!*\
  !*** ../../../snackui/src/constants.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isWebIOS = exports.isWeb = void 0;
// dont import things
const isWeb = !process.env.TARGET || process.env.TARGET === 'web';
exports.isWeb = isWeb;
const isWebIOS = typeof window !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) && !window.MSStream;
exports.isWebIOS = isWebIOS;

/***/ }),

/***/ "../../../snackui/src/helpers/combineRefs.ts":
/*!***************************************************!*\
  !*** ../../../snackui/src/helpers/combineRefs.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.combineRefs = combineRefs;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

// https://github.com/seznam/compose-react-refs/blob/master/combineRefs.ts
function combineRefs(...refs) {
  if (refs.length === 2) {
    // micro-optimize the hot path
    return composeTwoRefs(refs[0], refs[1]) || null;
  }

  const composedRef = refs.slice(1).reduce((semiCombinedRef, refToInclude) => composeTwoRefs(semiCombinedRef, refToInclude), refs[0]);
  return composedRef || null;
}

const composedRefCache = new WeakMap();

function composeTwoRefs(ref1, ref2) {
  if (ref1 && ref2) {
    const ref1Cache = composedRefCache.get(ref1) || new WeakMap();
    composedRefCache.set(ref1, ref1Cache);

    const composedRef = ref1Cache.get(ref2) || (instance => {
      updateRef(ref1, instance);
      updateRef(ref2, instance);
    });

    ref1Cache.set(ref2, composedRef);
    return composedRef;
  }

  if (!ref1) {
    return ref2;
  } else {
    return ref1;
  }
}

function updateRef(ref, instance) {
  if (typeof ref === 'function') {
    ref(instance);
  } else {
    ;
    ref.current = instance;
  }
}

/***/ }),

/***/ "../../../snackui/src/helpers/extendStaticConfig.ts":
/*!**********************************************************!*\
  !*** ../../../snackui/src/helpers/extendStaticConfig.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extendStaticConfig = extendStaticConfig;

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

function extendStaticConfig(a, config = {}) {
  var _config$isText;

  if (process.env.TARGET === 'client') {
    return;
  }

  if (!a.staticConfig) {
    throw new Error(`No static config: ${a} ${JSON.stringify(config)}`);
  }

  return {
    isText: (_config$isText = config.isText) !== null && _config$isText !== void 0 ? _config$isText : a.staticConfig.isText,
    validStyles: { ...a.staticConfig.validStyles,
      ...config.validStyles
    },
    defaultProps: { ...a.staticConfig.defaultProps,
      ...config.defaultProps
    },
    expansionProps: { ...a.staticConfig.expansionProps,
      ...config.expansionProps
    }
  };
}

/***/ }),

/***/ "../../../snackui/src/helpers/getNode.tsx":
/*!************************************************!*\
  !*** ../../../snackui/src/helpers/getNode.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getNode = void 0;

var _findNodeHandle = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/findNodeHandle */ "../../../../../node_modules/react-native-web/dist/exports/findNodeHandle/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getNode = refCurrent => {
  return (0, _findNodeHandle.default)(refCurrent);
};

exports.getNode = getNode;

/***/ }),

/***/ "../../../snackui/src/helpers/matchMedia.ts":
/*!**************************************************!*\
  !*** ../../../snackui/src/helpers/matchMedia.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.matchMedia = void 0;
const matchMedia = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia : function matchMediaFallback() {
  return {
    addEventListener() {},

    removeEventListener() {},

    matches: false
  };
};
exports.matchMedia = matchMedia;

/***/ }),

/***/ "../../../snackui/src/helpers/prevent.tsx":
/*!************************************************!*\
  !*** ../../../snackui/src/helpers/prevent.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.prevent = void 0;

const prevent = e => [e.preventDefault(), e.stopPropagation()];

exports.prevent = prevent;

/***/ }),

/***/ "../../../snackui/src/helpers/spacedChildren.tsx":
/*!*******************************************************!*\
  !*** ../../../snackui/src/helpers/spacedChildren.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.spacedChildren = spacedChildren;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _Spacer = __webpack_require__(/*! ../views/Spacer */ "../../../snackui/src/views/Spacer.tsx");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

function spacedChildren({
  children,
  spacing,
  flexDirection
}) {
  if (typeof spacing === 'undefined') {
    return children;
  }

  const next = [];

  const childrenList = _react.Children.toArray(children);

  const len = childrenList.length;

  const spacer = /*#__PURE__*/_jsx(_Spacer.Spacer, {
    size: spacing,
    direction: flexDirection === 'row' || flexDirection === 'row-reverse' ? 'horizontal' : 'vertical'
  });

  for (const [index, child] of childrenList.entries()) {
    next.push(child);

    if (index === len - 1) {
      break;
    }

    next.push( /*#__PURE__*/_jsx(_react.default.Fragment, {}, index, spacer));
  }

  return next;
}

/***/ }),

/***/ "../../../snackui/src/helpers/themeable.tsx":
/*!**************************************************!*\
  !*** ../../../snackui/src/helpers/themeable.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.themeable = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _useTheme = __webpack_require__(/*! ../hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const themeable = function graphql(Component) {
  const withTheme = function WithTheme(props) {
    if (props.theme) {
      return /*#__PURE__*/_jsx(_useTheme.Theme, {
        name: props.theme
      }, void 0, /*#__PURE__*/_react.default.createElement(Component, props));
    }

    return /*#__PURE__*/_react.default.createElement(Component, props);
  };

  withTheme.displayName = `Themed(${(Component === null || Component === void 0 ? void 0 : Component.displayName) || (Component === null || Component === void 0 ? void 0 : Component.name) || 'Anonymous'})`;
  return withTheme;
};

exports.themeable = themeable;

/***/ }),

/***/ "../../../snackui/src/helpers/weakKey.ts":
/*!***********************************************!*\
  !*** ../../../snackui/src/helpers/weakKey.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.weakKey = void 0;
const map = new WeakMap();

const weakKey = obj => {
  const next = map.get(obj);

  if (next) {
    return next;
  }

  map.set(obj, `${Math.random()}`);
  return weakKey(obj);
};

exports.weakKey = weakKey;

/***/ }),

/***/ "../../../snackui/src/hooks/useConstant.ts":
/*!*************************************************!*\
  !*** ../../../snackui/src/hooks/useConstant.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useConstant = useConstant;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function useConstant(fn) {
  const ref = (0, _react.useRef)();

  if (!ref.current) {
    ref.current = {
      v: fn()
    };
  }

  return ref.current.v;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useDebounce.ts":
/*!*************************************************!*\
  !*** ../../../snackui/src/hooks/useDebounce.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useDebounce = useDebounce;
exports.useDebounceValue = useDebounceValue;

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../../../../../node_modules/lodash/debounce.js"));

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useDebounce(fn, wait, options = {
  leading: false
}, mountArgs = []) {
  const dbEffect = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    return () => {
      var _dbEffect$current;

      (_dbEffect$current = dbEffect.current) === null || _dbEffect$current === void 0 ? void 0 : _dbEffect$current.cancel();
    };
  }, []);
  return (0, _react.useMemo)(() => {
    dbEffect.current = (0, _debounce2.default)(fn, wait, options);
    return dbEffect.current;
  }, [JSON.stringify(options), ...mountArgs]);
}
/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */


function useDebounceValue(val, amt = 0) {
  const [state, setState] = (0, _react.useState)(val);
  (0, _react.useEffect)(() => {
    let tm = setTimeout(() => {
      setState(prev => {
        if (prev === val) return prev;
        return val;
      });
    }, amt);
    return () => {
      clearTimeout(tm);
    };
  }, [val]);
  return state;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useDebounceEffect.tsx":
/*!********************************************************!*\
  !*** ../../../snackui/src/hooks/useDebounceEffect.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useDebounceEffect = void 0;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

const useDebounceEffect = (effect, amount, args) => {
  (0, _react.useEffect)(() => {
    let dispose;
    const tm = setTimeout(() => {
      dispose = effect();
    }, amount);
    return () => {
      var _dispose;

      clearTimeout(tm);
      (_dispose = dispose) === null || _dispose === void 0 ? void 0 : _dispose();
    };
  }, args);
};

exports.useDebounceEffect = useDebounceEffect;

/***/ }),

/***/ "../../../snackui/src/hooks/useForceUpdate.ts":
/*!****************************************************!*\
  !*** ../../../snackui/src/hooks/useForceUpdate.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useForceUpdate = useForceUpdate;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

// ensures no updates after unmount
function useForceUpdate() {
  const setState = (0, _react.useState)(0)[1];
  const internal = (0, _react.useRef)();

  if (!internal.current) {
    internal.current = {
      isMounted: true,
      update: () => {
        if (internal.current.isMounted) {
          setState(Math.random());
        }
      }
    };
  }

  (0, _react.useEffect)(() => {
    return () => {
      internal.current.isMounted = false;
    };
  }, []);
  return internal.current.update;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useGet.ts":
/*!********************************************!*\
  !*** ../../../snackui/src/hooks/useGet.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useGet = useGet;
exports.useGetFn = useGetFn;
exports.useStateFn = useStateFn;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

// keeps a reference to the current value easily
function useGet(currentValue) {
  const curRef = (0, _react.useRef)(null);
  curRef.current = currentValue;
  return (0, _react.useCallback)(() => curRef.current, [curRef]);
} // keeps a reference to the current function easily


function useGetFn(fn) {
  const getCur = useGet(fn);
  return (...args) => getCur()(...args);
}

function useStateFn(currentValue) {
  const [state, setState] = (0, _react.useState)(currentValue);
  const curRef = (0, _react.useRef)();
  curRef.current = state;
  return [(0, _react.useCallback)(() => curRef.current, []), setState];
}

/***/ }),

/***/ "../../../snackui/src/hooks/useLazyEffect.ts":
/*!***************************************************!*\
  !*** ../../../snackui/src/hooks/useLazyEffect.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useLazyEffect = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useLazyEffect = (cb, dep) => {
  const initializeRef = (0, _react.useRef)(false);
  (0, _react.useEffect)((...args) => {
    if (initializeRef.current) {
      cb(...args);
    } else {
      initializeRef.current = true;
    }
  }, dep);
};

exports.useLazyEffect = useLazyEffect;

/***/ }),

/***/ "../../../snackui/src/hooks/useLazyRef.ts":
/*!************************************************!*\
  !*** ../../../snackui/src/hooks/useLazyRef.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useLazyRef = useLazyRef;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function useLazyRef(fn) {
  const ref = (0, _react.useRef)();
  if (!ref.current) ref.current = fn();
  return ref;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useMedia.ts":
/*!**********************************************!*\
  !*** ../../../snackui/src/hooks/useMedia.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mediaObjectToString = exports.useMedia = exports.configureMedia = exports.getMedia = exports.defaultMediaQueries = void 0;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

var _matchMedia = __webpack_require__(/*! ../helpers/matchMedia */ "../../../snackui/src/helpers/matchMedia.ts");

var _useConstant = __webpack_require__(/*! ./useConstant */ "../../../snackui/src/hooks/useConstant.ts");

var _useForceUpdate = __webpack_require__(/*! ./useForceUpdate */ "../../../snackui/src/hooks/useForceUpdate.ts");

//
// for types:
//
//   interface MyMediaQueries {}
//   const myMediaQueries: MyMediaQueries = {}
//   configureMedia(myMediaQueries)
//   declare module 'snackui' {
//     interface MediaQueryState extends MyMediaQueries
//   }
//
//
const defaultMediaQueries = {
  xs: {
    maxWidth: 660
  },
  notXs: {
    minWidth: 660 + 1
  },
  sm: {
    maxWidth: 860
  },
  notSm: {
    minWidth: 860 + 1
  },
  md: {
    minWidth: 960
  },
  lg: {
    minWidth: 1120
  },
  xl: {
    minWidth: 1280
  },
  xxl: {
    minWidth: 1420
  },
  short: {
    maxHeight: 820
  },
  tall: {
    minHeight: 820
  },
  hoverNone: {
    hover: 'none'
  },
  pointerCoarse: {
    pointer: 'coarse'
  }
};
exports.defaultMediaQueries = defaultMediaQueries;
const mediaState = {};
const mediaQueryListeners = {};

const getMedia = () => mediaState;

exports.getMedia = getMedia;
let hasConfigured = false;

const configureMedia = ({
  queries = defaultMediaQueries,
  defaultActive = ['sm', 'xs']
}) => {
  if (hasConfigured) {
    throw new Error(`Already configured mediaQueries once`);
  }

  hasConfigured = true; // setup

  for (const key in queries) {
    try {
      const str = mediaObjectToString(queries[key]);

      const getMatch = () => (0, _matchMedia.matchMedia)(str);

      const match = getMatch();
      mediaState[key] = !!match.matches;
      match.addEventListener('change', () => {
        const next = !!getMatch().matches;
        if (next === mediaState[key]) return;
        mediaState[key] = next;
        const listeners = mediaQueryListeners[key];

        if (listeners !== null && listeners !== void 0 && listeners.size) {
          for (const cb of [...listeners]) {
            cb();
          }
        }
      });
    } catch (err) {
      var _defaultActive$includ;

      console.error('Error running media query', err.message);
      console.error('Error stack:', err.stack);
      mediaState[key] = (_defaultActive$includ = defaultActive === null || defaultActive === void 0 ? void 0 : defaultActive.includes(key)) !== null && _defaultActive$includ !== void 0 ? _defaultActive$includ : true;
    }
  }
};

exports.configureMedia = configureMedia;
const defaultOptions = {
  queries: defaultMediaQueries // defaultActive: ['sm', 'xs']

};

const useMedia = () => {
  if (!hasConfigured) {
    configureMedia(defaultOptions);
  }

  const forceUpdate = (0, _useForceUpdate.useForceUpdate)();
  const state = (0, _react.useRef)();

  if (!state.current) {
    state.current = {
      selections: {},
      nextSelections: {},
      isUnmounted: false,
      isRendering: true
    };
  }

  state.current.isRendering = true; // track usage

  (0, _react.useLayoutEffect)(() => {
    const st = state.current;
    st.isRendering = false; // delete old

    for (const key in st.selections) {
      if (!(key in st.nextSelections)) {
        mediaQueryListeners[key].delete(forceUpdate);
      }
    } // add new


    for (const key in st.nextSelections) {
      if (!(key in st.selections)) {
        mediaQueryListeners[key] = mediaQueryListeners[key] || new Set();
        mediaQueryListeners[key].add(forceUpdate);
      }
    }
  }); // unmount

  (0, _react.useLayoutEffect)(() => {
    return () => {
      const st = state.current;
      st.isUnmounted = true;
      const allKeys = { ...st.selections,
        ...st.nextSelections
      };

      for (const key in allKeys) {
        mediaQueryListeners[key].delete(forceUpdate);
      }
    };
  }, []);
  return (0, _useConstant.useConstant)(() => {
    const st = state.current;
    return new Proxy(mediaState, {
      get(target, key) {
        if (!mediaState) return;

        if (typeof key !== 'string') {
          return Reflect.get(target, key);
        }

        if (!(key in mediaState)) {
          throw new Error(`No media query configured "${String(key)}" in: ${Object.keys(mediaState)}`);
        }

        if (!st.isUnmounted) {
          if (st.isRendering) {
            st.nextSelections[key] = true;
          }
        }

        if (key in mediaState) {
          return mediaState[key];
        }

        return Reflect.get(mediaState, key);
      }

    });
  });
};

exports.useMedia = useMedia;

const camelToHyphen = str => str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`).toLowerCase();

const mediaObjectToString = query => {
  if (typeof query === 'string') {
    return query;
  }

  return Object.entries(query).map(([feature, value]) => {
    feature = camelToHyphen(feature);

    if (typeof value === 'string') {
      return `(${feature}: ${value})`;
    }

    if (typeof value === 'number' && /[height|width]$/.test(feature)) {
      value = `${value}px`;
    }

    return `(${feature}: ${value})`;
  }).join(' and ');
};

exports.mediaObjectToString = mediaObjectToString;

/***/ }),

/***/ "../../../snackui/src/hooks/useNode.ts":
/*!*********************************************!*\
  !*** ../../../snackui/src/hooks/useNode.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useNode = useNode;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

const idFn = _ => _;

function useNode(props = {
  map: idFn
}) {
  const internalRef = (0, _react.useRef)(null);
  const ref = props.ref || internalRef;
  const mapRef = (0, _react.useRef)(null);

  if (ref.current) {
    mapRef.current = props.map(ref.current);
  }

  return {
    current: mapRef.current,
    ref
  };
}

/***/ }),

/***/ "../../../snackui/src/hooks/useOnMount.ts":
/*!************************************************!*\
  !*** ../../../snackui/src/hooks/useOnMount.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useOnMount = useOnMount;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function useOnMount(cb) {
  (0, _react.useEffect)(() => cb(), []);
}

/***/ }),

/***/ "../../../snackui/src/hooks/useOnUnmount.ts":
/*!**************************************************!*\
  !*** ../../../snackui/src/hooks/useOnUnmount.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useOnUnmount = useOnUnmount;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function useOnUnmount(cb) {
  (0, _react.useEffect)(() => {
    return cb;
  }, []);
}

/***/ }),

/***/ "../../../snackui/src/hooks/useOverlay.tsx":
/*!*************************************************!*\
  !*** ../../../snackui/src/hooks/useOverlay.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useOverlay = void 0;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

var _Platform = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Platform */ "../../../../../node_modules/react-native-web/dist/exports/Platform/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const useOverlay = ({
  zIndex = 100000 - 1,
  isOpen,
  onClick,
  pointerEvents
}) => {
  if (_Platform.default.OS !== 'web') {
    return;
  }

  (0, _react.useLayoutEffect)(() => {
    if (!isOpen) return;
    const node = document.querySelector('#root');

    if (node) {
      var _node$parentNode;

      const overlayDiv = document.createElement('div');
      overlayDiv.style.background = 'rgba(0,0,0,0.1)';
      overlayDiv.style.pointerEvents = 'auto';
      overlayDiv.style.position = 'absolute';
      overlayDiv.style.top = '0px';
      overlayDiv.style.right = '0px';
      overlayDiv.style.bottom = '0px';
      overlayDiv.style.left = '0px';

      if (pointerEvents === false) {
        overlayDiv.style.pointerEvents = 'none';
      }

      overlayDiv.style.zIndex = `${zIndex}`;
      overlayDiv.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        if (onClick) {
          onClick();
        }
      });
      (_node$parentNode = node.parentNode) === null || _node$parentNode === void 0 ? void 0 : _node$parentNode.insertBefore(overlayDiv, node);
      return () => {
        var _node$parentNode2;

        (_node$parentNode2 = node.parentNode) === null || _node$parentNode2 === void 0 ? void 0 : _node$parentNode2.removeChild(overlayDiv);
      };
    }
  }, [isOpen]);
};

exports.useOverlay = useOverlay;

/***/ }),

/***/ "../../../snackui/src/hooks/usePrevious.ts":
/*!*************************************************!*\
  !*** ../../../snackui/src/hooks/usePrevious.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.usePrevious = usePrevious;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function usePrevious(value) {
  const ref = (0, _react.useRef)(value);
  (0, _react.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useRefMounted.ts":
/*!***************************************************!*\
  !*** ../../../snackui/src/hooks/useRefMounted.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

// via https://raw.githubusercontent.com/streamich/react-use/master/src/useRefMounted.ts
const useRefMounted = () => {
  const refMounted = (0, _react.useRef)(false);
  (0, _react.useEffect)(() => {
    refMounted.current = true;
    return () => {
      refMounted.current = false;
    };
  }, []);
  return refMounted;
};

var _default = useRefMounted;
exports.default = _default;

/***/ }),

/***/ "../../../snackui/src/hooks/useScrollPosition.ts":
/*!*******************************************************!*\
  !*** ../../../snackui/src/hooks/useScrollPosition.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useScrollPosition = useScrollPosition;

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../../../../../node_modules/lodash/debounce.js"));

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useScrollPosition(ref, cb) {
  (0, _react.useEffect)(() => {
    const node = ref.current;
    const scrollParent = getScrollParent(node);
    if (!scrollParent) return;
    const onScroll = (0, _debounce2.default)(() => {
      cb(ref.current);
    }, 32); // TODO can make this deduped by container :)

    scrollParent.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => {
      scrollParent.removeEventListener('scroll', onScroll);
    };
  }, [ref.current]);
}

function getScrollParent(element, includeHidden) {
  if (!element) {
    return null;
  }

  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === 'fixed') {
    return window;
  }

  let parent = element;

  while (parent) {
    parent = parent.parentElement;

    if (!parent) {
      return null;
    }

    style = getComputedStyle(parent);

    if (excludeStaticParent && style.position === 'static') {
      continue;
    }

    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return window;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useTextStylePropsSplit.tsx":
/*!*************************************************************!*\
  !*** ../../../snackui/src/hooks/useTextStylePropsSplit.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useTextStylePropsSplit = void 0;

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

const useTextStylePropsSplit = props => {
  return (0, _react.useMemo)(() => {
    const styleProps = {};
    const textProps = {};

    for (const key in props) {
      if (_helpers.stylePropsText[key]) {
        styleProps[key] = props[key];
      } else {
        textProps[key] = props[key];
      }
    }

    return {
      styleProps,
      textProps
    };
  }, [props]);
};

exports.useTextStylePropsSplit = useTextStylePropsSplit;

/***/ }),

/***/ "../../../snackui/src/hooks/useTheme.tsx":
/*!***********************************************!*\
  !*** ../../../snackui/src/hooks/useTheme.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Theme = exports.ThemeProvider = exports.useTheme = exports.useThemeName = exports.ActiveThemeContext = exports.configureThemes = exports.invertStyleVariableToValue = void 0;

var _fastCompare = __webpack_require__(/*! @dish/fast-compare */ "../../../../../packages/fast-compare/src/index.ts");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _useForceUpdate = __webpack_require__(/*! ./useForceUpdate */ "../../../snackui/src/hooks/useForceUpdate.ts");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PREFIX = `theme--`;
let hasConfigured = false;
let themes = {};
const invertStyleVariableToValue = {};
exports.invertStyleVariableToValue = invertStyleVariableToValue;

const configureThemes = userThemes => {
  if (hasConfigured) {
    console.warn(`Already configured themes once`);
    return;
  }

  hasConfigured = true;
  themes = userThemes;

  if (_constants.isWeb) {
    // insert css variables
    const tag = createStyleTag();

    for (const themeName in userThemes) {
      var _tag$sheet;

      const theme = userThemes[themeName];
      invertStyleVariableToValue[themeName] = invertStyleVariableToValue[themeName] || {};
      let vars = '';

      for (const themeKey in theme) {
        const themeVal = theme[themeKey];
        const variableName = `--${themeKey}`;
        invertStyleVariableToValue[themeName][`var(${variableName})`] = themeVal;
        vars += `${variableName}: ${themeVal};`;
      }

      const rule = `.${PREFIX}${themeName} { ${vars} }`;
      tag === null || tag === void 0 ? void 0 : (_tag$sheet = tag.sheet) === null || _tag$sheet === void 0 ? void 0 : _tag$sheet.insertRule(rule);
    }
  }
};

exports.configureThemes = configureThemes;

class ActiveThemeManager {
  constructor() {
    _defineProperty(this, "name", '');

    _defineProperty(this, "keys", new Map());

    _defineProperty(this, "listeners", new Map());
  }

  setActiveTheme(name) {
    if (name === this.name) return;
    this.name = name;
    this.update();
  }

  track(uuid, keys) {
    this.keys.set(uuid, keys);
  }

  update() {
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)();
      }
    }
  }

  onUpdate(uuid, cb) {
    this.listeners.set(uuid, cb);
    return () => {
      this.listeners.delete(uuid);
      this.keys.delete(uuid);
    };
  }

}

const ThemeContext = /*#__PURE__*/(0, _react.createContext)(themes);
const ActiveThemeContext = /*#__PURE__*/(0, _react.createContext)(new ActiveThemeManager());
exports.ActiveThemeContext = ActiveThemeContext;

const useThemeName = () => {
  return (0, _react.useContext)(ActiveThemeContext).name;
};

exports.useThemeName = useThemeName;

const useTheme = () => {
  const forceUpdate = (0, _useForceUpdate.useForceUpdate)();
  const manager = (0, _react.useContext)(ActiveThemeContext);
  const themes = (0, _react.useContext)(ThemeContext);
  const state = (0, _react.useRef)();

  if (!state.current) {
    state.current = {
      uuid: {},
      keys: new Set(),
      isRendering: true
    };
  }

  state.current.isRendering = true; // track usage

  (0, _react.useLayoutEffect)(() => {
    const st = state.current;
    st.isRendering = false;

    if (!(0, _fastCompare.isEqual)(st.keys, manager.keys.get(st.uuid))) {
      manager.track(st.uuid, st.keys);
    }
  });
  (0, _react.useEffect)(() => {
    return manager.onUpdate(state.current.uuid, forceUpdate);
  }, []);
  return (0, _react.useMemo)(() => {
    return new Proxy(themes[manager.name], {
      get(_, key) {
        if (typeof key !== 'string') return;
        const activeTheme = themes[manager.name];
        const val = activeTheme[key];

        if (!val) {
          throw new Error(`No theme value "${String(key)}" in: ${Object.keys(activeTheme)}`);
        }

        if (state.current.isRendering) {
          state.current.keys.add(key);
        }

        return val;
      }

    });
  }, [manager.name]);
};

exports.useTheme = useTheme;

const ThemeProvider = props => {
  if (!hasConfigured) {
    throw new Error(`Missing configureThemes() call, add to your root file`);
  } // ensure theme is attached to root body node as well to work with modals by default


  (0, _react.useLayoutEffect)(() => {
    if (typeof document !== 'undefined') {
      const cns = getThemeParentClassName(`${props.defaultTheme}`).split(' ');
      cns.forEach(cn => document.body.classList.add(cn));
      return () => {
        cns.forEach(cn => document.body.classList.remove(cn));
      };
    }
  }, []);
  return /*#__PURE__*/_jsx(ThemeContext.Provider, {
    value: props.themes
  }, void 0, /*#__PURE__*/_jsx(Theme, {
    name: props.defaultTheme
  }, void 0, props.children));
};

exports.ThemeProvider = ThemeProvider;

const Theme = props => {
  const parent = (0, _react.useContext)(ActiveThemeContext);
  const [themeManager, setThemeManager] = (0, _react.useState)(() => {
    if (props.name) {
      const manager = new ActiveThemeManager();
      manager.setActiveTheme(`${props.name}`);
      return manager;
    }

    return null;
  });
  (0, _react.useLayoutEffect)(() => {
    if (props.name === null) {
      setThemeManager(null);
      return;
    }

    if (props.name === parent.name) {
      if (themeManager !== parent) {
        setThemeManager(parent);
      }
    } else {
      const next = new ActiveThemeManager();
      next.setActiveTheme(`${props.name}`);
      setThemeManager(next);
    }
  }, [props.name]);
  const contents = themeManager ? /*#__PURE__*/_jsx(ActiveThemeContext.Provider, {
    value: themeManager
  }, void 0, props.children) : props.children;

  if (_constants.isWeb) {
    return /*#__PURE__*/_jsx("div", {
      className: getThemeParentClassName(themeManager === null || themeManager === void 0 ? void 0 : themeManager.name),
      style: {
        display: 'contents'
      }
    }, void 0, contents);
  }

  return contents;
};

exports.Theme = Theme;

function getThemeParentClassName(themeName) {
  return `theme-parent ${themeName ? `${PREFIX}${themeName}` : ''}`;
}

function createStyleTag() {
  if (typeof document === 'undefined') {
    return null;
  }

  const tag = document.createElement('style');
  tag.className = 'snackui-css-vars';
  tag.setAttribute('type', 'text/css');
  tag.appendChild(document.createTextNode(''));

  if (!document.head) {
    throw new Error('expected head');
  }

  document.head.appendChild(tag);
  return tag;
}

/***/ }),

/***/ "../../../snackui/src/hooks/useWindowSize.ts":
/*!***************************************************!*\
  !*** ../../../snackui/src/hooks/useWindowSize.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useWindowSize = useWindowSize;

var _throttle2 = _interopRequireDefault(__webpack_require__(/*! lodash/throttle */ "../../../../../node_modules/lodash/throttle.js"));

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

var _Dimensions = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Dimensions */ "../../../../../node_modules/react-native-web/dist/exports/Dimensions/index.js"));

var _useForceUpdate = __webpack_require__(/*! ./useForceUpdate */ "../../../snackui/src/hooks/useForceUpdate.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const idFn = _ => _;

const getWindowSize = () => [_Dimensions.default.get('window').width, _Dimensions.default.get('window').height]; // singleton for performance


class WindowSizeStore {
  constructor() {
    _defineProperty(this, "listeners", new Set());

    _defineProperty(this, "size", getWindowSize());

    _defineProperty(this, "update", (0, _throttle2.default)(() => {
      this.size = getWindowSize();
      this.listeners.forEach(x => x());
    }, 350));

    _Dimensions.default.addEventListener('change', this.update);
  }

  unmount() {
    _Dimensions.default.removeEventListener('change', this.update);

    this.update.cancel();
  }

}

let store = null;

function useWindowSize({
  adjust = idFn
} = {}) {
  store = store || new WindowSizeStore();
  const size = store.size;
  const forceUpdate = (0, _useForceUpdate.useForceUpdate)();
  (0, _react.useEffect)(() => {
    store.listeners.add(forceUpdate);
    return () => {
      store.listeners.delete(forceUpdate);
    };
  }, [adjust]);
  return adjust(size);
}

/***/ }),

/***/ "../../../snackui/src/index.ts":
/*!*************************************!*\
  !*** ../../../snackui/src/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _useDebounce = __webpack_require__(/*! ./hooks/useDebounce */ "../../../snackui/src/hooks/useDebounce.ts");

Object.keys(_useDebounce).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useDebounce[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useDebounce[key];
    }
  });
});

var _useConstant = __webpack_require__(/*! ./hooks/useConstant */ "../../../snackui/src/hooks/useConstant.ts");

Object.keys(_useConstant).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useConstant[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useConstant[key];
    }
  });
});

var _useDebounceEffect = __webpack_require__(/*! ./hooks/useDebounceEffect */ "../../../snackui/src/hooks/useDebounceEffect.tsx");

Object.keys(_useDebounceEffect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useDebounceEffect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useDebounceEffect[key];
    }
  });
});

var _useForceUpdate = __webpack_require__(/*! ./hooks/useForceUpdate */ "../../../snackui/src/hooks/useForceUpdate.ts");

Object.keys(_useForceUpdate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useForceUpdate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useForceUpdate[key];
    }
  });
});

var _useGet = __webpack_require__(/*! ./hooks/useGet */ "../../../snackui/src/hooks/useGet.ts");

Object.keys(_useGet).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useGet[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useGet[key];
    }
  });
});

var _useLazyRef = __webpack_require__(/*! ./hooks/useLazyRef */ "../../../snackui/src/hooks/useLazyRef.ts");

Object.keys(_useLazyRef).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useLazyRef[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useLazyRef[key];
    }
  });
});

var _useMedia = __webpack_require__(/*! ./hooks/useMedia */ "../../../snackui/src/hooks/useMedia.ts");

Object.keys(_useMedia).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useMedia[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useMedia[key];
    }
  });
});

var _useNode = __webpack_require__(/*! ./hooks/useNode */ "../../../snackui/src/hooks/useNode.ts");

Object.keys(_useNode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useNode[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useNode[key];
    }
  });
});

var _useOnMount = __webpack_require__(/*! ./hooks/useOnMount */ "../../../snackui/src/hooks/useOnMount.ts");

Object.keys(_useOnMount).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useOnMount[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useOnMount[key];
    }
  });
});

var _useOnUnmount = __webpack_require__(/*! ./hooks/useOnUnmount */ "../../../snackui/src/hooks/useOnUnmount.ts");

Object.keys(_useOnUnmount).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useOnUnmount[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useOnUnmount[key];
    }
  });
});

var _useOverlay = __webpack_require__(/*! ./hooks/useOverlay */ "../../../snackui/src/hooks/useOverlay.tsx");

Object.keys(_useOverlay).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useOverlay[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useOverlay[key];
    }
  });
});

var _usePrevious = __webpack_require__(/*! ./hooks/usePrevious */ "../../../snackui/src/hooks/usePrevious.ts");

Object.keys(_usePrevious).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _usePrevious[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _usePrevious[key];
    }
  });
});

var _useRefMounted = __webpack_require__(/*! ./hooks/useRefMounted */ "../../../snackui/src/hooks/useRefMounted.ts");

Object.keys(_useRefMounted).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useRefMounted[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useRefMounted[key];
    }
  });
});

var _useScrollPosition = __webpack_require__(/*! ./hooks/useScrollPosition */ "../../../snackui/src/hooks/useScrollPosition.ts");

Object.keys(_useScrollPosition).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useScrollPosition[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useScrollPosition[key];
    }
  });
});

var _useTheme = __webpack_require__(/*! ./hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

Object.keys(_useTheme).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useTheme[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useTheme[key];
    }
  });
});

var _useLazyEffect = __webpack_require__(/*! ./hooks/useLazyEffect */ "../../../snackui/src/hooks/useLazyEffect.ts");

Object.keys(_useLazyEffect).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useLazyEffect[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useLazyEffect[key];
    }
  });
});

var _useWindowSize = __webpack_require__(/*! ./hooks/useWindowSize */ "../../../snackui/src/hooks/useWindowSize.ts");

Object.keys(_useWindowSize).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useWindowSize[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useWindowSize[key];
    }
  });
});

var _AnimatedStack = __webpack_require__(/*! ./views/AnimatedStack */ "../../../snackui/src/views/AnimatedStack.tsx");

Object.keys(_AnimatedStack).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AnimatedStack[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AnimatedStack[key];
    }
  });
});

var _BlurView = __webpack_require__(/*! ./views/BlurView */ "../../../snackui/src/views/BlurView.tsx");

Object.keys(_BlurView).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _BlurView[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BlurView[key];
    }
  });
});

var _Box = __webpack_require__(/*! ./views/Box */ "../../../snackui/src/views/Box.tsx");

Object.keys(_Box).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Box[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Box[key];
    }
  });
});

var _Button = __webpack_require__(/*! ./views/Button */ "../../../snackui/src/views/Button.tsx");

Object.keys(_Button).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Button[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Button[key];
    }
  });
});

var _Circle = __webpack_require__(/*! ./views/Circle */ "../../../snackui/src/views/Circle.tsx");

Object.keys(_Circle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Circle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Circle[key];
    }
  });
});

var _Color = __webpack_require__(/*! ./views/Color */ "../../../snackui/src/views/Color.tsx");

Object.keys(_Color).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Color[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Color[key];
    }
  });
});

var _Divider = __webpack_require__(/*! ./views/Divider */ "../../../snackui/src/views/Divider.tsx");

Object.keys(_Divider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Divider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Divider[key];
    }
  });
});

var _HoverState = __webpack_require__(/*! ./views/HoverState */ "../../../snackui/src/views/HoverState.ts");

Object.keys(_HoverState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _HoverState[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _HoverState[key];
    }
  });
});

var _Hoverable = __webpack_require__(/*! ./views/Hoverable */ "../../../snackui/src/views/Hoverable.tsx");

Object.keys(_Hoverable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Hoverable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Hoverable[key];
    }
  });
});

var _HoverablePopover = __webpack_require__(/*! ./views/HoverablePopover */ "../../../snackui/src/views/HoverablePopover.tsx");

Object.keys(_HoverablePopover).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _HoverablePopover[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _HoverablePopover[key];
    }
  });
});

var _InteractiveContainer = __webpack_require__(/*! ./views/InteractiveContainer */ "../../../snackui/src/views/InteractiveContainer.tsx");

Object.keys(_InteractiveContainer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _InteractiveContainer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _InteractiveContainer[key];
    }
  });
});

var _Grid = __webpack_require__(/*! ./views/Grid */ "../../../snackui/src/views/Grid.tsx");

Object.keys(_Grid).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Grid[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Grid[key];
    }
  });
});

var _LinearGradient = __webpack_require__(/*! ./views/LinearGradient */ "../../../snackui/src/views/LinearGradient.tsx");

Object.keys(_LinearGradient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _LinearGradient[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _LinearGradient[key];
    }
  });
});

var _LoadingItems = __webpack_require__(/*! ./views/LoadingItems */ "../../../snackui/src/views/LoadingItems.tsx");

Object.keys(_LoadingItems).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _LoadingItems[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _LoadingItems[key];
    }
  });
});

var _Modal = __webpack_require__(/*! ./views/Modal */ "../../../snackui/src/views/Modal.tsx");

Object.keys(_Modal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Modal[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Modal[key];
    }
  });
});

var _Input = __webpack_require__(/*! ./views/Input */ "../../../snackui/src/views/Input.tsx");

Object.keys(_Input).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Input[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Input[key];
    }
  });
});

var _Tooltip = __webpack_require__(/*! ./views/Tooltip */ "../../../snackui/src/views/Tooltip.tsx");

Object.keys(_Tooltip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Tooltip[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Tooltip[key];
    }
  });
});

var _Paragraph = __webpack_require__(/*! ./views/Paragraph */ "../../../snackui/src/views/Paragraph.tsx");

Object.keys(_Paragraph).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Paragraph[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Paragraph[key];
    }
  });
});

var _Popover = __webpack_require__(/*! ./views/Popover */ "../../../snackui/src/views/Popover.tsx");

Object.keys(_Popover).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Popover[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Popover[key];
    }
  });
});

var _PopoverShared = __webpack_require__(/*! ./views/PopoverShared */ "../../../snackui/src/views/PopoverShared.tsx");

Object.keys(_PopoverShared).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PopoverShared[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PopoverShared[key];
    }
  });
});

var _Form = __webpack_require__(/*! ./views/Form */ "../../../snackui/src/views/Form.tsx");

Object.keys(_Form).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Form[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Form[key];
    }
  });
});

var _Size = __webpack_require__(/*! ./views/Size */ "../../../snackui/src/views/Size.ts");

Object.keys(_Size).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Size[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Size[key];
    }
  });
});

var _Spacer = __webpack_require__(/*! ./views/Spacer */ "../../../snackui/src/views/Spacer.tsx");

Object.keys(_Spacer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Spacer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Spacer[key];
    }
  });
});

var _Stacks = __webpack_require__(/*! ./views/Stacks */ "../../../snackui/src/views/Stacks.tsx");

Object.keys(_Stacks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Stacks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Stacks[key];
    }
  });
});

var _Table = __webpack_require__(/*! ./views/Table */ "../../../snackui/src/views/Table.tsx");

Object.keys(_Table).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Table[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Table[key];
    }
  });
});

var _Text = __webpack_require__(/*! ./views/Text */ "../../../snackui/src/views/Text.tsx");

Object.keys(_Text).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Text[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Text[key];
    }
  });
});

var _TextArea = __webpack_require__(/*! ./views/TextArea */ "../../../snackui/src/views/TextArea.tsx");

Object.keys(_TextArea).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _TextArea[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _TextArea[key];
    }
  });
});

var _Title = __webpack_require__(/*! ./views/Title */ "../../../snackui/src/views/Title.tsx");

Object.keys(_Title).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Title[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Title[key];
    }
  });
});

var _Toast = __webpack_require__(/*! ./views/Toast */ "../../../snackui/src/views/Toast.tsx");

Object.keys(_Toast).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Toast[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Toast[key];
    }
  });
});

var _UnorderedList = __webpack_require__(/*! ./views/UnorderedList */ "../../../snackui/src/views/UnorderedList.tsx");

Object.keys(_UnorderedList).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _UnorderedList[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _UnorderedList[key];
    }
  });
});

var _getNode = __webpack_require__(/*! ./helpers/getNode */ "../../../snackui/src/helpers/getNode.tsx");

Object.keys(_getNode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getNode[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getNode[key];
    }
  });
});

var _themeable = __webpack_require__(/*! ./helpers/themeable */ "../../../snackui/src/helpers/themeable.tsx");

Object.keys(_themeable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _themeable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _themeable[key];
    }
  });
});

var _weakKey = __webpack_require__(/*! ./helpers/weakKey */ "../../../snackui/src/helpers/weakKey.ts");

Object.keys(_weakKey).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _weakKey[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _weakKey[key];
    }
  });
});

var _prevent = __webpack_require__(/*! ./helpers/prevent */ "../../../snackui/src/helpers/prevent.tsx");

Object.keys(_prevent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _prevent[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _prevent[key];
    }
  });
});

var _combineRefs = __webpack_require__(/*! ./helpers/combineRefs */ "../../../snackui/src/helpers/combineRefs.ts");

Object.keys(_combineRefs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _combineRefs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _combineRefs[key];
    }
  });
});

var _extendStaticConfig = __webpack_require__(/*! ./helpers/extendStaticConfig */ "../../../snackui/src/helpers/extendStaticConfig.ts");

Object.keys(_extendStaticConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _extendStaticConfig[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _extendStaticConfig[key];
    }
  });
});

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});

/***/ }),

/***/ "../../../snackui/src/views/AnimatedStack.tsx":
/*!****************************************************!*\
  !*** ../../../snackui/src/views/AnimatedStack.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AnimatedVStack = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Animated = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Animated */ "../../../../../node_modules/react-native-web/dist/exports/Animated/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _useConstant = __webpack_require__(/*! ../hooks/useConstant */ "../../../snackui/src/hooks/useConstant.ts");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const defaultAnimation = {
  from: {
    opacity: 0,
    translateY: 30
  },
  to: {
    opacity: 1,
    translateY: 0
  }
};
const styleKeys = {
  opacity: true,
  backgroundColor: true,
  borderColor: true
};

const AnimatedVStack = ({
  animateState = 'in',
  animation = defaultAnimation,
  velocity,
  children,
  ...props
}) => {
  // weird, simple, hacky fast animation for default case
  if (_constants.isWeb && animation === defaultAnimation) {
    var _props$className;

    const [isMounted, setIsMounted] = (0, _react.useState)(false);
    (0, _react.useEffect)(() => {
      setIsMounted(true);
    }, []);
    return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({}, props, {
      className: (0, _helpers.concatClassName)((props && props.className || "") + (" " + `${(_props$className = props.className) !== null && _props$className !== void 0 ? _props$className : ''} animate-in ${isMounted ? 'animate-in-mounted' : ''}`), props)
    }), children);
  }

  const driver = (0, _useConstant.useConstant)(() => {
    return new _Animated.default.Value(0);
  });
  const animatedProps = (0, _react.useMemo)(() => {
    const styleProps = {};
    const transform = [];

    for (const key in animation.from) {
      const fromVal = animation.from[key];
      const toVal = animation.to[key];
      const interpolatedVal = driver.interpolate({
        inputRange: [0, 1],
        outputRange: [fromVal, toVal]
      });

      if (styleKeys[key]) {
        styleProps[key] = interpolatedVal;
      } else {
        transform.push({
          [key]: interpolatedVal
        });
      }
    }

    return {
      transform,
      ...styleProps
    };
  }, [animateState]);
  (0, _react.useLayoutEffect)(() => {
    _Animated.default.spring(driver, {
      useNativeDriver: true,
      velocity,
      toValue: animateState === 'in' ? 1 : 0
    }).start();
  }, [animateState]);
  const childrenMemo = (0, _react.useMemo)(() => children, [children]);
  return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({
    animated: true
  }, props, animatedProps, {
    className: (0, _helpers.concatClassName)((props && props.className || "") + (" " + (animatedProps && animatedProps.className || "")), props, animatedProps)
  }), childrenMemo);
};

exports.AnimatedVStack = AnimatedVStack;

/***/ }),

/***/ "../../../snackui/src/views/BlurView.tsx":
/*!***********************************************!*\
  !*** ../../../snackui/src/views/BlurView.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BlurView = BlurView;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

function BlurView({
  children,
  borderRadius,
  fallbackBackgroundColor,
  blurRadius = 20,
  ...props
}) {
  return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({
    borderRadius: borderRadius
  }, props, {
    className: (0, _helpers.concatClassName)(props && props.className || "", props)
  }), /*#__PURE__*/_jsx("div", {
    // fallback for safari but non customizable
    className: "backdrop-filter",
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backdropFilter: `blur(${blurRadius}px)`,
      borderRadius,
      zIndex: -1,
      pointerEvents: 'none'
    }
  }), children);
}

/***/ }),

/***/ "../../../snackui/src/views/Box.tsx":
/*!******************************************!*\
  !*** ../../../snackui/src/views/Box.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Box = Box;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _extendStaticConfig = __webpack_require__(/*! ../helpers/extendStaticConfig */ "../../../snackui/src/helpers/extendStaticConfig.ts");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _cn = " _bacCol-14lw9ot _borBotLefRad-12px _borBotRigRad-12px _borTopLefRad-12px _borTopRigRad-12px _boxSha-1tpz28 _padBot-5px _padLef-5px _padRig-5px _padTop-5px ";
const defaultProps = {
  backgroundColor: '#fff',
  padding: 5,
  borderRadius: 12,
  shadowColor: 'rgba(0,0,0,0.125)',
  shadowRadius: 14,
  shadowOffset: {
    width: 0,
    height: 3
  }
};

function Box(props) {
  return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({}, props, {
    className: (0, _helpers.concatClassName)(_cn + (props && props.className || ""), props)
  }));
}

if (process.env.IS_STATIC) {
  Box.staticConfig = (0, _extendStaticConfig.extendStaticConfig)(_Stacks.VStack, {
    defaultProps
  });
}

/***/ }),

/***/ "../../../snackui/src/views/Button.tsx":
/*!*********************************************!*\
  !*** ../../../snackui/src/views/Button.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Button = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _spacedChildren = __webpack_require__(/*! ../helpers/spacedChildren */ "../../../snackui/src/helpers/spacedChildren.tsx");

var _themeable = __webpack_require__(/*! ../helpers/themeable */ "../../../snackui/src/helpers/themeable.tsx");

var _useTheme = __webpack_require__(/*! ../hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn3 = " _aliIte-center _aliSel-flexstart _borBotLefRad-8px _borBotRigRad-8px _borTopLefRad-8px _borTopRigRad-8px _cur-pointer _jusCon-center _padBot-10px _padLef-14px _padRig-14px _padTop-10px ";
const _cn2 = " _fleGro-1 _fleShr-1 _maxWid-100 _oveX-hidden _oveY-hidden";
const _cn = " _fleGro-1 _fleShr-1 _maxWid-100 _oveX-hidden _oveY-hidden ";
// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing
// TODO auto-chain
const Button = (0, _themeable.themeable)(({
  children,
  icon,
  spacing = 'sm',
  flexDirection = 'row',
  textProps,
  noTextWrap,
  theme: themeName,
  ...props
}) => {
  const theme = (0, _useTheme.useTheme)();
  const childrens = noTextWrap ? children : !children ? null : textProps ? /*#__PURE__*/_react.default.createElement(_Text.Text, Object.assign({
    color: theme.color
  }, textProps, {
    className: (0, _helpers.concatClassName)(_cn + (textProps && textProps.className || ""), textProps)
  }), children) : /*#__PURE__*/_jsx(_Text.Text, {
    color: theme.color,
    className: _cn2
  }, void 0, children);
  return /*#__PURE__*/_react.default.createElement(_Stacks.HStack, Object.assign({
    backgroundColor: theme.backgroundColorSecondary,
    hoverStyle: {
      backgroundColor: theme.backgroundColorTertiary
    },
    pressStyle: {
      backgroundColor: theme.backgroundColorSecondary
    },
    flexDirection: flexDirection
  }, props, {
    className: (0, _helpers.concatClassName)(_cn3 + (props && props.className || ""), props)
  }), (0, _spacedChildren.spacedChildren)({
    children: icon && childrens ? [/*#__PURE__*/_jsx(_react.default.Fragment, {}, 0, icon), /*#__PURE__*/_jsx(_react.default.Fragment, {}, 1, childrens)] : icon !== null && icon !== void 0 ? icon : childrens,
    spacing,
    flexDirection
  }));
}); // if (process.env.IS_STATIC) {
//   Button.staticConfig = extendStaticConfig(HStack)
// }

exports.Button = Button;

/***/ }),

/***/ "../../../snackui/src/views/Circle.tsx":
/*!*********************************************!*\
  !*** ../../../snackui/src/views/Circle.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Circle = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _cn = " _aliIte-center _borBotLefRad-1dc6fhg _borBotRigRad-11t3v3o _borTopLefRad-82gfbr _borTopRigRad-iszaty _jusCon-center _oveX-hidden _oveY-hidden ";

const Circle = ({
  size,
  ...props
}) => {
  return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({
    width: size,
    height: size
  }, props, {
    className: (0, _helpers.concatClassName)(_cn + (props && props.className || ""), props)
  }));
};

exports.Circle = Circle;

/***/ }),

/***/ "../../../snackui/src/views/Color.tsx":
/*!********************************************!*\
  !*** ../../../snackui/src/views/Color.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Color = Color;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _View = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/View */ "../../../../../node_modules/react-native-web/dist/exports/View/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

function Color(props) {
  return /*#__PURE__*/_jsx(_View.default, {
    style: {
      flex: 1,
      backgroundColor: props.of
    }
  });
}

/***/ }),

/***/ "../../../snackui/src/views/Divider.tsx":
/*!**********************************************!*\
  !*** ../../../snackui/src/views/Divider.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HorizontalLine = exports.Divider = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _View = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/View */ "../../../../../node_modules/react-native-web/dist/exports/View/index.js"));

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn5 = " _fleBas-auto _fleDir-column _fleGro-1 _fleShr-1";
const _cn4 = " _fleGro- _fleShr-";
const _cn3 = " _fleGro-1 _fleShr-1";
const _cn2 = " _fleDir-row";
const _cn = " _fleDir-column";

var _ref = /*#__PURE__*/_jsx("div", {
  className: _cn5
});

var _ref2 = /*#__PURE__*/_jsx("div", {
  className: _cn5
});

const Divider = /*#__PURE__*/(0, _react.memo)(({
  flex,
  vertical,
  height,
  width,
  opacity,
  flexLine = 10,
  backgroundColor,
  noGap,
  ...rest
}) => {
  return /*#__PURE__*/_react.default.createElement(_Stacks.HStack, Object.assign({
    width: width !== null && width !== void 0 ? width : vertical ? 1 : flex ? 'auto' : '100%',
    height: height !== null && height !== void 0 ? height : !vertical ? 1 : flex ? 'auto' : '100%'
  }, rest, {
    className: (0, _helpers.concatClassName)((vertical ? _cn : _cn2) + (" " + (flex === true ? _cn3 : _cn4)) + (" " + (rest && rest.className || "")), rest)
  }), !noGap && _ref, /*#__PURE__*/_jsx(_View.default, {
    style: {
      [vertical ? 'width' : 'height']: 1,
      flex: flexLine,
      backgroundColor: backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : 'rgba(150,150,150,0.1)',
      opacity: opacity !== null && opacity !== void 0 ? opacity : 1
    }
  }), !noGap && _ref2);
});
exports.Divider = Divider;

const HorizontalLine = () => {
  return /*#__PURE__*/_jsx(_View.default, {
    style: {
      height: 1,
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.06)'
    }
  });
};

exports.HorizontalLine = HorizontalLine;

/***/ }),

/***/ "../../../snackui/src/views/Form.tsx":
/*!*******************************************!*\
  !*** ../../../snackui/src/views/Form.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Form = Form;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Form(props) {
  if (_constants.isWeb) {
    return /*#__PURE__*/_react.default.createElement("form", Object.assign({
      action: "/login",
      method: "post"
    }, props));
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, props.children);
}

/***/ }),

/***/ "../../../snackui/src/views/Grid.tsx":
/*!*******************************************!*\
  !*** ../../../snackui/src/views/Grid.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Grid = Grid;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn2 = " _fleGro-1 _fleShr-1";
const _cn = " _aliIte-center _fleBas-auto _fleDir-row _fleWra-wrap _jusCon-center";

function Grid({
  children,
  itemMinWidth = 200,
  gap
}) {
  if (_constants.isWeb) {
    return /*#__PURE__*/_jsx("div", {
      style: {
        gap,
        display: 'grid',
        justifyContent: 'stretch',
        // gridTemplateRows: 'repeat(4, 1fr)',
        gridTemplateColumns: `repeat( auto-fit, minmax(${itemMinWidth}px, 1fr) )`
      }
    }, void 0, children);
  }

  const childrenList = _react.default.Children.toArray(children);

  return /*#__PURE__*/_jsx("div", {
    className: _cn
  }, void 0, childrenList.map((child, i) => {
    if (!child) {
      return null;
    } // index key bad


    return /*#__PURE__*/_jsx(_Stacks.HStack, {
      minWidth: itemMinWidth,
      className: _cn2
    }, i, child);
  }));
}

/***/ }),

/***/ "../../../snackui/src/views/HoverState.ts":
/*!************************************************!*\
  !*** ../../../snackui/src/views/HoverState.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isHoverEnabled = isHoverEnabled;
let isEnabled = false;

if (typeof document !== 'undefined' && !!document.body) {
  /**
   * Web browsers emulate mouse events (and hover states) after touch events.
   * This code infers when the currently-in-use modality supports hover
   * (including for multi-modality devices) and considers "hover" to be enabled
   * if a mouse movement occurs more than 1 second after the last touch event.
   * This threshold is long enough to account for longer delays between the
   * browser firing touch and mouse events on low-powered devices.
   */
  const HOVER_THRESHOLD_MS = 1000;
  let lastTouchTimestamp = 0;

  function enableHover() {
    if (isEnabled || Date.now() - lastTouchTimestamp < HOVER_THRESHOLD_MS) {
      return;
    }

    isEnabled = true;
  }

  function disableHover() {
    lastTouchTimestamp = Date.now();

    if (isEnabled) {
      isEnabled = false;
    }
  }

  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('touchmove', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);
}

function isHoverEnabled() {
  return isEnabled;
}

/***/ }),

/***/ "../../../snackui/src/views/Hoverable.tsx":
/*!************************************************!*\
  !*** ../../../snackui/src/views/Hoverable.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Hoverable = Hoverable;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

function Hoverable({
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  onHoverMove,
  children
}) {
  if (!_constants.isWeb) {
    return children;
  }

  return /*#__PURE__*/_jsx("span", {
    className: "see-through",
    onMouseEnter: onHoverIn,
    onMouseLeave: onHoverOut,
    onMouseMove: onHoverMove,
    onMouseDown: onPressIn,
    onClick: onPressOut
  }, void 0, children);
}

/***/ }),

/***/ "../../../snackui/src/views/HoverablePopover.tsx":
/*!*******************************************************!*\
  !*** ../../../snackui/src/views/HoverablePopover.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HoverablePopover = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _useDebounce = __webpack_require__(/*! ../hooks/useDebounce */ "../../../snackui/src/hooks/useDebounce.ts");

var _Hoverable = __webpack_require__(/*! ./Hoverable */ "../../../snackui/src/views/Hoverable.tsx");

var _Popover = __webpack_require__(/*! ./Popover */ "../../../snackui/src/views/Popover.tsx");

var _PopoverProps = __webpack_require__(/*! ./PopoverProps */ "../../../snackui/src/views/PopoverProps.tsx");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const HoverablePopover = ({
  children,
  allowHoverOnContent,
  contents,
  delay,
  ...props
}) => {
  var _delay;

  const [isHovering, set] = (0, _react.useState)(false);
  delay = (_delay = delay) !== null && _delay !== void 0 ? _delay : allowHoverOnContent ? 250 : 0;
  const setIsntHoveringSlow = (0, _useDebounce.useDebounce)(() => set(false), delay / 2);
  const setIsHoveringSlow = (0, _useDebounce.useDebounce)(() => set(true), delay);

  const cancelAll = () => {
    setIsHoveringSlow.cancel();
    setIsntHoveringSlow.cancel();
  };

  const setIsntHovering = () => {
    cancelAll();
    setIsntHoveringSlow();
  };

  const setIsHovering = () => {
    cancelAll();
    setIsHoveringSlow();
  };

  const popoverContent = allowHoverOnContent ? typeof contents === 'function' ? isOpen => /*#__PURE__*/_jsx(_Hoverable.Hoverable, {
    onHoverIn: setIsHovering,
    onHoverOut: setIsntHovering
  }, void 0, contents(isOpen)) : /*#__PURE__*/_jsx(_Hoverable.Hoverable, {
    onHoverIn: setIsHovering,
    onHoverOut: setIsntHovering
  }, void 0, contents) : contents;
  return /*#__PURE__*/_react.default.createElement(_Popover.Popover, Object.assign({
    isOpen: isHovering,
    overlayPointerEvents: false,
    overlay: false,
    contents: popoverContent
  }, props), /*#__PURE__*/_jsx(_Hoverable.Hoverable, {
    onHoverIn: setIsHovering,
    onHoverOut: setIsntHovering
  }, void 0, children));
};

exports.HoverablePopover = HoverablePopover;

/***/ }),

/***/ "../../../snackui/src/views/Input.tsx":
/*!********************************************!*\
  !*** ../../../snackui/src/views/Input.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Input = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _StyleSheet = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/StyleSheet */ "../../../../../node_modules/react-native-web/dist/exports/StyleSheet/index.js"));

var _TextInput = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/TextInput */ "../../../../../node_modules/react-native-web/dist/exports/TextInput/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _combineRefs = __webpack_require__(/*! ../helpers/combineRefs */ "../../../snackui/src/helpers/combineRefs.ts");

var _useTextStylePropsSplit = __webpack_require__(/*! ../hooks/useTextStylePropsSplit */ "../../../snackui/src/hooks/useTextStylePropsSplit.tsx");

var _InteractiveContainer = __webpack_require__(/*! ./InteractiveContainer */ "../../../snackui/src/views/InteractiveContainer.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Input = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var _styleProps$fontSize;

  const {
    textProps,
    styleProps
  } = (0, _useTextStylePropsSplit.useTextStylePropsSplit)(props);
  const textRef = (0, _react.useRef)();

  if (_constants.isWeb) {
    (0, _react.useLayoutEffect)(() => {
      if (props.name) {
        var _textRef$current;

        (_textRef$current = textRef.current) === null || _textRef$current === void 0 ? void 0 : _textRef$current.setAttribute('name', props.name);
      }
    }, [props.name]);
  }

  return /*#__PURE__*/_react.default.createElement(_InteractiveContainer.InteractiveContainer, styleProps, /*#__PURE__*/_react.default.createElement(_TextInput.default, Object.assign({
    ref: (0, _combineRefs.combineRefs)(textRef, ref)
  }, textProps, {
    style: [sheet.inputStyle, {
      fontSize: (_styleProps$fontSize = styleProps.fontSize) !== null && _styleProps$fontSize !== void 0 ? _styleProps$fontSize : 16,
      lineHeight: styleProps.lineHeight,
      fontWeight: styleProps.fontWeight,
      textAlign: styleProps.textAlign,
      color: styleProps.color
    }]
  })));
});
exports.Input = Input;

const sheet = _StyleSheet.default.create({
  inputStyle: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: 'rgb(100, 100, 100)'
  }
});

/***/ }),

/***/ "../../../snackui/src/views/InteractiveContainer.tsx":
/*!***********************************************************!*\
  !*** ../../../snackui/src/views/InteractiveContainer.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.InteractiveContainer = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _useTheme = __webpack_require__(/*! ../hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _cn = " _borBotLefRad-10px _borBotRigRad-10px _borBotSty-solid _borBotWid-1px _borLefSty-solid _borLefWid-1px _borRigSty-solid _borRigWid-1px _borTopLefRad-10px _borTopRigRad-10px _borTopSty-solid _borTopWid-1px _oveX-hidden _oveY-hidden ";

const InteractiveContainer = props => {
  const theme = (0, _useTheme.useTheme)();
  return /*#__PURE__*/_react.default.createElement(_Stacks.HStack, Object.assign({
    borderColor: theme.borderColor,
    hoverStyle: {
      borderColor: theme.borderColorHover
    }
  }, props, {
    className: (0, _helpers.concatClassName)(_cn + (props && props.className || ""), props)
  }));
};

exports.InteractiveContainer = InteractiveContainer;

/***/ }),

/***/ "../../../snackui/src/views/LinearGradient.tsx":
/*!*****************************************************!*\
  !*** ../../../snackui/src/views/LinearGradient.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LinearGradient = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../../../../../node_modules/react-dom/index.js");

var _View = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/View */ "../../../../../node_modules/react-native-web/dist/exports/View/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let exp = () => null; // we dont export it in the snackui-static process
// expo-linear-gradient is a flow file :/
// TODO compile it ourselves for now so we can test


if (false) {}

const LinearGradient = exp; // TODO revisit this, need a way to test so need to have this support native...
// if (process.env.IS_STATIC) {
//   // @ts-expect-error
//   LinearGradient.staticConfig = {
//     extract: (props, config) => {
//       if (config.env === 'web') {
//         const node = document.createElement('div')
//         render(<LinearGradient {...props} />, node)
//         // read styles from dom node...
//         console.log('what is', node)
//         return {
//           styles: {},
//         }
//       }
//     },
//   }
// }

exports.LinearGradient = LinearGradient;

/***/ }),

/***/ "../../../snackui/src/views/LoadingItems.tsx":
/*!***************************************************!*\
  !*** ../../../snackui/src/views/LoadingItems.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports._ref = exports._ref2 = exports.LoadingItem = exports.LoadingItemsSmall = exports.LoadingItems = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn4 = " _bacCol-lfaovh _borBotLefRad-5px _borBotRigRad-5px _borTopLefRad-5px _borTopRigRad-5px _maxWid-100";
const _cn3 = " _bacCol-1x31b7q _borBotLefRad-7px _borBotRigRad-7px _borTopLefRad-7px _borTopRigRad-7px";
const _cn2 = " _oveX-hidden _oveY-hidden _padBot-20px _padLef-20px _padRig-20px _padTop-20px shine";
const _cn = " _wid-100";

const LoadingItems = () => _ref;

exports.LoadingItems = LoadingItems;

const LoadingItemsSmall = () => _ref2; // same across all instances, less flickers


exports.LoadingItemsSmall = LoadingItemsSmall;
const seed = Math.max(3, Math.min(6, Math.round(Math.random() * 10)));

const LoadingItem = ({
  size = 'md',
  lines = 3
}) => {
  const scale = size === 'sm' ? 0.5 : size === 'lg' ? 1.75 : 1;
  return /*#__PURE__*/_jsx(_Stacks.VStack, {
    spacing: 10 * scale,
    className: _cn2
  }, void 0, /*#__PURE__*/_jsx(_Stacks.HStack, {
    width: `${seed * 12}%`,
    height: 28 * scale,
    className: _cn3
  }), /*#__PURE__*/_jsx(_Stacks.VStack, {
    spacing: 6 * scale
  }, void 0, new Array(lines).fill(0).map((_, index) => /*#__PURE__*/_jsx(_Stacks.HStack, {
    width: `${seed * (15 - (2 - index > -1 ? index : -index) * 4)}%`,
    height: 20 * scale,
    className: _cn4
  }, index))));
},
      _ref2 = /*#__PURE__*/_jsx(_Stacks.VStack, {
  spacing: "xs",
  className: _cn
}, void 0, /*#__PURE__*/_jsx(LoadingItem, {
  size: "sm"
}), /*#__PURE__*/_jsx(LoadingItem, {
  size: "sm"
}), /*#__PURE__*/_jsx(LoadingItem, {
  size: "sm"
})),
      _ref = /*#__PURE__*/_jsx(_Stacks.VStack, {
  spacing: "sm",
  className: _cn
}, void 0, /*#__PURE__*/_jsx(LoadingItem, {}), /*#__PURE__*/_jsx(LoadingItem, {}), /*#__PURE__*/_jsx(LoadingItem, {}));

exports._ref = _ref;
exports._ref2 = _ref2;
exports.LoadingItem = LoadingItem;

/***/ }),

/***/ "../../../snackui/src/views/Modal.tsx":
/*!********************************************!*\
  !*** ../../../snackui/src/views/Modal.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Modal = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Modal = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Modal */ "../../../../../node_modules/react-native-web/dist/exports/Modal/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _TouchableOpacity = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/TouchableOpacity */ "../../../../../node_modules/react-native-web/dist/exports/TouchableOpacity/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _prevent = __webpack_require__(/*! ../helpers/prevent */ "../../../snackui/src/helpers/prevent.tsx");

var _useDebounce = __webpack_require__(/*! ../hooks/useDebounce */ "../../../snackui/src/hooks/useDebounce.ts");

var _useTheme = __webpack_require__(/*! ../hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

var _AnimatedStack = __webpack_require__(/*! ./AnimatedStack */ "../../../snackui/src/views/AnimatedStack.tsx");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn3 = " _aliIte-center _borBotLefRad-20px _borBotRigRad-20px _borTopLefRad-20px _borTopRigRad-20px _boxSha-ugvrla _fleGro-1 _fleShr-1 _pos-relative ";
const _cn2 = " _bacCol-1542mo4 _fleGro-1 _fleShr-1 ";
const _cn = " _aliIte-center _bot-0px _jusCon-center _lef-0px _rig-0px _top-0px";

const Modal = props => {
  const {
    // modal specific props
    visible = true,
    animationType = 'slide',
    // keep this only for native for now
    transparent = true,
    onRequestClose,
    onShow,
    // ios specific
    presentationStyle,
    supportedOrientations,
    onDismiss,
    onOrientationChange,
    // android specific
    hardwareAccelerated,
    statusBarTranslucent,
    // overlay
    overlayBackground = 'rgba(0,0,0,0.5)',
    overlayDismisses,
    // children
    children,
    height,
    width,
    minHeight,
    minWidth,
    maxWidth,
    maxHeight,
    velocity,
    animation,
    ...rest
  } = props; // only shared between both

  const modalProps = {
    transparent,
    visible,
    onRequestClose,
    onShow,
    presentationStyle,
    supportedOrientations,
    onDismiss,
    onOrientationChange,
    hardwareAccelerated,
    statusBarTranslucent
  };

  if (_constants.isWeb) {
    const pointerEvents = visible ? 'auto' : 'none';
    const modalVisible = (0, _useDebounce.useDebounceValue)(visible, visible ? 200 : 0);
    return /*#__PURE__*/_react.default.createElement(_Modal.default, Object.assign({}, modalProps, {
      visible: modalVisible
    }), /*#__PURE__*/_react.default.createElement(_Stacks.AbsoluteVStack, {
      ref: preventFormFocusBug,
      pointerEvents: pointerEvents,
      backgroundColor: visible ? overlayBackground : 'transparent',
      onPress: overlayDismisses ? onRequestClose : undefined,
      className: _cn
    }, /*#__PURE__*/_react.default.createElement(_AnimatedStack.AnimatedVStack, {
      height,
      width,
      minHeight,
      minWidth,
      maxWidth,
      maxHeight,
      velocity,
      pointerEvents,
      animateState: modalVisible ? 'in' : 'out',
      animation
    }, /*#__PURE__*/_react.default.createElement(ModalPane, Object.assign({
      onPress: _prevent.prevent,
      pointerEvents: pointerEvents
    }, rest), children))));
  }

  return /*#__PURE__*/_react.default.createElement(_Modal.default, Object.assign({
    animationType: animationType
  }, modalProps), /*#__PURE__*/_jsx(_TouchableOpacity.default, {
    activeOpacity: 1,
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    },
    onPressOut: e => {
      var _e$nativeEvent;

      if ((_e$nativeEvent = e.nativeEvent) !== null && _e$nativeEvent !== void 0 && _e$nativeEvent.locationY) {
        onRequestClose === null || onRequestClose === void 0 ? void 0 : onRequestClose();
      }
    }
  }, void 0, /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({}, rest, {
    className: (0, _helpers.concatClassName)(_cn2 + (rest && rest.className || ""), rest)
  }), children)));
};

exports.Modal = Modal;

function ModalPane(props) {
  const theme = (0, _useTheme.useTheme)();
  return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({
    backgroundColor: theme.backgroundColor
  }, props, {
    className: (0, _helpers.concatClassName)(_cn3 + (props && props.className || ""), props)
  }));
}

function preventFormFocusBug(node) {
  for (const child of Array.from(document.body.children)) {
    if (child.contains(node)) {
      const preventFormFocusBug = e => e.stopPropagation();

      child.addEventListener('mousedown', preventFormFocusBug, true);
    }
  }
}

/***/ }),

/***/ "../../../snackui/src/views/Paragraph.tsx":
/*!************************************************!*\
  !*** ../../../snackui/src/views/Paragraph.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Paragraph = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _extendStaticConfig = __webpack_require__(/*! ../helpers/extendStaticConfig */ "../../../snackui/src/helpers/extendStaticConfig.ts");

var _getSizedTextProps = __webpack_require__(/*! ./getSizedTextProps */ "../../../snackui/src/views/getSizedTextProps.tsx");

var _Size = __webpack_require__(/*! ./Size */ "../../../snackui/src/views/Size.ts");

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Paragraph = props => {
  return /*#__PURE__*/_react.default.createElement(_Text.Text, Object.assign({}, defaultProps, (0, _getSizedTextProps.getSizedTextProps)(props), props, {
    className: (0, _helpers.concatClassName)((defaultProps && defaultProps.className || "") + (" " + (props && props.className || "")), defaultProps, props)
  }));
};

exports.Paragraph = Paragraph;
const defaultProps = {
  // TODO we need to support a more robust extraction system to support this
  // as a useTheme(). Basically would have to run SnackUI internally on itself
  // and then figure out the spreads/themes/etc, then use that in the future.
  // would open up ability to have users components static extract.
  color: _constants.isWeb ? 'var(--color)' : 'rgba(0,0,0,0.88)',
  fontWeight: '400',
  selectable: true,
  size: 'md'
};

if (process.env.IS_STATIC) {
  Paragraph.staticConfig = (0, _extendStaticConfig.extendStaticConfig)(_Text.Text, {
    defaultProps,
    expansionProps: {
      size: _getSizedTextProps.getSizedTextProps,
      sizeLineHeight: _getSizedTextProps.getSizedTextProps
    }
  });
}

/***/ }),

/***/ "../../../snackui/src/views/Popover.tsx":
/*!**********************************************!*\
  !*** ../../../snackui/src/views/Popover.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Popover = Popover;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _reactLaag = __webpack_require__(/*! react-laag */ "../../../../../node_modules/react-laag/dist/react-laag.esm.js");

var _useOverlay = __webpack_require__(/*! ../hooks/useOverlay */ "../../../snackui/src/hooks/useOverlay.tsx");

var _AnimatedStack = __webpack_require__(/*! ./AnimatedStack */ "../../../snackui/src/views/AnimatedStack.tsx");

var _PopoverProps = __webpack_require__(/*! ./PopoverProps */ "../../../snackui/src/views/PopoverProps.tsx");

var _usePopover = __webpack_require__(/*! ./usePopover */ "../../../snackui/src/views/usePopover.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

function Popover(props) {
  var _props$anchor;

  const {
    isOpen,
    isControlled,
    sendClose,
    onChangeOpenCb,
    isMounted
  } = (0, _usePopover.usePopover)(props);
  (0, _useOverlay.useOverlay)({
    isOpen: !!(isOpen && props.overlay !== false),
    onClick: () => {
      if (!isControlled) {
        sendClose();
      }

      onChangeOpenCb === null || onChangeOpenCb === void 0 ? void 0 : onChangeOpenCb(false);
    },
    pointerEvents: props.overlayPointerEvents
  });
  const placement = ((_props$anchor = props.anchor) !== null && _props$anchor !== void 0 ? _props$anchor : props.position === 'top') ? 'top-center' : props.position == 'left' ? 'left-center' : props.position === 'right' ? 'right-center' : 'bottom-center';
  const {
    layerProps,
    triggerProps,
    renderLayer
  } = (0, _reactLaag.useLayer)({
    isOpen,
    container: document.body,
    placement,
    auto: true,
    snap: false,
    triggerOffset: 12,
    containerOffset: 16,
    ResizeObserver: window['ResizeObserver']
  });

  if (!isMounted) {
    return props.children;
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", Object.assign({}, triggerProps, {
    className: `see-through-measurable ${props.inline ? 'inline-flex' : ''}`,
    style: props.style
  }), props.children), isOpen && renderLayer( /*#__PURE__*/_react.default.createElement("div", Object.assign({}, layerProps, {
    style: { ...layerProps.style,
      zIndex: 100000,
      pointerEvents: isOpen ? 'auto' : 'none',
      marginTop: isOpen ? 0 : 10,
      opacity: isOpen ? 1 : 0,
      transition: '0.2s ease-in-out'
    }
  }), /*#__PURE__*/_jsx(_AnimatedStack.AnimatedVStack, {}, void 0, typeof props.contents === 'function' ? props.contents(isOpen) : props.contents))));
}

/***/ }),

/***/ "../../../snackui/src/views/PopoverProps.tsx":
/*!***************************************************!*\
  !*** ../../../snackui/src/views/PopoverProps.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;
// force this file to stick around for webpack...
var _default = {};
exports.default = _default;

/***/ }),

/***/ "../../../snackui/src/views/PopoverShared.tsx":
/*!****************************************************!*\
  !*** ../../../snackui/src/views/PopoverShared.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.closeAllPopovers = exports.popoverCloseCbs = exports.PopoverContext = void 0;

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

const PopoverContext = /*#__PURE__*/(0, _react.createContext)({
  id: 0
});
exports.PopoverContext = PopoverContext;
const popoverCloseCbs = new Set();
exports.popoverCloseCbs = popoverCloseCbs;

const closeAllPopovers = () => {
  popoverCloseCbs.forEach(cb => cb());
  popoverCloseCbs.clear();
};

exports.closeAllPopovers = closeAllPopovers;

const handleKeyDown = e => {
  if (e.keyCode == 27) {
    // esc
    if (popoverCloseCbs.size) {
      const [first] = [...popoverCloseCbs];
      first === null || first === void 0 ? void 0 : first(false);
      popoverCloseCbs.delete(first);
      e.preventDefault();
    }
  }
};

if (typeof window !== 'undefined') {
  var _window$addEventListe, _window;

  (_window$addEventListe = (_window = window).addEventListener) === null || _window$addEventListe === void 0 ? void 0 : _window$addEventListe.call(_window, 'keydown', handleKeyDown);
}

/***/ }),

/***/ "../../../snackui/src/views/Size.ts":
/*!******************************************!*\
  !*** ../../../snackui/src/views/Size.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getSize = exports.sizes = void 0;

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

const sizes = {
  xxxxs: 0.125,
  xxxs: 0.25,
  xxs: 0.5,
  xs: 0.7,
  sm: 0.85,
  md: 1,
  lg: 1.1,
  xl: 1.32,
  xxl: 1.584,
  xxxl: 1.9,
  xxxxl: 2.28
};
exports.sizes = sizes;

const getSize = size => {
  if (typeof size === 'string') return sizes[size];
  return size !== null && size !== void 0 ? size : 1;
};

exports.getSize = getSize;

/***/ }),

/***/ "../../../snackui/src/views/Spacer.tsx":
/*!*********************************************!*\
  !*** ../../../snackui/src/views/Spacer.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Spacer = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _View = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/View */ "../../../../../node_modules/react-native-web/dist/exports/View/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const defaultProps = {
  size: 'md',
  direction: 'both'
};
const Spacer = /*#__PURE__*/(0, _react.memo)(props => {
  return /*#__PURE__*/_jsx(_View.default, {
    style: getStyle(props)
  });
});
exports.Spacer = Spacer;

const getStyle = (props = defaultProps) => {
  return {
    flexShrink: 0,
    ...getFlex(props),
    ...getSize(props)
  };
};

const getFlex = ({
  flex
} = defaultProps) => {
  return {
    flex: flex === true ? 1 : flex === false ? 0 : flex !== null && flex !== void 0 ? flex : 0
  };
};

const getSize = ({
  size = 'md',
  direction = 'both'
} = defaultProps) => {
  const sizePx = spaceToPx(size);
  const width = direction == 'vertical' ? 1 : sizePx;
  const height = direction == 'horizontal' ? 1 : sizePx;
  return {
    minWidth: width,
    minHeight: height
  };
};

if (process.env.IS_STATIC) {
  Spacer['staticConfig'] = {
    validStyles: __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts").stylePropsView,
    defaultProps: getStyle(),
    expansionProps: {
      direction: () => null,
      flex: getFlex,
      size: getSize
    }
  };
}

function spaceToPx(space) {
  if (space == 'xxs') return 2;
  if (space == 'xs') return 4;
  if (space == 'sm') return 8;
  if (space === 'md' || space === true) return 12;
  if (space == 'lg') return 16;
  if (space == 'xl') return 24;
  if (space == 'xxl') return 36;
  if (space == 'xxxl') return 48;
  if (typeof space === 'number') return space;
  if (typeof space === 'string') return space;
  return 0;
}

/***/ }),

/***/ "../../../snackui/src/views/Stacks.tsx":
/*!*********************************************!*\
  !*** ../../../snackui/src/views/Stacks.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VStack = exports.HStack = exports.AbsoluteVStack = void 0;

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Animated = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Animated */ "../../../../../node_modules/react-native-web/dist/exports/Animated/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _TouchableOpacity = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/TouchableOpacity */ "../../../../../node_modules/react-native-web/dist/exports/TouchableOpacity/index.js"));

var _View = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/View */ "../../../../../node_modules/react-native-web/dist/exports/View/index.js"));

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _combineRefs = __webpack_require__(/*! ../helpers/combineRefs */ "../../../snackui/src/helpers/combineRefs.ts");

var _extendStaticConfig = __webpack_require__(/*! ../helpers/extendStaticConfig */ "../../../snackui/src/helpers/extendStaticConfig.ts");

var _spacedChildren = __webpack_require__(/*! ../helpers/spacedChildren */ "../../../snackui/src/helpers/spacedChildren.tsx");

var _useTheme = __webpack_require__(/*! ../hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

var _Spacer = __webpack_require__(/*! ./Spacer */ "../../../snackui/src/views/Spacer.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const fullscreenStyle = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
const disabledStyle = {
  pointerEvents: 'none',
  userSelect: 'none'
}; // somewhat optimized to avoid object creation

const useViewStylePropsSplit = props => {
  const activeTheme = (0, _react.useContext)(_useTheme.ActiveThemeContext);
  return (0, _react.useMemo)(() => {
    let styleProps = null;
    let viewProps = null;

    for (const key in props) {
      const val = props[key];

      if (_helpers.stylePropsView[key]) {
        var _invertStyleVariableT, _invertStyleVariableT2;

        styleProps = styleProps || {};
        styleProps[key] = activeTheme ? (_invertStyleVariableT = (_invertStyleVariableT2 = _useTheme.invertStyleVariableToValue[activeTheme.name]) === null || _invertStyleVariableT2 === void 0 ? void 0 : _invertStyleVariableT2[val]) !== null && _invertStyleVariableT !== void 0 ? _invertStyleVariableT : val : val;
      }
    }

    if (styleProps) {
      if (styleProps.shadowColor !== props.shadowColor && typeof styleProps.shadowOpacity !== 'undefined') {
        styleProps.shadowColor = props.shadowColor;
      }
    } // only if we have to, split out props


    if (styleProps) {
      viewProps = viewProps || {};

      for (const key in props) {
        if (key in styleProps) continue;
        viewProps[key] = props[key];
      }
    }

    return [viewProps || props, styleProps];
  }, [props, activeTheme]);
};

const mouseUps = new Set();

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach(x => x());
    mouseUps.clear();
  });
}

const createStack = defaultProps => {
  const component = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
    const {
      children,
      animated,
      fullscreen,
      pointerEvents,
      style = null,
      pressStyle = null,
      onPress,
      onPressIn,
      onPressOut,
      hoverStyle = null,
      focusStyle,
      // TODO
      onHoverIn,
      onHoverOut,
      spacing,
      className,
      disabled,
      // @ts-ignore
      onMouseEnter,
      // @ts-ignore
      onMouseLeave
    } = props;
    const [viewProps, styleProps] = useViewStylePropsSplit(props);
    const innerRef = (0, _react.useRef)();
    const isMounted = (0, _react.useRef)(false);
    (0, _react.useEffect)(() => {
      return () => {
        mouseUps.delete(unPress);
        isMounted.current = false;
      };
    }, []);
    const [state, set] = (0, _react.useState)({
      hover: false,
      press: false,
      pressIn: false
    });
    const childrenWithSpacing = (0, _react.useMemo)(() => (0, _spacedChildren.spacedChildren)({
      children,
      spacing,
      flexDirection: defaultProps === null || defaultProps === void 0 ? void 0 : defaultProps.flexDirection
    }), [spacing, children]);
    const ViewComponent = animated ? _Animated.default.View : _View.default;

    let content = /*#__PURE__*/_react.default.createElement(ViewComponent, Object.assign({
      ref: (0, _combineRefs.combineRefs)(innerRef, ref)
    }, viewProps, {
      // @ts-ignore
      className: className,
      pointerEvents: !_constants.isWeb && pointerEvents === 'none' ? 'box-none' : pointerEvents,
      style: [defaultProps, fullscreen ? fullscreenStyle : null, styleProps, style, state.hover ? hoverStyle : null, state.press ? pressStyle : null, disabled ? disabledStyle : null, _constants.isWeb || !styleProps ? null : fixNativeShadow(styleProps)]
    }), childrenWithSpacing);

    const attachPress = !!(pressStyle || onPress);
    const attachHover = !!(hoverStyle || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave);
    const unPress = (0, _react.useCallback)(() => {
      if (!isMounted.current) return;
      set(x => ({ ...x,
        press: false,
        pressIn: false
      }));
    }, []);

    if (attachHover || attachPress || onPressOut || onPressIn) {
      const events = {
        onMouseEnter: attachHover || attachPress ? e => {
          let next = {};

          if (attachHover) {
            next.hover = true;
          }

          if (state.pressIn) {
            next.press = true;
          }

          if (Object.keys(next).length) {
            set({ ...state,
              ...next
            });
          }

          if (attachHover) {
            onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn(e);
            onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(e);
          }
        } : null,
        onMouseLeave: attachHover || attachPress ? e => {
          let next = {};
          mouseUps.add(unPress);

          if (attachHover) {
            next.hover = false;
          }

          if (state.pressIn) {
            next.press = false;
            next.pressIn = false;
          }

          if (Object.keys(next).length) {
            set({ ...state,
              ...next
            });
          }

          if (attachHover) {
            onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut(e);
            onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(e);
          }
        } : null,
        onMouseDown: attachPress ? e => {
          e.preventDefault();
          set({ ...state,
            press: true,
            pressIn: true
          });
          onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(e);
        } : onPressIn,
        onClick: attachPress ? e => {
          e.preventDefault();
          set({ ...state,
            press: false,
            pressIn: false
          });
          onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut(e);
          onPress === null || onPress === void 0 ? void 0 : onPress(e);
        } : onPressOut
      };

      if (_constants.isWeb) {
        content = /*#__PURE__*/_react.default.cloneElement(content, events);
      } else {
        if (pointerEvents !== 'none' && !!(onPress || onPressOut)) {
          content = /*#__PURE__*/_jsx(_TouchableOpacity.default, {
            onPress: e => {
              // @ts-ignore
              events.onClick(e);
            },
            onPressIn: events.onMouseDown,
            style: styleProps ? {
              zIndex: styleProps.zIndex,
              width: styleProps.width,
              height: styleProps.height,
              position: styleProps.position
            } : null
          }, void 0, content);
        }
      }
    }

    return content;
  });

  if (process.env.IS_STATIC) {
    // @ts-expect-error
    component.staticConfig = {
      validStyles: _helpers.stylePropsView,
      defaultProps,
      expansionProps: {
        fullscreen: fullscreenStyle,
        disabled: disabledStyle,
        shadowColor: fixNativeShadow,
        contain: ({
          contain
        }) => ({
          contain
        })
      }
    };
  }

  return component;
};

const defaultShadowOffset = {
  width: 0,
  height: 0
};
const matchRgba = /rgba\(\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*\)$/;

function fixNativeShadow(props) {
  let res;

  if ('shadowColor' in props) {
    res = {
      shadowColor: props.shadowColor
    };

    if (!('shadowOffset' in props)) {
      res.shadowOffset = defaultShadowOffset;
    }

    if (!('shadowOpacity' in props)) {
      res.shadowOpacity = 1;
      const color = String(props.shadowColor).trim();
      res = res || {};

      if (color[0] === 'r' && color[3] === 'a') {
        var _color$match;

        const [_, r, g, b, a] = (_color$match = color.match(matchRgba)) !== null && _color$match !== void 0 ? _color$match : [];

        if (typeof a !== 'string') {
          console.warn('non valid rgba', color);
          return res;
        }

        res.shadowColor = `rgb(${r},${g},${b})`;
        res.shadowOpacity = +a;
      } else {
        res.shadowOpacity = 1;
      }
    }
  }

  return res;
}

const AbsoluteVStack = createStack({
  position: 'absolute',
  flexDirection: 'column',
  flexBasis: 'auto'
});
exports.AbsoluteVStack = AbsoluteVStack;
const HStack = createStack({
  flexDirection: 'row',
  flexBasis: 'auto'
});
exports.HStack = HStack;
const VStack = createStack({
  flexDirection: 'column',
  flexBasis: 'auto'
});
exports.VStack = VStack;

/***/ }),

/***/ "../../../snackui/src/views/Table.tsx":
/*!********************************************!*\
  !*** ../../../snackui/src/views/Table.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TableCell = TableCell;
exports.TableHeadText = exports.TableHeadRow = exports.TableRow = exports.Table = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _extendStaticConfig = __webpack_require__(/*! ../helpers/extendStaticConfig */ "../../../snackui/src/helpers/extendStaticConfig.ts");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn4 = " _bacCol-1x31b7q _borBotLefRad-10px _borBotRigRad-10px _borTopLefRad-10px _borTopRigRad-10px _fonSiz-12px _marLef--8px _maxWid-100 _oveX-hidden _oveY-hidden _padBot-2px _padLef-8px _padRig-8px _padTop-2px ";
const _cn3 = " _aliSel-stretch _borBotCol-1fn3lry _borBotSty-solid _borBotWid-2px _fleGro-1 _fleShr-1 ";
const _cn2 = " _aliIte-center _aliSel-stretch _fleGro-1 _fleShr-1 _padBot-4px _padLef-4px _padRig-4px _padTop-4px ";
const _cn = " _aliSel-stretch _fleGro-1 _fleShr-1 ";

const Table = props => /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({}, props, {
  className: (0, _helpers.concatClassName)(props && props.className || "", props)
}));

exports.Table = Table;

if (process.env.IS_STATIC) {
  Table.staticConfig = (0, _extendStaticConfig.extendStaticConfig)(_Stacks.VStack, {});
}

const tableRowDefaultProps = {
  alignSelf: 'stretch',
  flex: 1
};

const TableRow = props => /*#__PURE__*/_react.default.createElement(_Stacks.HStack, Object.assign({}, props, {
  className: (0, _helpers.concatClassName)(_cn + (props && props.className || ""), props)
}));

exports.TableRow = TableRow;

if (process.env.IS_STATIC) {
  TableRow.staticConfig = (0, _extendStaticConfig.extendStaticConfig)(_Stacks.HStack, {
    defaultProps: tableRowDefaultProps
  });
}

function TableCell({
  color,
  fontSize,
  fontWeight,
  fontStyle,
  fontFamily,
  textAlign,
  fontVariant,
  selectable,
  ellipse,
  children,
  lineHeight,
  ...props
}) {
  return /*#__PURE__*/_react.default.createElement(_Stacks.HStack, Object.assign({}, props, {
    className: (0, _helpers.concatClassName)(_cn2 + (props && props.className || ""), props)
  }), typeof children === 'string' ? /*#__PURE__*/_jsx(_Text.Text, {
    color: color,
    fontSize: fontSize,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    fontFamily: fontFamily,
    fontVariant: fontVariant,
    textAlign: textAlign,
    selectable: selectable,
    ellipse: ellipse,
    lineHeight: lineHeight
  }, void 0, children) : children);
}

const tableHeadRowDefaultProps = {
  alignSelf: 'stretch',
  flex: 1,
  borderBottomColor: '#eee',
  borderBottomWidth: 2
};

const TableHeadRow = props => /*#__PURE__*/_react.default.createElement(_Stacks.HStack, Object.assign({}, props, {
  className: (0, _helpers.concatClassName)(_cn3 + (props && props.className || ""), props)
}));

exports.TableHeadRow = TableHeadRow;

if (process.env.IS_STATIC) {
  TableHeadRow.staticConfig = (0, _extendStaticConfig.extendStaticConfig)(_Stacks.HStack, {
    defaultProps: tableHeadRowDefaultProps
  });
}

const tableHeadTextDefaultProps = {
  backgroundColor: 'rgba(0,0,0,0.05)',
  padding: 2,
  paddingHorizontal: 8,
  marginLeft: -8,
  borderRadius: 10,
  maxWidth: '100%',
  ellipse: true,
  fontSize: 12
};

const TableHeadText = props => /*#__PURE__*/_react.default.createElement(_Text.Text, Object.assign({}, props, {
  className: (0, _helpers.concatClassName)(_cn4 + (props && props.className || ""), props)
}));

exports.TableHeadText = TableHeadText;

if (process.env.IS_STATIC) {
  TableHeadText.staticConfig = (0, _extendStaticConfig.extendStaticConfig)(_Text.Text, {
    defaultProps: tableHeadTextDefaultProps
  });
}

/***/ }),

/***/ "../../../snackui/src/views/Text.tsx":
/*!*******************************************!*\
  !*** ../../../snackui/src/views/Text.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useTextStyle = exports.Text = void 0;

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Platform = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Platform */ "../../../../../node_modules/react-native-web/dist/exports/Platform/index.js"));

var _Text = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/Text */ "../../../../../node_modules/react-native-web/dist/exports/Text/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const defaultStyle = {
  // inline-block fixed transforms not working on web
  // but inline is necessary for text nesting (italic, bold etc)
  display: 'inline' // color: 'var(--color)',

};
const selectableStyle = {
  userSelect: 'text'
};
const ellipseStyle = {
  display: 'inline-block',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};
const Text = /*#__PURE__*/(0, _react.memo)(allProps => {
  const [props, style] = useTextStyle(allProps, false, true);
  return /*#__PURE__*/_react.default.createElement(_Text.default, Object.assign({}, props, {
    style: [isWeb ? defaultStyle : null, style, props['style']]
  }));
});
exports.Text = Text;

if (process.env.IS_STATIC) {
  // @ts-ignore
  Text.staticConfig = {
    isText: true,
    validStyles: _helpers.stylePropsText,
    defaultProps: defaultStyle,
    expansionProps: {
      selectable: selectableStyle,
      ellipse: ellipseStyle
    }
  };
}

const isWeb = _Platform.default.OS === 'web';
const webOnlySpecificStyleKeys = {
  userSelect: true,
  textOverflow: true,
  whiteSpace: true,
  wordWrap: true,
  selectable: true
};
const webOnlyProps = {
  className: true
};
const webOnlyStyleKeys = {
  hoverStyle: true,
  pressStyle: true,
  cursor: true
};
const textSpecificProps = {
  allowFontScaling: true,
  ellipsizeMode: true,
  lineBreakMode: true,
  numberOfLines: true,
  maxFontSizeMultiplier: true
};
const testProps = {
  all: { ...textSpecificProps,
    ..._helpers.stylePropsText,
    ...webOnlySpecificStyleKeys,
    ...webOnlyStyleKeys
  },
  specific: { ...webOnlyStyleKeys,
    ...webOnlySpecificStyleKeys,
    ...textSpecificProps,
    ..._helpers.stylePropsTextOnly
  }
};
const emptyObj = Object.freeze({});

const useTextStyle = (allProps, onlyTextSpecificStyle, memo) => {
  const styleKeys = onlyTextSpecificStyle ? testProps.specific : testProps.all;

  if (memo) {
    return (0, _react.useMemo)(() => getTextStyle(allProps, styleKeys), [allProps]);
  }

  return getTextStyle(allProps, styleKeys);
}; // somewhat optimized to avoid creating objects unless necessary


exports.useTextStyle = useTextStyle;

const getTextStyle = (allProps, styleKeys) => {
  let props = null;
  let style = null;

  for (const key in allProps) {
    if (styleKeys[key]) {
      // if should skip
      if (isWeb) {
        const val = allProps[key];

        if (key === 'display' && val === 'inline') {
          continue;
        }

        if (val === 'inherit') {
          continue;
        }
      } else {
        if (webOnlyStyleKeys[key] || webOnlyProps[key]) {
          continue;
        }
      } // if converting to a prop


      if (!isWeb) {
        if (key === 'ellipse') {
          props = props || {};
          props['numberOfLines'] = 1;
          props['lineBreakMode'] = 'clip';
          continue;
        }
      }

      style = style || {}; // style values

      if (key === 'selectable') {
        Object.assign(style, selectableStyle);
        continue;
      }

      if (key === 'ellipse') {
        Object.assign(style, ellipseStyle);
        continue;
      }

      const val = allProps[key];

      if (!isWeb) {
        if (key === 'fontSize' && val < 12) {
          style.fontSize = 12;
          continue;
        }
      }

      style[key] = val;
    }
  }

  if (style) {
    props = props || {};

    for (const key in allProps) {
      if (key in style) continue;
      props[key] = allProps[key];
    }
  }

  return [props || allProps, style || emptyObj];
};

/***/ }),

/***/ "../../../snackui/src/views/TextArea.tsx":
/*!***********************************************!*\
  !*** ../../../snackui/src/views/TextArea.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextArea = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _StyleSheet = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/StyleSheet */ "../../../../../node_modules/react-native-web/dist/exports/StyleSheet/index.js"));

var _TextInput = _interopRequireDefault(__webpack_require__(/*! react-native-web/dist/exports/TextInput */ "../../../../../node_modules/react-native-web/dist/exports/TextInput/index.js"));

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _useTextStylePropsSplit = __webpack_require__(/*! ../hooks/useTextStylePropsSplit */ "../../../snackui/src/hooks/useTextStylePropsSplit.tsx");

var _InteractiveContainer = __webpack_require__(/*! ./InteractiveContainer */ "../../../snackui/src/views/InteractiveContainer.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TextArea = props => {
  const {
    textProps,
    styleProps
  } = (0, _useTextStylePropsSplit.useTextStylePropsSplit)(props);
  return /*#__PURE__*/_react.default.createElement(_InteractiveContainer.InteractiveContainer, styleProps, /*#__PURE__*/_react.default.createElement(_TextInput.default, Object.assign({
    multiline: true,
    numberOfLines: 4
  }, textProps, {
    style: [sheet.inputStyle, {
      fontSize: styleProps.fontSize,
      lineHeight: styleProps.lineHeight,
      fontWeight: styleProps.fontWeight,
      textAlign: styleProps.textAlign
    }]
  })));
};

exports.TextArea = TextArea;

const sheet = _StyleSheet.default.create({
  inputStyle: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: 'rgb(100, 100, 100)'
  }
});

/***/ }),

/***/ "../../../snackui/src/views/Title.tsx":
/*!********************************************!*\
  !*** ../../../snackui/src/views/Title.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.Title = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _useTheme = __webpack_require__(/*! ../hooks/useTheme */ "../../../snackui/src/hooks/useTheme.tsx");

var _Paragraph = __webpack_require__(/*! ./Paragraph */ "../../../snackui/src/views/Paragraph.tsx");

var _Size = __webpack_require__(/*! ./Size */ "../../../snackui/src/views/Size.ts");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _cn = " _fonSiz-16px _fonWei-300 _linHei-18px _marBot-144px _marTop-144px ";

// TODO can static extract once paragraph works
const Title = props => {
  var _props$size;

  const size = (0, _Size.getSize)((_props$size = props.size) !== null && _props$size !== void 0 ? _props$size : 'md') * 1.5;
  return /*#__PURE__*/_react.default.createElement(_Paragraph.Paragraph, Object.assign({}, props, {
    size: size,
    className: (0, _helpers.concatClassName)(_cn + (props && props.className || ""), props)
  }));
};

exports.Title = Title;

const H1 = props => /*#__PURE__*/_react.default.createElement(Title, Object.assign({
  accessibilityRole: "header",
  size: "xl"
}, props));

exports.H1 = H1;

const H2 = props => /*#__PURE__*/_react.default.createElement(Title, Object.assign({
  accessibilityRole: "header",
  size: "md"
}, props));

exports.H2 = H2;

const H3 = props => {
  const theme = (0, _useTheme.useTheme)();
  return /*#__PURE__*/_react.default.createElement(Title, Object.assign({
    accessibilityRole: "header",
    size: "xs",
    fontWeight: "800",
    color: theme.colorTertiary
  }, props));
};

exports.H3 = H3;

const H4 = props => /*#__PURE__*/_react.default.createElement(Title, Object.assign({
  textTransform: "uppercase",
  accessibilityRole: "header",
  size: "xxs",
  color: "rgba(0,0,0,0.7)"
}, props));

exports.H4 = H4;

const H5 = props => /*#__PURE__*/_react.default.createElement(Title, Object.assign({
  accessibilityRole: "header",
  size: "xxs",
  color: "rgba(0,0,0,0.7)"
}, props));

exports.H5 = H5;

/***/ }),

/***/ "../../../snackui/src/views/Toast.tsx":
/*!********************************************!*\
  !*** ../../../snackui/src/views/Toast.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ToastRoot = exports.Toast = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../../../../../node_modules/react-dom/index.js");

var _constants = __webpack_require__(/*! ../constants */ "../../../snackui/src/constants.ts");

var _useForceUpdate = __webpack_require__(/*! ../hooks/useForceUpdate */ "../../../snackui/src/hooks/useForceUpdate.ts");

var _AnimatedStack = __webpack_require__(/*! ./AnimatedStack */ "../../../snackui/src/views/AnimatedStack.tsx");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn5 = " _col-jwli3a";
const _cn4 = " _col-cqee49";
const _cn3 = " _dis-inline _fonSiz-18px _fonWei-600 ";
const _cn2 = " _borBotLefRad-12px _borBotRigRad-12px _borTopLefRad-12px _borTopRigRad-12px _boxSha-1lpexh _padBot-12px _padLef-18px _padRig-18px _padTop-12px";
const _cn = " _aliIte-center _bot-0px _fleBas-auto _fleDir-column _jusCon-flex-end _lef-0px _padBot-5 _padLef-5 _padRig-5 _padTop-5 _poiEve-none _pos-absolute _rig-0px _top-0px _zInInd-1l9bvml";

let show = text => {
  console.warn('NO SHOW', text);
};

const Toast = {
  show: (text, options) => show(text, options),
  error: (text, options) => show(text, { ...options,
    type: 'error'
  }),
  success: (text, options) => show(text, { ...options,
    type: 'success'
  })
};
exports.Toast = Toast;

if (typeof window !== 'undefined') {
  window['Toast'] = Toast;
}

const ToastRoot = /*#__PURE__*/(0, _react.memo)(function ToastRoot() {
  const forceUpdate = (0, _useForceUpdate.useForceUpdate)();
  const stateRef = (0, _react.useRef)({
    show: false,
    text: '',
    type: 'info',
    timeout: null
  });

  const setState = x => {
    stateRef.current = x;
    forceUpdate();
  };

  (0, _react.useEffect)(() => {
    return () => {
      var _stateRef$current$tim;

      clearTimeout((_stateRef$current$tim = stateRef.current.timeout) !== null && _stateRef$current$tim !== void 0 ? _stateRef$current$tim : 0);
    };
  }, []);
  show = (0, _react.useCallback)((text, {
    duration = 3000,
    type = 'info'
  } = {}) => {
    var _stateRef$current$tim2;

    clearTimeout((_stateRef$current$tim2 = stateRef.current.timeout) !== null && _stateRef$current$tim2 !== void 0 ? _stateRef$current$tim2 : 0);
    const timeout = setTimeout(() => {
      setState({
        show: false,
        text: '',
        type,
        timeout: null
      });
    }, duration);
    setState({
      show: true,
      text,
      type,
      timeout
    });
  }, [stateRef]);
  const state = stateRef.current;

  const contents = /*#__PURE__*/_jsx("div", {
    className: _cn
  }, void 0, state.show && !!state.text && /*#__PURE__*/_jsx(_AnimatedStack.AnimatedVStack, {}, void 0, /*#__PURE__*/_jsx(_Stacks.VStack, {
    backgroundColor: // TODO theme
    state.type === 'info' ? 'rgba(100, 140, 100, 0.95)' : state.type === 'success' ? 'rgba(20,180,120,0.95)' : 'rgba(190,60,60, 0.95)',
    className: _cn2
  }, void 0, /*#__PURE__*/_jsx("span", {
    className: (0, _helpers.concatClassName)(_cn3 + (state.type === 'info' ? _cn4 : _cn5))
  }, void 0, state.text))));

  const portalEl = document.getElementById('toasts');

  if (_constants.isWeb && portalEl) {
    return /*#__PURE__*/(0, _reactDom.createPortal)(contents, portalEl);
  }

  return contents;
});
exports.ToastRoot = ToastRoot;

/***/ }),

/***/ "../../../snackui/src/views/Tooltip.tsx":
/*!**********************************************!*\
  !*** ../../../snackui/src/views/Tooltip.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Tooltip = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _Box = __webpack_require__(/*! ./Box */ "../../../snackui/src/views/Box.tsx");

var _HoverablePopover = __webpack_require__(/*! ./HoverablePopover */ "../../../snackui/src/views/HoverablePopover.tsx");

var _PopoverProps = __webpack_require__(/*! ./PopoverProps */ "../../../snackui/src/views/PopoverProps.tsx");

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn2 = " _col-jwli3a _dis-inline _fonSiz-13px";
const _cn = " _bacCol-kemksi _borBotLefRad-1000px _borBotRigRad-1000px _borTopLefRad-1000px _borTopRigRad-1000px _boxSha-1tpz28 _fleBas-auto _fleDir-column _padBot-5px _padLef-9px _padRig-9px _padTop-5px";

const Tooltip = ({
  contents,
  ...props
}) => {
  return /*#__PURE__*/_react.default.createElement(_HoverablePopover.HoverablePopover, Object.assign({
    noArrow: true,
    delay: 200,
    contents: /*#__PURE__*/_jsx("div", {
      className: _cn
    }, void 0, /*#__PURE__*/_jsx("span", {
      className: _cn2
    }, void 0, contents))
  }, props));
};

exports.Tooltip = Tooltip;

/***/ }),

/***/ "../../../snackui/src/views/UnorderedList.tsx":
/*!****************************************************!*\
  !*** ../../../snackui/src/views/UnorderedList.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UnorderedListItem = exports.UnorderedList = void 0;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _getSizedTextProps = __webpack_require__(/*! ./getSizedTextProps */ "../../../snackui/src/views/getSizedTextProps.tsx");

var _Size = __webpack_require__(/*! ./Size */ "../../../snackui/src/views/Size.ts");

var _Stacks = __webpack_require__(/*! ./Stacks */ "../../../snackui/src/views/Stacks.tsx");

var _Text = __webpack_require__(/*! ./Text */ "../../../snackui/src/views/Text.tsx");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn3 = " _fleGro-1 _fleShr-1 ";
const _cn2 = " _fleBas-auto _fleDir-row _marBot-4px _marTop-4px";
const _cn = " _padLef-20px ";

const UnorderedList = props => {
  return /*#__PURE__*/_react.default.createElement(_Stacks.VStack, Object.assign({}, props, {
    className: (0, _helpers.concatClassName)(_cn + (props && props.className || ""), props)
  }));
};

exports.UnorderedList = UnorderedList;

const UnorderedListItem = ({
  children,
  ...props
}) => {
  const {
    fontSize = 14,
    lineHeight
  } = (0, _getSizedTextProps.getSizedTextProps)(props);
  return /*#__PURE__*/_jsx("div", {
    className: _cn2
  }, void 0, /*#__PURE__*/_react.default.createElement(_Text.Text, Object.assign({}, props, {
    fontSize: fontSize * 2,
    lineHeight: fontSize * 1.333,
    className: (0, _helpers.concatClassName)(props && props.className || "", props)
  }), `\u2022`), /*#__PURE__*/_react.default.createElement(_Text.Text, Object.assign({
    paddingLeft: fontSize * 0.5,
    fontSize: fontSize,
    lineHeight: lineHeight
  }, props, {
    className: (0, _helpers.concatClassName)(_cn3 + (props && props.className || ""), props)
  }), children));
};

exports.UnorderedListItem = UnorderedListItem;

/***/ }),

/***/ "../../../snackui/src/views/getSizedTextProps.tsx":
/*!********************************************************!*\
  !*** ../../../snackui/src/views/getSizedTextProps.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getSizedTextProps = void 0;

var _index = __webpack_require__(/*! react-native-web/dist/index */ "../../../../../node_modules/react-native-web/dist/index.js");

var _Size = __webpack_require__(/*! ./Size */ "../../../snackui/src/views/Size.ts");

// experiment doing smaller for touch, but fails with static extration..
// const isSmallDevice = isNative || (supportsTouchWeb && defaultSmall)
// const scale = isSmallDevice ? 0.9 : 1
const getSizedTextProps = ({
  size = 1,
  sizeLineHeight = 1
}) => {
  const sizeAmt = (0, _Size.getSize)(size); // get a little less spaced as we go higher

  const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.55;
  const lineHeight = Math.round((26 + lineHeightScaleWithSize) * sizeAmt * sizeLineHeight);
  return {
    fontSize: Math.round(16 * sizeAmt),
    lineHeight,
    marginVertical: -lineHeight * 0.08
  };
};

exports.getSizedTextProps = getSizedTextProps;

/***/ }),

/***/ "../../../snackui/src/views/usePopover.tsx":
/*!*************************************************!*\
  !*** ../../../snackui/src/views/usePopover.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.usePopover = void 0;

var _async = __webpack_require__(/*! @dish/async */ "../../../../../packages/async/src/index.ts");

var _react = __webpack_require__(/*! react */ "../../../../../node_modules/react/index.js");

var _PopoverProps = __webpack_require__(/*! ./PopoverProps */ "../../../snackui/src/views/PopoverProps.tsx");

var _PopoverShared = __webpack_require__(/*! ./PopoverShared */ "../../../snackui/src/views/PopoverShared.tsx");

const usePopover = props => {
  var _props$isOpen, _props$mountImmediate;

  const isOpen = (_props$isOpen = props.isOpen) !== null && _props$isOpen !== void 0 ? _props$isOpen : false;
  const onChangeOpenCb = (0, _react.useCallback)(props.onChangeOpen, [props.onChangeOpen]);
  const closeCb = (0, _react.useRef)(null);
  const isControlled = typeof isOpen !== 'undefined';
  const [isMounted, setIsMounted] = (0, _react.useState)((_props$mountImmediate = props.mountImmediately) !== null && _props$mountImmediate !== void 0 ? _props$mountImmediate : false);

  const sendClose = () => {
    var _closeCb$current;

    return (_closeCb$current = closeCb.current) === null || _closeCb$current === void 0 ? void 0 : _closeCb$current.call(closeCb);
  };

  (0, _react.useEffect)(() => {
    if (isMounted) {
      return;
    }

    return (0, _async.series)([_async.fullyIdle, () => setIsMounted(true)]);
  }, []);
  (0, _react.useLayoutEffect)(() => {
    if (onChangeOpenCb) {
      _PopoverShared.popoverCloseCbs.add(onChangeOpenCb);

      return () => {
        _PopoverShared.popoverCloseCbs.delete(onChangeOpenCb);
      };
    }
  }, [onChangeOpenCb]);
  return {
    isOpen,
    isControlled,
    sendClose,
    isMounted,
    onChangeOpenCb
  };
};

exports.usePopover = usePopover;

/***/ }),

/***/ "../../../../../node_modules/css-loader/dist/cjs.js!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx":
/*!*********************************************************************************************************************************!*\
  !*** ../../../../../node_modules/css-loader/dist/cjs.js!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx ***!
  \*********************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "../../../../../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "._dis-inline{display:inline;}\n._fleBas-auto{-ms-flex-preferred-size:auto;-webkit-flex-basis:auto;flex-basis:auto;}\n._fleDir-column{-ms-flex-direction:column;-webkit-box-direction:normal;-webkit-box-orient:vertical;-webkit-flex-direction:column;flex-direction:column;}\n@media screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._bacCol-_sm_1g6456j{background-color:rgba(255,0,0,1.00);} }\n@media not screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._bacCol-_sm0_1542mo4{background-color:rgba(0,128,0,1.00);} }\n@media screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._padRig-_sm_10px{padding-right:10px;} }\n@media not screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._padRig-_sm0_0px{padding-right:0px;} }\n@media screen and (max-width: 660px) { :root:root:root:root:root:root:root:root:root:root:root:root ._borTopSty-_xs_solid{border-top-style:solid;} }\n@media screen and (max-width: 660px) { :root:root:root:root:root:root:root:root:root:root:root:root ._borTopWid-_xs_1px{border-top-width:1px;} }\n._borRigSty-solid{border-right-style:solid;}\n._borRigWid-1px{border-right-width:1px;}\n._borRigWid-0px{border-right-width:0px;}\n@media screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._borLefSty-_sm_solid{border-left-style:solid;} }\n@media screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._borLefWid-_sm_1px{border-left-width:1px;} }\n@media not screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._borLefSty-_sm0_solid{border-left-style:solid;} }\n@media not screen and (max-width: 860px) { :root:root:root:root:root:root:root:root:root:root ._borLefWid-_sm0_0px{border-left-width:0px;} }\n._bacCol-1g6456j{background-color:rgba(255,0,0,1.00);}\n._borBotLefRad-100px{border-bottom-left-radius:100px;}\n._borBotRigRad-100px{border-bottom-right-radius:100px;}\n._borTopLefRad-100px{border-top-left-radius:100px;}\n._borTopRigRad-100px{border-top-right-radius:100px;}\n._boxSha-1xz9bc3{box-shadow:0px 0px 10px rgba(0,0,0,1.00);}\n._fleGro-1{-ms-flex-positive:1;-webkit-box-flex:1;-webkit-flex-grow:1;flex-grow:1;}\n._fleShr-1{-ms-flex-negative:1;-webkit-flex-shrink:1;flex-shrink:1;}\n._oveX-hidden{overflow-x:hidden;}\n._oveY-hidden{overflow-y:hidden;}\n._bacCol-kemksi{background-color:rgba(0,0,0,1.00);}\n._borBotLefRad-12px{border-bottom-left-radius:12px;}\n._borBotRigRad-12px{border-bottom-right-radius:12px;}\n._borTopLefRad-12px{border-top-left-radius:12px;}\n._borTopRigRad-12px{border-top-right-radius:12px;}\n._boxSha-1tpz28{box-shadow:0px 3px 14px rgba(0,0,0,0.13);}\n._padBot-2px{padding-bottom:2px;}\n._padLef-5px{padding-left:5px;}\n._padRig-5px{padding-right:5px;}\n._padTop-2px{padding-top:2px;}\n._top-0px{top:0px;}\n._bacCol-14lw9ot{background-color:rgba(255,255,255,1.00);}\n._top--14px{top:-14px;}\n._hei-200px{height:200px;}\n@media not all and (hover: none) { ._oveX--r-o-ovX-o-ok-visible:hover{overflow-x:visible;} }\n@media not all and (hover: none) { ._oveY--r-o-ovY-i-ip04b4b-visible:hover{overflow-y:visible;} }\n._bacCol-57dg7b{background-color:rgba(0,0,255,1.00);}\n._maxWid-30{max-width:30%;}\n._minWid-500px{min-width:500px;}\n._padBot-10px{padding-bottom:10px;}\n._padLef-11px{padding-left:11px;}\n._padRig-11px{padding-right:11px;}\n._wid-66{width:66%;}\n._hei-10px{height:10px;}\n._wid-10px{width:10px;}\n._hei-0px{height:0px;}\n._wid-0px{width:0px;}\n._bot-0px{bottom:0px;}\n._lef-0px{left:0px;}\n._pos-relative{position:relative;}\n._rig-0px{right:0px;}\n._pos-absolute{position:absolute;}\n._padBot-15px{padding-bottom:15px;}\n._padTop-15px{padding-top:15px;}\n._fonSiz-10px{font-size:10px;}\n._useSel-text{-moz-user-select:-webkit-text;-moz-user-select:text;-ms-user-select:-webkit-text;-ms-user-select:text;-webkit-user-select:-webkit-text;-webkit-user-select:text;user-select:-webkit-text;user-select:text;}\n._fonSiz-15px{font-size:15px;}\n._fonWei-600{font-weight:600;}\n._col-cqee49{color:rgba(0,0,0,1.00);}\n._col-jwli3a{color:rgba(255,255,255,1.00);}\n._aliIte-center{-ms-flex-align:center;-webkit-align-items:center;-webkit-box-align:center;align-items:center;}\n._borBotSty-solid{border-bottom-style:solid;}\n._borBotWid-1px{border-bottom-width:1px;}\n._borLefSty-solid{border-left-style:solid;}\n._borLefWid-1px{border-left-width:1px;}\n._borTopSty-solid{border-top-style:solid;}\n._borTopWid-1px{border-top-width:1px;}\n._minHei-10px{min-height:10px;}\n._borBotLefRad-8px{border-bottom-left-radius:8px;}\n._borBotRigRad-8px{border-bottom-right-radius:8px;}\n._borTopLefRad-8px{border-top-left-radius:8px;}\n._borTopRigRad-8px{border-top-right-radius:8px;}\n._hei-31px{height:31px;}\n._borBotLefRad-0px{border-bottom-left-radius:0px;}\n._borBotRigRad-0px{border-bottom-right-radius:0px;}\n._borTopLefRad-0px{border-top-left-radius:0px;}\n._borTopRigRad-0px{border-top-right-radius:0px;}\n._borBotCol-wqks8h{border-bottom-color:rgba(255,0,0,1.00);}\n._borLefCol-3se2kx{border-left-color:rgba(255,0,0,1.00);}\n._borRigCol-ycnuvz{border-right-color:rgba(255,0,0,1.00);}\n._borTopCol-3vzq9n{border-top-color:rgba(255,0,0,1.00);}\n._borBotCol-19sur4y{border-bottom-color:rgba(0,0,0,0.15);}\n._borLefCol-1utlcvg{border-left-color:rgba(0,0,0,0.15);}\n._borRigCol-1qev2y0{border-right-color:rgba(0,0,0,0.15);}\n._borTopCol-48c68v{border-top-color:rgba(0,0,0,0.15);}\n._opa-1{opacity:1;}\n._tra-{-webkit-transform:;transform:;}\n._opa-{opacity:0;}\n._tra-12d2xq9{-webkit-transform:translateY(5px);transform:translateY(5px);}\n._fonWei-400{font-weight:400;}\n._hei-36px{height:36px;}\n._linHei-40px{line-height:40px;}\n._texAli-center{text-align:center;}\n._wid-36px{width:36px;}\n._fonSiz-40px{font-size:40px;}\n._marTop--4px{margin-top:-4px;}\n._col-1h9q8wt{color:rgba(69,69,69,1.00);}\n._fonSiz-24px{font-size:24px;}\n._marTop-0px{margin-top:0px;}\n@media not all and (hover: none) { ._bacCol--r-b-baCol-1g1g664545656j6j-1g6456j:hover{background-color:rgba(255,0,0,1.00);} }\n._bacCol--r-b-baCol-5757d7dg7b-57dg7b._bacCol--r-b-baCol-5757d7dg7b-57dg7b:active{background-color:rgba(0,0,255,1.00);}\n._fleGro-{-ms-flex-positive:0;-webkit-box-flex:0;-webkit-flex-grow:0;flex-grow:0;}\n._fleShr-{-ms-flex-negative:0;-webkit-flex-shrink:0;flex-shrink:0;}\n._minHei-12px{min-height:12px;}\n._minWid-12px{min-width:12px;}\n._minWid-10px{min-width:10px;}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../../../../node_modules/css-loader/dist/runtime/api.js":
/*!******************************************************************!*\
  !*** ../../../../../node_modules/css-loader/dist/runtime/api.js ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "../../../../../node_modules/lodash/_Symbol.js":
/*!*****************************************************!*\
  !*** ../../../../../node_modules/lodash/_Symbol.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "../../../../../node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "../../../../../node_modules/lodash/_baseGetTag.js":
/*!*********************************************************!*\
  !*** ../../../../../node_modules/lodash/_baseGetTag.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../../node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "../../../../../node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "../../../../../node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "../../../../../node_modules/lodash/_freeGlobal.js":
/*!*********************************************************!*\
  !*** ../../../../../node_modules/lodash/_freeGlobal.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "../../../../../node_modules/lodash/_getRawTag.js":
/*!********************************************************!*\
  !*** ../../../../../node_modules/lodash/_getRawTag.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../../../../node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "../../../../../node_modules/lodash/_objectToString.js":
/*!*************************************************************!*\
  !*** ../../../../../node_modules/lodash/_objectToString.js ***!
  \*************************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "../../../../../node_modules/lodash/_root.js":
/*!***************************************************!*\
  !*** ../../../../../node_modules/lodash/_root.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "../../../../../node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "../../../../../node_modules/lodash/debounce.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/lodash/debounce.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "../../../../../node_modules/lodash/isObject.js"),
    now = __webpack_require__(/*! ./now */ "../../../../../node_modules/lodash/now.js"),
    toNumber = __webpack_require__(/*! ./toNumber */ "../../../../../node_modules/lodash/toNumber.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ "../../../../../node_modules/lodash/isObject.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/lodash/isObject.js ***!
  \******************************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "../../../../../node_modules/lodash/isObjectLike.js":
/*!**********************************************************!*\
  !*** ../../../../../node_modules/lodash/isObjectLike.js ***!
  \**********************************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "../../../../../node_modules/lodash/isSymbol.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/lodash/isSymbol.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../../../../node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../../../../node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "../../../../../node_modules/lodash/now.js":
/*!*************************************************!*\
  !*** ../../../../../node_modules/lodash/now.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "../../../../../node_modules/lodash/_root.js");

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ "../../../../../node_modules/lodash/throttle.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/lodash/throttle.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debounce = __webpack_require__(/*! ./debounce */ "../../../../../node_modules/lodash/debounce.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../../../../node_modules/lodash/isObject.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),

/***/ "../../../../../node_modules/lodash/toNumber.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/lodash/toNumber.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "../../../../../node_modules/lodash/isObject.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "../../../../../node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ "../../../../../node_modules/react-dom/index.js":
/*!******************************************************!*\
  !*** ../../../../../node_modules/react-dom/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (true) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-dom.development.js */ "./cjs/react-dom.development.js");
}


/***/ }),

/***/ "../../../../../node_modules/react-laag/dist/react-laag.esm.js":
/*!*********************************************************************!*\
  !*** ../../../../../node_modules/react-laag/dist/react-laag.esm.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Arrow": () => (/* binding */ Arrow),
/* harmony export */   "DEFAULT_OPTIONS": () => (/* binding */ DEFAULT_OPTIONS),
/* harmony export */   "PLACEMENT_TYPES": () => (/* binding */ PLACEMENT_TYPES),
/* harmony export */   "Transition": () => (/* binding */ Transition),
/* harmony export */   "mergeRefs": () => (/* binding */ mergeRefs),
/* harmony export */   "setGlobalContainer": () => (/* binding */ setGlobalContainer),
/* harmony export */   "useHover": () => (/* binding */ useHover),
/* harmony export */   "useLayer": () => (/* binding */ useLayer),
/* harmony export */   "useMousePositionAsTrigger": () => (/* binding */ useMousePositionAsTrigger)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./cjs/react.development.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./cjs/react-dom.development.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tiny_warning__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tiny-warning */ "tiny-warning");
/* harmony import */ var tiny_warning__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tiny_warning__WEBPACK_IMPORTED_MODULE_2__);




function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

/**
 * Utility hook to track the reference of a html-element.
 * It notifies the listener when a change occured, so it can act
 * on the change
 */

function useTrackRef(onRefChange) {
  var storedReference = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // this is de function that actually gets passed to the `ref` prop
  // on the html element. I.e.:
  // <div ref={setter} />

  function setter(element) {
    if (!element || element === storedReference.current) {
      return;
    }

    storedReference.current = element;
    onRefChange(element);
  }

  return setter;
}
/**
 * Utility hook that stores mutable state.
 * Since a getter function is used, it will always return the most
 * up-to-date state. This is useful when you want to get certain state within
 * an effect, without triggering the same effect when the same state changes.
 * Note: may be seen as an anti-pattern.
 */

function useMutableStore(initialState) {
  var state = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(initialState);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    function set(setter) {
      if (typeof setter === "function") {
        state.current = setter(state.current);
      } else {
        state.current = setter;
      }
    }

    function get() {
      return state.current;
    }

    return [get, set];
  }, []);
}
/**
 * Utility hook that keeps track of active event listeners and how
 * to remove these listeners
 */

function useEventSubscriptions() {
  var subscriptions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    function hasEventSubscriptions() {
      return subscriptions.current.length > 0;
    }

    function removeAllEventSubscriptions() {
      for (var _iterator = _createForOfIteratorHelperLoose(subscriptions.current), _step; !(_step = _iterator()).done;) {
        var unsubscribe = _step.value;
        unsubscribe();
      }

      subscriptions.current = [];
    }

    function addEventSubscription(unsubscriber) {
      subscriptions.current.push(unsubscriber);
    }

    return {
      hasEventSubscriptions: hasEventSubscriptions,
      removeAllEventSubscriptions: removeAllEventSubscriptions,
      addEventSubscription: addEventSubscription
    };
  }, []);
}
/**
 * SSR-safe effect hook
 */

var useIsomorphicLayoutEffect = typeof window !== "undefined" ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;
/**
 * Utility hook that tracks an state object.
 * If `enabled=false` it will discard changes and reset the lastState to `null`
 */

function useLastState(currentState, enabled) {
  var lastState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(currentState);

  if (!enabled) {
    lastState.current = null;
    return lastState;
  }

  lastState.current = currentState;
  return lastState;
}
var EMPTY_BOUNDS = {
  top: 0,
  left: 0,
  right: 1,
  bottom: 1,
  width: 1,
  height: 1
};
/**
 * @description Utility hook that lets you use the mouse-position as source of the trigger.
 * This is useful in scenario's like context-menu's.
 *
 * @example
 * ```tsx
 * const {
 *  hasMousePosition,
 *  resetMousePosition,
 *  handleMouseEvent,
 *  trigger
 *  } = useMousePositionAsTrigger();
 *
 * const { renderLayer, layerProps } = useLayer({
 *  isOpen: hasMousePosition,
 *  trigger,
 *  onOutsideClick: resetMousePosition
 * });
 *
 * return (
 *  <>
 *   {isOpen && renderLayer(<div {...layerProps} />)}
 *   <div onContextMenu={handleMouseEvent} />
 *  </>
 * );
 * ```
 */

function useMousePositionAsTrigger(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$enabled = _ref.enabled,
      enabled = _ref$enabled === void 0 ? true : _ref$enabled,
      _ref$preventDefault = _ref.preventDefault,
      preventDefault = _ref$preventDefault === void 0 ? true : _ref$preventDefault;

  var parentRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(EMPTY_BOUNDS),
      mouseBounds = _useState[0],
      setMouseBounds = _useState[1];

  function resetMousePosition() {
    setMouseBounds(EMPTY_BOUNDS);
  }

  var hasMousePosition = mouseBounds !== EMPTY_BOUNDS;

  function handleMouseEvent(evt) {
    if (!enabled) {
      return;
    }

    if (preventDefault) {
      evt.preventDefault();
    }

    var left = evt.clientX,
        top = evt.clientY;
    setMouseBounds({
      top: top,
      left: left,
      width: 1,
      height: 1,
      right: left + 1,
      bottom: top + 1
    });
  }

  return {
    hasMousePosition: hasMousePosition,
    resetMousePosition: resetMousePosition,
    handleMouseEvent: handleMouseEvent,
    trigger: {
      getBounds: function getBounds() {
        return mouseBounds;
      },
      getParent: parentRef.current ? function () {
        return parentRef.current;
      } : undefined
    },
    parentRef: parentRef
  };
}

/**
 * Convert a pixel value into a numeric value
 * @param value string value (ie. '12px')
 */
function getPixelValue(value) {
  return parseFloat(value.replace("px", ""));
}
/**
 * Returns a numeric value that doesn't exceed min or max
 */

function limit(value, min, max) {
  return value < min ? min : value > max ? max : value;
}
/**
 * Utility function which ensures whether a value is truthy
 */

function isSet(value) {
  return value === null || value === undefined ? false : true;
}
/**
 * Utility function that let's you assign multiple references to a 'ref' prop
 * @param refs list of MutableRefObject's and / or callbacks
 */

function mergeRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (element) {
    for (var _iterator = _createForOfIteratorHelperLoose(refs), _step; !(_step = _iterator()).done;) {
      var ref = _step.value;

      if (!ref) {
        continue;
      }

      if (typeof ref === "function") {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  };
}

/**
 * Utility to get the correct ResizeObserver class
 */

function getResizeObserver(environment, polyfill) {
  if (typeof environment === "undefined") {
    return undefined;
  }

  return polyfill || environment.ResizeObserver;
}
/**
 * Utility function that given a element traverses up in the html-hierarchy
 * to find and return all ancestors that have scroll behavior
 */

function findScrollContainers(element, environment) {
  var result = [];

  if (!element || !environment || element === document.body) {
    return result;
  }

  var _environment$getCompu = environment.getComputedStyle(element),
      overflow = _environment$getCompu.overflow,
      overflowX = _environment$getCompu.overflowX,
      overflowY = _environment$getCompu.overflowY;

  if ([overflow, overflowX, overflowY].some(function (prop) {
    return ["auto", "scroll"].includes(prop);
  })) {
    result.push(element);
  }

  return [].concat(result, findScrollContainers(element.parentElement, environment));
}

function createReferenceError(subject) {
  return "react-laag: Could not find a valid reference for the " + subject + " element. There might be 2 causes:\n   - Make sure that the 'ref' is set correctly on the " + subject + " element when isOpen: true. Also make sure your component forwards the ref with \"forwardRef()\".\n   - Make sure that you are actually rendering the " + subject + " when the isOpen prop is set to true";
}
/**
 * This hook has the responsibility to track the bounds of:
 * - the trigger element
 * - the layer element
 * - the arrow element
 * - the scroll-containers of which the trigger element is a descendant of
 *
 * It will call the `onChange` callback with a collection of these elements when any
 * of the tracked elements bounds have changed
 *
 * It will detect these changes by listening:
 * - when the reference of the trigger element changes
 * - when the reference of the layer element changes
 * - when the trigger, layer or document body changes in size
 * - when the user scrolls the page, or any of the scroll containers
 */


function useTrackElements(_ref) {
  var enabled = _ref.enabled,
      onChange = _ref.onChange,
      environment = _ref.environment,
      ResizeObserverPolyfill = _ref.ResizeObserverPolyfill,
      overflowContainer = _ref.overflowContainer,
      triggerOption = _ref.triggerOption;
  // get the correct reference to the ResizeObserver class
  var ResizeObserver = getResizeObserver(environment, ResizeObserverPolyfill); // warn the user when no valid ResizeObserver class could be found

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
     true ? tiny_warning__WEBPACK_IMPORTED_MODULE_2___default()(ResizeObserver, "This browser does not support ResizeObserver out of the box. We recommend to add a polyfill in order to utilize the full capabilities of react-laag. See: https://link") : 0;
  }, [ResizeObserver]); // keep reference of the optional arrow-component

  var arrowRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // if user has provided the trigger-option we should ingore certain things elsewhere

  var hasTriggerOption = Boolean(triggerOption); // Keep track of mutable element related state
  // It is generally better to use React.useState, but unfortunately that causes to many re-renders

  var _useMutableStore = useMutableStore({
    scrollContainers: [],
    trigger: null,
    layer: null
  }),
      get = _useMutableStore[0],
      set = _useMutableStore[1]; // utility to keep track of the scroll and resize listeners and how to unsubscribe them


  var _useEventSubscription = useEventSubscriptions(),
      hasEventSubscriptions = _useEventSubscription.hasEventSubscriptions,
      addEventSubscription = _useEventSubscription.addEventSubscription,
      removeAllEventSubscriptions = _useEventSubscription.removeAllEventSubscriptions; // All scroll and resize changes eventually end up here, where the collection of bounds (subjectsBounds) is
  // constructed in order to notifiy the `onBoundsChange` callback


  var handleChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function handleChange() {
    var _get = get(),
        layer = _get.layer,
        trigger = _get.trigger,
        scrollContainers = _get.scrollContainers;

    var closestScrollContainer = scrollContainers[0];

    if (!layer) {
      throw new Error(createReferenceError("layer"));
    } // ignore when user has provided the trigger-option


    if (!trigger && !hasTriggerOption) {
      throw new Error(createReferenceError("trigger"));
    }

    var scrollOffsets = {
      top: 0,
      left: 0
    };

    if (closestScrollContainer) {
      var scrollLeft = closestScrollContainer.scrollLeft,
          scrollTop = closestScrollContainer.scrollTop;
      scrollOffsets = {
        top: scrollTop,
        left: scrollLeft
      };
    } else {
      var scrollX = environment.scrollX,
          scrollY = environment.scrollY;
      scrollOffsets = {
        top: scrollY,
        left: scrollX
      };
    }

    var borderOffsets = {
      left: 0,
      top: 0
    };

    if (closestScrollContainer) {
      var _environment$getCompu2 = environment.getComputedStyle(closestScrollContainer),
          borderLeftWidth = _environment$getCompu2.borderLeftWidth,
          borderTopWidth = _environment$getCompu2.borderTopWidth;

      borderOffsets = {
        left: getPixelValue(borderLeftWidth) || 0,
        top: getPixelValue(borderTopWidth) || 0
      };
    }

    onChange({
      layer: layer,
      trigger: trigger,
      scrollContainers: scrollContainers,
      arrow: arrowRef.current
    }, scrollOffsets, borderOffsets);
  }, [get, onChange, environment, arrowRef, hasTriggerOption]); // responsible for adding the scroll and resize listeners to the correct
  // html elements

  var addEventListeners = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function addEventListeners() {
    var _get2 = get(),
        trigger = _get2.trigger,
        layer = _get2.layer,
        scrollContainers = _get2.scrollContainers;

    if (!layer) {
      throw new Error(createReferenceError("layer"));
    }

    if (!trigger && !hasTriggerOption) {
      // ignore when user has provided the trigger-option
      throw new Error(createReferenceError("trigger"));
    }

    if (ResizeObserver) {
      var ignoredInitialCall = false;

      var observerCallback = function observerCallback() {
        if (!ignoredInitialCall) {
          ignoredInitialCall = true;
          return;
        }

        handleChange();
      };

      var observer = new ResizeObserver(observerCallback);

      for (var _i = 0, _arr = [trigger, layer, document.body]; _i < _arr.length; _i++) {
        var element = _arr[_i];
        if (element) observer.observe(element);
      }

      addEventSubscription(function () {
        for (var _i2 = 0, _arr2 = [trigger, layer, document.body]; _i2 < _arr2.length; _i2++) {
          var _element = _arr2[_i2];
          if (_element) observer.unobserve(_element);
        }

        observer.disconnect();
      });
    }

    var listenForScrollElements = [environment].concat(scrollContainers);

    var _loop = function _loop() {
      var element = _step.value;
      element.addEventListener("scroll", handleChange);
      addEventSubscription(function () {
        return element.removeEventListener("scroll", handleChange);
      });
    };

    for (var _iterator = _createForOfIteratorHelperLoose(listenForScrollElements), _step; !(_step = _iterator()).done;) {
      _loop();
    }
  }, [get, addEventSubscription, handleChange, environment, ResizeObserver, hasTriggerOption]); // when either the reference to the trigger or layer element changes
  // we should reset the event listeners and trigger a `onChange`

  var resetWhenReferenceChangedWhileTracking = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (previous, next) {
    if (enabled && previous && previous !== next) {
      removeAllEventSubscriptions();
      addEventListeners();
      handleChange();
    }
  }, [removeAllEventSubscriptions, addEventListeners, handleChange, enabled]); // Logic when reference to layer changes

  var layerRef = useTrackRef((0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (layer) {
    var _get3 = get(),
        previousLayer = _get3.layer; // store new reference


    set(function (state) {
      return _extends({}, state, {
        layer: layer
      });
    }); // check if we should reset the event listeners

    resetWhenReferenceChangedWhileTracking(previousLayer, layer);
  }, [get, set, resetWhenReferenceChangedWhileTracking]));
  var getScrollContainers = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function handleScrollContainers(element) {
    var scrollContainers = findScrollContainers(element, environment);
    var closestScrollContainer = scrollContainers[0];

    if (closestScrollContainer) {
      // Check if we should warn the user about 'position: relative; stuff...'
      var position = environment.getComputedStyle(closestScrollContainer).position;
      var closestScrollContainerHasCorrectStyling = ["relative", "absolute", "fixed"].includes(position) || overflowContainer;

      if (!closestScrollContainerHasCorrectStyling) {
        closestScrollContainer.style.position = "relative";
      }

       true ? tiny_warning__WEBPACK_IMPORTED_MODULE_2___default()(closestScrollContainerHasCorrectStyling, "react-laag: Set the 'position' style of the nearest scroll-container to 'relative', 'absolute' or 'fixed', or set the 'overflowContainer' prop to true. This is needed in order to position the layer properly. Currently the scroll-container is positioned: \"" + position + "\". For now, \"position: relative;\" is added for you, but this behavior might be removed in the future. Visit https://react-laag.com/docs/#position-relative for more info.") : 0;
    }

    return scrollContainers;
  }, [environment, overflowContainer]); // Logic when reference to trigger changes
  // Note: this will have no effect when user provided the trigger-option

  var triggerRef = useTrackRef((0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (trigger) {
    // collect list of scroll containers
    var scrollContainers = getScrollContainers(trigger);

    var _get4 = get(),
        previousTrigger = _get4.trigger; // store new references


    set(function (state) {
      return _extends({}, state, {
        trigger: trigger,
        scrollContainers: scrollContainers
      });
    }); // check if we should reset the event listeners

    resetWhenReferenceChangedWhileTracking(previousTrigger, trigger);
  }, [get, set, resetWhenReferenceChangedWhileTracking, getScrollContainers])); // when user has provided the trigger-option, it monitors the optional parent-element
  // in order to determine the scroll-containers

  var triggerOptionParent = triggerOption == null ? void 0 : triggerOption.getParent == null ? void 0 : triggerOption.getParent();
  useIsomorphicLayoutEffect(function () {
    if (!triggerOptionParent) {
      return;
    }

    set(function (state) {
      return _extends({}, state, {
        scrollContainers: getScrollContainers(triggerOptionParent)
      });
    });
  }, [triggerOptionParent, set, getScrollContainers]);
  useIsomorphicLayoutEffect(function () {
    if (enabled) {
      // add event listeners if necessary
      if (!hasEventSubscriptions()) {
        addEventListeners();
      }
    }

    return function () {
      if (hasEventSubscriptions()) {
        removeAllEventSubscriptions();
      }
    };
  }, [enabled, hasEventSubscriptions, addEventListeners, removeAllEventSubscriptions]); // run this effect after every render

  useIsomorphicLayoutEffect(function () {
    if (enabled) {
      // eventually call `handleChange` with latest elements-refs
      handleChange();
    }
  });
  return {
    triggerRef: triggerRef,
    layerRef: layerRef,
    arrowRef: arrowRef,
    closestScrollContainer: get().scrollContainers[0] || null
  };
}

var GroupContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({}); // Provider that wraps arround the layer in order to provide other useLayers
// down in the hiearchy (child layers) with means to communicate with the parent.
// This provider receives a `registrations` Set which can be used to add and
// delete registrations.

function GroupProvider(_ref) {
  var children = _ref.children,
      registrations = _ref.registrations;
  // registration function that is used as 'context payload' for child layers
  // to call. It returns a function to unregister.
  var handleRegister = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function register(registration) {
    registrations.current.add(registration);
    return function () {
      return registrations.current["delete"](registration);
    };
  }, [registrations]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(GroupContext.Provider, {
    value: handleRegister
  }, children);
} // asks child layers if they would close given the documents click event
// if there's one that signals not to close, return early (false)

function getShouldCloseAccordingToChildren(registrations, event) {
  for (var _iterator = _createForOfIteratorHelperLoose(registrations), _step; !(_step = _iterator()).done;) {
    var shouldCloseWhenClickedOutside = _step.value.shouldCloseWhenClickedOutside;

    if (!shouldCloseWhenClickedOutside(event)) {
      return false;
    }
  }

  return true;
}
/**
 * Responsible for close behavior
 * When the `onOutsideClick` callback is provided by the user, it will listen for clicks
 * in the document, and tell whether the user clicked outside -> not on layer / trigger.
 * It keeps track of nested useLayers a.k.a child layers (`registrations` Set), through which
 * we can ask whether they `shouldCloseWhenClickedOutside`, or tell them to close.
 *
 * Behavior:
 * - `onOutsideClick` only works on the most outer parent, and not on children. The parent will ask
 *   the child layers whether they would close, and will handle accordingly. The parent may
 *   command the children to close indirectly with the help of `onParentClose`
 * - When the parent just was closed, it will make sure that any children will also close
 *   with the help of `onParentClose`
 */


function useGroup(_ref2) {
  var isOpen = _ref2.isOpen,
      onOutsideClick = _ref2.onOutsideClick,
      onParentClose = _ref2.onParentClose;
  // store references to the dom-elements
  // we need these to later determine wether the clicked outside or not
  var trigger = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var layer = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // a Set which keeps track of callbacks given by the child layers through context

  var registrations = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Set()); // if this instance is a child itself, we should use this function to register
  // some callbacks to the parent

  var possibleRegisterFn = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(GroupContext); // recursively checks whether to close or not. This mechanism has some similarities
  // with event bubbling.

  var shouldCloseWhenClickedOutside = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function shouldCloseWhenClickedOutside(event) {
    var target = event.target;
    var clickedOnTrigger = trigger.current && trigger.current.contains(target);
    var clickedOnLayer = layer.current && layer.current.contains(target);
    var shouldCloseAccordingToChildren = getShouldCloseAccordingToChildren(registrations.current, event); // when clicked on own layer, but the child would have closed ->
    // let child close

    if (clickedOnLayer && shouldCloseAccordingToChildren) {
      registrations.current.forEach(function (_ref3) {
        var closeChild = _ref3.closeChild;
        return closeChild();
      });
    }

    return !clickedOnTrigger && !clickedOnLayer && shouldCloseAccordingToChildren;
  }, [trigger, layer, registrations]); // registration stuff

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (typeof possibleRegisterFn !== "function") {
      return;
    } // 'possibleRegisterFn' will return a function that will unregister
    // on cleanup


    return possibleRegisterFn({
      shouldCloseWhenClickedOutside: shouldCloseWhenClickedOutside,
      closeChild: function closeChild() {
         true ? tiny_warning__WEBPACK_IMPORTED_MODULE_2___default()(onParentClose, "react-laag: You are using useLayer() in a nested setting but forgot to set the 'onParentClose()' callback in the options. This could lead to unexpected behavior.") : 0;

        if (onParentClose) {
          onParentClose();
        }
      }
    });
  }, [possibleRegisterFn, shouldCloseWhenClickedOutside, onParentClose, registrations]); // document click handling

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var isChild = typeof possibleRegisterFn === "function";
    var shouldNotListen = !isOpen || !onOutsideClick || isChild;

    if (shouldNotListen) {
      return;
    }

    function handleClick(event) {
      if (shouldCloseWhenClickedOutside(event)) {
        onOutsideClick();
      }
    }

    document.addEventListener("click", handleClick, true);
    return function () {
      return document.removeEventListener("click", handleClick, true);
    };
  }, [isOpen, onOutsideClick, shouldCloseWhenClickedOutside, possibleRegisterFn]); // When this 'useLayer' gets closed -> tell child layers to close as well

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (!isOpen) {
      registrations.current.forEach(function (_ref4) {
        var closeChild = _ref4.closeChild;
        return closeChild();
      });
    }
  }, [isOpen]);
  return {
    closeOnOutsideClickRefs: {
      trigger: trigger,
      layer: layer
    },
    registrations: registrations
  };
}

var PLACEMENT_TYPES = ["bottom-start", "bottom-end", "bottom-center", "top-start", "top-center", "top-end", "left-end", "left-center", "left-start", "right-end", "right-center", "right-start", "center"];

var OPPOSITES = {
  top: "bottom",
  left: "right",
  bottom: "top",
  right: "left",
  center: "center"
};

var SideBase = /*#__PURE__*/function () {
  function SideBase(prop, opposite, isHorizontal, sizeProp, oppositeSizeProp, cssProp, oppositeCssProp, isCenter, isPush // left | top
  ) {
    this.prop = prop;
    this.opposite = opposite;
    this.isHorizontal = isHorizontal;
    this.sizeProp = sizeProp;
    this.oppositeSizeProp = oppositeSizeProp;
    this.cssProp = cssProp;
    this.oppositeCssProp = oppositeCssProp;
    this.isCenter = isCenter;
    this.isPush = isPush;
  }

  var _proto = SideBase.prototype;

  _proto.factor = function factor(value) {
    return value * (this.isPush ? 1 : -1);
  };

  _proto.isOppositeDirection = function isOppositeDirection(side) {
    return this.isHorizontal !== side.isHorizontal;
  };

  return SideBase;
}();

function createSide(prop, recursive) {
  if (recursive === void 0) {
    recursive = true;
  }

  var isHorizontal = ["left", "right"].includes(prop);
  return new SideBase(prop, recursive ? createSide(OPPOSITES[prop], false) : null, isHorizontal, isHorizontal ? "width" : "height", isHorizontal ? "height" : "width", isHorizontal ? "left" : "top", isHorizontal ? "top" : "left", prop === "center", !["right", "bottom"].includes(prop));
}

var BoundSide = {
  top: /*#__PURE__*/createSide("top"),
  bottom: /*#__PURE__*/createSide("bottom"),
  left: /*#__PURE__*/createSide("left"),
  right: /*#__PURE__*/createSide("right")
};
var Side = /*#__PURE__*/_extends({}, BoundSide, {
  center: /*#__PURE__*/createSide("center")
});

var SIDES = ["top", "left", "bottom", "right"];
/**
 * A class containing the positional properties which represent the distance
 * between two Bounds instances for each side
 */

var BoundsOffsets = /*#__PURE__*/function () {
  function BoundsOffsets(offsets) {
    return Object.assign(this, offsets);
  }
  /**
   * Takes multiple BoundsOffets instances and creates a new BoundsOffsets instance
   * by taking the smallest value for each side
   * @param boundsOffsets list of BoundsOffsets instances
   */


  BoundsOffsets.mergeSmallestSides = function mergeSmallestSides(boundsOffsets) {
    var first = boundsOffsets[0],
        rest = boundsOffsets.slice(1);

    if (!first) {
      throw new Error("Please provide at least 1 bounds objects in order to merge");
    }

    var result = Object.fromEntries(SIDES.map(function (side) {
      return [side, first[side]];
    }));

    for (var _iterator = _createForOfIteratorHelperLoose(rest), _step; !(_step = _iterator()).done;) {
      var boundsOffset = _step.value;

      for (var _iterator2 = _createForOfIteratorHelperLoose(SIDES), _step2; !(_step2 = _iterator2()).done;) {
        var side = _step2.value;
        result[side] = Math.min(result[side], boundsOffset[side]);
      }
    }

    return new BoundsOffsets(result);
  }
  /**
   * Checks whether all sides sides are positive, meaning the corresponding Bounds instance
   * fits perfectly within a parent Bounds instance
   */
  ;

  _createClass(BoundsOffsets, [{
    key: "allSidesArePositive",
    get: function get() {
      var _this = this;

      return SIDES.every(function (side) {
        return _this[side] >= 0;
      });
    }
    /**
     * Returns a partial IBoundsOffsets with sides that are negative, meaning sides aren't entirely
     * visible in respect to a parent Bounds instance
     */

  }, {
    key: "negativeSides",
    get: function get() {
      var _this2 = this;

      return Object.fromEntries(SIDES.filter(function (side) {
        return _this2[side] < 0;
      }).map(function (side) {
        return [side, _this2[side]];
      }));
    }
  }]);

  return BoundsOffsets;
}();

/**
 * Utility function that returns sum of various computed styles
 * @param propertyValues list of computed styles (ie. '12px')
 */

function sumOfPropertyValues() {
  for (var _len = arguments.length, propertyValues = new Array(_len), _key = 0; _key < _len; _key++) {
    propertyValues[_key] = arguments[_key];
  }

  return propertyValues.reduce(function (sum, propertyValue) {
    return sum + (propertyValue ? getPixelValue(propertyValue) : 0);
  }, 0);
}

function boundsToObject(_ref) {
  var top = _ref.top,
      left = _ref.left,
      right = _ref.right,
      bottom = _ref.bottom,
      width = _ref.width,
      height = _ref.height;
  return {
    top: top,
    left: left,
    right: right,
    bottom: bottom,
    width: width,
    height: height
  };
}
var EMPTY = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
/**
 * A class containing the positional properties of the native DOM's ClientRect
 * (`element.getBoundingClientRect()`), together with some utility methods
 */

var Bounds = /*#__PURE__*/function () {
  function Bounds(bounds) {
    if (bounds === void 0) {
      bounds = {};
    }

    return Object.assign(this, EMPTY, bounds);
  }
  /**
   * Creates a new Bounds class
   * @param bounds An object that adheres to the `IBounds` interface
   */


  Bounds.create = function create(bounds) {
    return new Bounds(bounds);
  }
  /**
   * Creates a new Bounds class from a DOM-element
   * @param element reference to the DOM-element
   * @param options optional options object
   */
  ;

  Bounds.fromElement = function fromElement(element, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$withTransfor = _options.withTransform,
        withTransform = _options$withTransfor === void 0 ? true : _options$withTransfor,
        _options$environment = _options.environment,
        environment = _options$environment === void 0 ? window : _options$environment,
        _options$withScrollba = _options.withScrollbars,
        withScrollbars = _options$withScrollba === void 0 ? true : _options$withScrollba;
    var plain = boundsToObject(element.getBoundingClientRect());
    var bounds = new Bounds(plain);

    if (!withTransform) {
      var _environment$getCompu = environment.getComputedStyle(element),
          width = _environment$getCompu.width,
          height = _environment$getCompu.height,
          boxSizing = _environment$getCompu.boxSizing,
          borderLeft = _environment$getCompu.borderLeft,
          borderRight = _environment$getCompu.borderRight,
          borderTop = _environment$getCompu.borderTop,
          borderBottom = _environment$getCompu.borderBottom,
          paddingLeft = _environment$getCompu.paddingLeft,
          paddingRight = _environment$getCompu.paddingRight,
          paddingTop = _environment$getCompu.paddingTop,
          paddingBottom = _environment$getCompu.paddingBottom;

      var boxWidth = boxSizing === "border-box" ? getPixelValue(width) : sumOfPropertyValues(width, borderLeft, borderRight, paddingLeft, paddingRight);
      var boxHeight = boxSizing === "border-box" ? getPixelValue(height) : sumOfPropertyValues(height, borderTop, borderBottom, paddingTop, paddingBottom);
      bounds = new Bounds(_extends({}, bounds, {
        width: boxWidth,
        height: boxHeight
      }));
    }

    if (!withScrollbars) {
      var scrollbarWidth = bounds.width - element.clientWidth;
      var scrollbarHeight = bounds.height - element.clientHeight;
      return bounds.substract({
        right: scrollbarWidth,
        bottom: scrollbarHeight
      });
    }

    return bounds;
  }
  /**
   * Creates an empty Bounds class
   */
  ;

  Bounds.empty = function empty() {
    return new Bounds();
  }
  /**
   * Creates a Bounds class from the window's dimensions
   * @param environment reference to the window-object (needed when working with iframes for instance). Defaults to `window`
   */
  ;

  Bounds.fromWindow = function fromWindow(environment) {
    var _ref2 = environment || {},
        _ref2$innerWidth = _ref2.innerWidth,
        width = _ref2$innerWidth === void 0 ? 0 : _ref2$innerWidth,
        _ref2$innerHeight = _ref2.innerHeight,
        height = _ref2$innerHeight === void 0 ? 0 : _ref2$innerHeight;

    return new Bounds({
      width: width,
      height: height,
      right: width,
      bottom: height
    });
  }
  /**
   * Returns the square surface of the bounds in pixels
   */
  ;

  var _proto = Bounds.prototype;

  /**
   * Returns a plain object containing only positional properties
   */
  _proto.toObject = function toObject() {
    return boundsToObject(this);
  };

  _proto.merge = function merge(partialBoundsOrMergeFn) {
    var current = this.toObject();
    return new Bounds(_extends({}, current, typeof partialBoundsOrMergeFn === "function" ? partialBoundsOrMergeFn(current) : partialBoundsOrMergeFn));
  }
  /**
   * Return a new Bounds instance by subtracting each property of the provided IBounds object
   * @param bounds partial IBounds object to substract with
   */
  ;

  _proto.substract = function substract(bounds) {
    var result = this.toObject();
    var entries = Object.entries(bounds);

    for (var _i = 0, _entries = entries; _i < _entries.length; _i++) {
      var _entries$_i = _entries[_i],
          prop = _entries$_i[0],
          value = _entries$_i[1];

      if (prop in BoundSide) {
        // if `prop` is one of 'top', 'left', 'bottom' or 'right'...
        var boundSide = BoundSide[prop]; // decide if we should add or substract

        result[prop] += boundSide.factor(value); // make sure that the size-properties are also updated

        result[boundSide.isHorizontal ? "width" : "height"] -= value;
      } else {
        // prop is 'width' or 'height'
        result[prop] -= value || 0;
      }
    }

    return new Bounds(result);
  }
  /**
   * Returns a new BoundsOffsets instance by determining the distance for each bound-side:
   * (child -> parent)
   * @param child child bounds instance
   */
  ;

  _proto.offsetsTo = function offsetsTo(child) {
    return new BoundsOffsets({
      top: child.top - this.top,
      bottom: this.bottom - child.bottom,
      left: child.left - this.left,
      right: this.right - child.right
    });
  }
  /**
   * Return a new Bounds instance by mapping over each bound-side
   * @param mapper callback that takes a boundSide + value in pixels, returning a new value for that side
   */
  ;

  _proto.mapSides = function mapSides(mapper) {
    var result = this.toObject();
    var boundSides = Object.values(BoundSide);

    for (var _i2 = 0, _boundSides = boundSides; _i2 < _boundSides.length; _i2++) {
      var boundSide = _boundSides[_i2];
      result[boundSide.prop] = mapper(boundSide, result[boundSide.prop]);
    }

    return new Bounds(result);
  };

  _createClass(Bounds, [{
    key: "surface",
    get: function get() {
      return this.width * this.height;
    }
  }]);

  return Bounds;
}();

/**
 * Class for various calculations based on a placement-type. I.e 'top-left';
 */

var Placement = /*#__PURE__*/function () {
  function Placement(primary, secondary, subjectBounds, layerDimensions, offsets) {
    this.primary = primary;
    this.secondary = secondary;
    this.offsets = offsets;
    this._cachedLayerBounds = null;
    this._cachedContainerOffsets = null;
    this.setSubjectsBounds(subjectBounds, layerDimensions);
  }
  /**
   * Set subjectsBounds that are specific for this placement
   * @param subjectBounds original SubjectBounds instance
   * @param layerDimensions possible config prodvided by the user
   */


  var _proto = Placement.prototype;

  _proto.setSubjectsBounds = function setSubjectsBounds(subjectBounds, layerDimensions) {
    // if user did not provide any layerDimensions config...
    if (!layerDimensions) {
      this.subjectsBounds = subjectBounds;
      return;
    } // get anticipated layer-dimensions provided by the user


    var dimensions = // if the user passed a callback, call it with the layerSide corresponding to
    // the placement
    typeof layerDimensions === "function" ? layerDimensions(this.primary.prop) : layerDimensions; // create new SubjectsBounds instance by merging our newly create layer-bounds

    this.subjectsBounds = subjectBounds.merge({
      layer: _extends({}, subjectBounds.layer, dimensions)
    });
  }
  /**
   * Returns the string respresentation of this placement (ie. 'top-start')
   */
  ;

  /**
   * Calculates the actual boundaries based on the placement
   * @param secondaryOffset optional offset on the secondary-side
   */
  _proto.getLayerBounds = function getLayerBounds(secondaryOffset) {
    if (secondaryOffset === void 0) {
      secondaryOffset = 0;
    }

    // return cached version if possible
    if (this._cachedLayerBounds && secondaryOffset === 0) {
      return this._cachedLayerBounds;
    }

    var primary = this.primary,
        secondary = this.secondary,
        subjectsBounds = this.subjectsBounds;
    var trigger = subjectsBounds.trigger,
        layer = subjectsBounds.layer,
        arrow = subjectsBounds.arrow;
    var isHorizontal = primary.isHorizontal,
        oppositeCssProp = primary.oppositeCssProp,
        oppositeSizeProp = primary.oppositeSizeProp,
        prop = primary.prop,
        opposite = primary.opposite;
    var result = Bounds.empty(); // let's take the placement 'top-start' as an example...
    // the offsets are the following:
    // trigger -> 8px
    // container -> 10px;
    // arrow -> 2px;
    // PRIMARY STUFF
    // bottom = trigger.top + 8;

    result[opposite.prop] = trigger[prop] - primary.factor(this.offsets.trigger); // top = bottom - layer.height

    result[prop] = result[opposite.prop] - primary.factor(layer[primary.sizeProp]); // SECONDARY STUFF
    // arrowOffsetBase = 4

    var arrowOffsetBase = this.offsets.arrow * 2; // limitMin = trigger.left - (layer.width - arrow.width) + 4

    var limitMin = trigger[oppositeCssProp] - (layer[oppositeSizeProp] - arrow[oppositeSizeProp]) + arrowOffsetBase; // limitMax = trigger.left + (trigger.width - arrow.width) - 4

    var limitMax = trigger[oppositeCssProp] + (trigger[oppositeSizeProp] - arrow[oppositeSizeProp]) - arrowOffsetBase;

    if (!secondary.isPush) {
      // if secondary is bottom or right -> add the width or height of the layer
      limitMin += layer[oppositeSizeProp];
      limitMax += layer[oppositeSizeProp];
    }

    if (secondary.isCenter) {
      var propertyA = (isHorizontal ? BoundSide.top : BoundSide.left).prop;
      var propertyB = (isHorizontal ? BoundSide.bottom : BoundSide.right).prop; // left = limit(
      //   trigger.left + trigger.width / 2 - layer.width / 2 + secondaryOffset,
      //   limitMin,
      //   limitMax
      // )

      result[propertyA] = limit(trigger[propertyA] + trigger[oppositeSizeProp] / 2 - layer[oppositeSizeProp] / 2 + secondaryOffset, limitMin, limitMax); // right = left + layer.width

      result[propertyB] = result[propertyA] + layer[oppositeSizeProp];
    } else {
      var sec = secondary;
      var triggerValue = trigger[sec.prop]; // Under some conditions, when the layer is not able to align with the trigger
      // due to arrow-size and arrow-offsets, we need to compensate.
      // Otherwise, the secondary-offset will have no impact

      var arrowCompensation = triggerValue < limitMin ? limitMin - triggerValue : triggerValue > limitMax ? limitMax - triggerValue : 0; // left = limit(
      //   trigger.left + secondaryOffset + arrowCompensation,
      //   limitMin,
      //   limitMax
      // )

      result[sec.prop] = limit(triggerValue + secondaryOffset + arrowCompensation, limitMin, limitMax); // right = left + layer.width

      result[sec.opposite.prop] = result[sec.prop] + secondary.factor(layer[oppositeSizeProp]);
    } // set the correct dimensions


    result.width = result.right - result.left;
    result.height = result.bottom - result.top; // create new bounds object

    var layerBounds = Bounds.create(result);

    if (secondaryOffset === 0) {
      this._cachedLayerBounds = layerBounds;
    }

    return layerBounds;
  }
  /**
   * Checks whether the trigger is bigger on the opposite side
   * ie. placement "top-start" -> has trigger a bigger width?
   */
  ;

  /**
   * returns getLayerBounds(), including container-offsets
   */
  _proto.getLayerCollisionBounds = function getLayerCollisionBounds() {
    var container = this.offsets.container;
    return this.getLayerBounds().mapSides(function (side, value) {
      return value -= side.factor(container);
    }).merge(function (_ref) {
      var width = _ref.width,
          height = _ref.height;
      return {
        width: width + container * 2,
        height: height + container * 2
      };
    });
  }
  /**
   * Returns a BoundsOffsets instance containing merged offsets to containers with the most
   * negative scenario
   */
  ;

  _proto.getContainerOffsets = function getContainerOffsets(layerBounds) {
    if (this._cachedContainerOffsets && !layerBounds) {
      return this._cachedContainerOffsets;
    }

    var subjectBounds = this.subjectsBounds.merge({
      layer: layerBounds || this.getLayerCollisionBounds()
    });
    var offsets = BoundsOffsets.mergeSmallestSides(subjectBounds.layerOffsetsToScrollContainers);

    if (!layerBounds) {
      this._cachedContainerOffsets = offsets;
    }

    return offsets;
  };

  _createClass(Placement, [{
    key: "type",
    get: function get() {
      return this.primary.prop + "-" + (this.secondary.prop === "center" ? "center" : ["bottom", "right"].includes(this.secondary.prop) ? "end" : "start");
    }
  }, {
    key: "triggerIsBigger",
    get: function get() {
      var isHorizontal = this.secondary.isHorizontal;
      var _this$subjectsBounds = this.subjectsBounds,
          triggerHasBiggerWidth = _this$subjectsBounds.triggerHasBiggerWidth,
          triggerHasBiggerHeight = _this$subjectsBounds.triggerHasBiggerHeight;
      return isHorizontal && triggerHasBiggerWidth || !isHorizontal && triggerHasBiggerHeight;
    }
    /**
     * Checks whether the placement fits within all it's container (including container-offset)
     */

  }, {
    key: "fitsContainer",
    get: function get() {
      return this.getContainerOffsets().allSidesArePositive;
    }
    /**
     * Returns the surface in square pixels of the visible part of the layer
     */

  }, {
    key: "visibleSurface",
    get: function get() {
      var layerBounds = this.getLayerBounds();
      var containerOffsets = this.getContainerOffsets(layerBounds);
      var substract = containerOffsets.negativeSides;

      for (var side in substract) {
        // @ts-ignore
        substract[side] = -substract[side]; // make positive for substraction;
      }

      return layerBounds.substract(substract).surface;
    }
    /**
     * Returns a BoundSide by looking at the most negative offset that is the opposite direction
     */

  }, {
    key: "secondaryOffsetSide",
    get: function get() {
      var _Object$entries$map$f,
          _Object$entries$map$f2,
          _this = this;

      // Given placement 'top-start' and containerOffsets { left: -20, top: -10, right: -10, bottom: 200 }...
      // the only negative offsets on the opposite side are { left: -20, right: -10 }
      // since we have to return only 1 side, we pick the most negative, which is 'left'
      var containerOffsets = this.getContainerOffsets();

      var _ref2 = (_Object$entries$map$f = (_Object$entries$map$f2 = Object.entries(containerOffsets.negativeSides).map(function (_ref3) {
        var side = _ref3[0],
            value = _ref3[1];
        return [BoundSide[side], value];
      }).filter(function (_ref4) {
        var side = _ref4[0];
        return _this.primary.isOppositeDirection(side);
      }).sort(function (_ref5, _ref6) {
        var a = _ref5[1];
        var b = _ref6[1];
        return b - a;
      })) == null ? void 0 : _Object$entries$map$f2[0]) != null ? _Object$entries$map$f : [],
          mostNegativeSide = _ref2[0];

      return mostNegativeSide || null;
    }
  }]);

  return Placement;
}();
var PlacementCenter = /*#__PURE__*/function (_Placement) {
  _inheritsLoose(PlacementCenter, _Placement);

  function PlacementCenter() {
    return _Placement.apply(this, arguments) || this;
  }

  var _proto2 = PlacementCenter.prototype;

  _proto2.getLayerBounds = function getLayerBounds() {
    var _this$subjectsBounds2 = this.subjectsBounds,
        trigger = _this$subjectsBounds2.trigger,
        layer = _this$subjectsBounds2.layer;
    var result = Bounds.empty();
    result.top = trigger.top + trigger.height / 2 - layer.height / 2;
    result.bottom = result.top + layer.height;
    result.left = trigger.left + trigger.width / 2 - layer.width / 2;
    result.right = result.left + layer.width;
    result.width = result.right - result.left;
    result.height = result.bottom - result.top;
    return result;
  };

  return PlacementCenter;
}(Placement);

function getNegativeOffsetBetweenLayerCenterAndTrigger(subjectsBounds, placement, arrowOffset) {
  var layer = subjectsBounds.layer,
      trigger = subjectsBounds.trigger,
      arrow = subjectsBounds.arrow;
  var sizeProperty = placement.primary.oppositeSizeProp;

  var _ref = !placement.primary.isHorizontal ? ["left", "right"] : ["top", "bottom"],
      sideA = _ref[0],
      sideB = _ref[1];

  var offsetA = layer[sideA] + layer[sizeProperty] / 2 - trigger[sideA] - arrow[sizeProperty] / 2 - arrowOffset;
  var offsetB = layer[sideB] - layer[sizeProperty] / 2 - trigger[sideB] + arrow[sizeProperty] / 2 + arrowOffset;
  return (offsetA < 0 ? -offsetA : 0) + (offsetB > 0 ? -offsetB : 0);
}

var STYLE_BASE = {
  position: "absolute",
  willChange: "top, left",
  left: null,
  right: null,
  top: null,
  bottom: null
};
function getArrowStyle(subjectsBounds, placement, arrowOffset) {
  var _extends2;

  if (placement.primary.isCenter) {
    return STYLE_BASE;
  }

  var layer = subjectsBounds.layer,
      trigger = subjectsBounds.trigger,
      arrow = subjectsBounds.arrow;
  var sizeProperty = placement.primary.oppositeSizeProp;
  var triggerIsBigger = trigger[sizeProperty] > layer[sizeProperty];
  var min = arrowOffset + arrow[sizeProperty] / 2;
  var max = layer[sizeProperty] - arrow[sizeProperty] / 2 - arrowOffset;
  var negativeOffset = getNegativeOffsetBetweenLayerCenterAndTrigger(subjectsBounds, placement, arrowOffset);
  var primarySide = placement.primary.prop;
  var secondarySide = placement.primary.oppositeCssProp;
  var secondaryValue = triggerIsBigger ? layer[sizeProperty] / 2 + negativeOffset : trigger[secondarySide] + trigger[sizeProperty] / 2 - layer[secondarySide];
  return _extends({}, STYLE_BASE, (_extends2 = {}, _extends2[primarySide] = "100%", _extends2[secondarySide] = limit(secondaryValue, min, max), _extends2));
}

/**
 * Class mostly concerned about calculating and finding the right placement
 */

var Placements = /*#__PURE__*/function () {
  function Placements(placements, config, subjectsBounds) {
    this.placements = placements;
    this.config = config;
    this.subjectsBounds = subjectsBounds;
  }
  /**
   * Converts a placement-type into a primary-side and a secondary-side
   */


  Placements.getSidesFromPlacementType = function getSidesFromPlacementType(type) {
    var _type$split = type.split("-"),
        a = _type$split[0],
        b = _type$split[1];

    var primary = BoundSide[a];
    var secondary;

    if (b === "center") {
      secondary = Side.center;
    } else if (primary.isHorizontal) {
      secondary = b === "start" ? Side.top : Side.bottom;
    } else {
      secondary = b === "start" ? Side.left : Side.right;
    }

    return [primary, secondary];
  }
  /**
   * Main static method to create a Placements instance
   * @param subjectsBounds instance of the SubjectsBounds class
   * @param config config provided by the user
   */
  ;

  Placements.create = function create(subjectsBounds, config) {
    // create offsets-object from user config
    var offsets = {
      arrow: config.arrowOffset,
      container: config.containerOffset,
      trigger: config.triggerOffset
    }; // function which creates a prioritized list of possible placments
    // by looking at user-config

    function getListOfPlacements(preferedPlacement) {
      if (preferedPlacement === void 0) {
        preferedPlacement = config.placement;
      }

      var _Placements$getSidesF = Placements.getSidesFromPlacementType(preferedPlacement),
          primary = _Placements$getSidesF[0],
          secondary = _Placements$getSidesF[1];

      var preferredSide = BoundSide[primary.isHorizontal ? config.preferY : config.preferX]; // some priorities may alter when the trigger is bigger

      var triggerIsBigger = !primary.isHorizontal && subjectsBounds.triggerHasBiggerWidth || primary.isHorizontal && subjectsBounds.triggerHasBiggerHeight; // utility function which constructs a placement by primary and secondary sides

      function placementFrom(primary, secondary) {
        return new Placement(primary, secondary, subjectsBounds, config.layerDimensions, offsets);
      } // creating the list


      var list = [];
      list[0] = placementFrom(primary, secondary);
      list[1] = placementFrom(primary, secondary.isCenter ? preferredSide : Side.center);
      list[2] = placementFrom(primary, Side[(secondary.opposite.isCenter ? preferredSide.opposite : secondary.opposite).prop]);
      list[3] = placementFrom(preferredSide, triggerIsBigger ? primary : Side[primary.opposite.prop]);
      list[4] = placementFrom(preferredSide, Side.center);
      list[5] = placementFrom(preferredSide, triggerIsBigger ? Side[primary.opposite.prop] : primary);
      list[6] = placementFrom(BoundSide[preferredSide.opposite.prop], triggerIsBigger ? primary : Side[primary.opposite.prop]);
      list[7] = placementFrom(BoundSide[preferredSide.opposite.prop], Side.center);
      list[8] = placementFrom(BoundSide[preferredSide.opposite.prop], triggerIsBigger ? Side[primary.opposite.prop] : primary);
      list[9] = placementFrom(BoundSide[primary.opposite.prop], secondary);
      list[10] = placementFrom(BoundSide[primary.opposite.prop], secondary.isCenter ? preferredSide : Side.center);
      list[11] = placementFrom(BoundSide[primary.opposite.prop], Side[(secondary.opposite.isCenter ? preferredSide.opposite : secondary.opposite).prop]); // only include placements that are part of 'possible-placements'

      list = list.filter(function (placement) {
        return placement.type === config.placement || config.possiblePlacements.includes(placement.type);
      });
      return list;
    } // treat placement 'center' a little bit different


    if (config.placement === "center") {
      return new Placements([new PlacementCenter(Side.center, Side.center, subjectsBounds, config.layerDimensions, offsets)].concat(getListOfPlacements(config.preferY + "-" + config.preferX)), config, subjectsBounds);
    }

    return new Placements(getListOfPlacements(), config, subjectsBounds);
  };

  var _proto = Placements.prototype;

  _proto.filterPlacementsBySide = function filterPlacementsBySide(side) {
    return this.placements.filter(function (placement) {
      return placement.primary === side;
    });
  };

  _proto.findFirstPlacementThatFits = function findFirstPlacementThatFits() {
    return this.placements.find(function (placement) {
      return placement.fitsContainer;
    });
  };

  _proto.placementWithBiggestVisibleSurface = function placementWithBiggestVisibleSurface() {
    var _this$placements$map$ = this.placements.map(function (placement) {
      return {
        placement: placement,
        surface: placement.visibleSurface
      };
    }) // sort -> biggest surface first
    .sort(function (a, b) {
      return b.surface - a.surface;
    }),
        placementWithBiggestSurface = _this$placements$map$[0].placement;

    return placementWithBiggestSurface;
  };

  _proto.findSuitablePlacement = function findSuitablePlacement() {
    if (!this.config.auto) {
      return this.placements[0];
    }

    return this.findFirstPlacementThatFits() || this.placementWithBiggestVisibleSurface();
  }
  /**
   * secondary offset: the number of pixels between the edge of the
   * scroll-container and the current placement, on the side of the layer
   * that didn't fit.
   * Eventually this secondary offset gets added / subtracted from the
   * placement that does fit in order to move the layer closer to the
   * position of the placement that just would not fit.
   * This creates the effect that the layer is moving gradually from one
   * placement to the next as the users scrolls the page or scroll-container
   */
  ;

  _proto.getSecondaryOffset = function getSecondaryOffset(placement) {
    var _this$config = this.config,
        auto = _this$config.auto,
        snap = _this$config.snap; // return early when we're not interested...

    if (!auto || snap || placement instanceof PlacementCenter) {
      return 0;
    } // if current placement fits and is prefered placement...
    // return early


    var placementsOnSameSide = this.filterPlacementsBySide(placement.primary);
    var currentPlacementHasHighestPriority = placementsOnSameSide.indexOf(placement) === 0;

    if (currentPlacementHasHighestPriority && placement.fitsContainer) {
      return 0;
    }

    var firstPlacementThatDoesNotFit = placementsOnSameSide.find(function (placement) {
      return !placement.fitsContainer;
    });

    if (!firstPlacementThatDoesNotFit) {
      return 0;
    }

    var secondaryOffsetSide = firstPlacementThatDoesNotFit.secondaryOffsetSide;

    if (!secondaryOffsetSide) {
      return 0;
    }

    var containerOffsets = placement.getContainerOffsets(); // determine whether we should add or substract the secondary-offset

    var secondary = placement.secondary;
    var factor;

    if (placement.triggerIsBigger || firstPlacementThatDoesNotFit === placement) {
      factor = secondaryOffsetSide.isPush ? -1 : 1;
    } else {
      factor = secondary === Side.left || [Side.top, Side.center].includes(secondary) && secondaryOffsetSide.isPush ? -1 : 1;
    } // get number of pixels between placement that did not fit and current
    // placement


    var secondaryOffset = containerOffsets[secondaryOffsetSide.prop];
    return secondaryOffset * factor;
  };

  _proto.getStyles = function getStyles(layerBounds, placement, scrollOffsets, borderOffsets) {
    var layerStyleBase = {
      willChange: "top, left, width, height"
    };
    var arrow = getArrowStyle(this.subjectsBounds.merge({
      layer: layerBounds
    }), placement, this.config.arrowOffset);
    var layer = this.config.overflowContainer ? _extends({}, layerStyleBase, {
      position: "fixed",
      top: layerBounds.top,
      left: layerBounds.left
    }) : _extends({}, layerStyleBase, {
      position: "absolute",
      top: layerBounds.top - this.subjectsBounds.parent.top + scrollOffsets.top - borderOffsets.top,
      left: layerBounds.left - this.subjectsBounds.parent.left + scrollOffsets.left - borderOffsets.left
    });
    return {
      arrow: arrow,
      layer: layer
    };
  };

  _proto.getHasDisappeared = function getHasDisappeared(layerBounds) {
    var subject = this.config.overflowContainer ? this.subjectsBounds.trigger : layerBounds;
    var containerOffsets = BoundsOffsets.mergeSmallestSides(this.subjectsBounds.offsetsToScrollContainers(subject, true));
    var entries = Object.entries(containerOffsets.negativeSides);
    var hasFullyDisappeared = entries.some(function (_ref) {
      var prop = _ref[0],
          value = _ref[1];
      var side = BoundSide[prop];
      return value <= -subject[side.sizeProp];
    });

    if (hasFullyDisappeared) {
      return "full";
    }

    if (!containerOffsets.allSidesArePositive) {
      return "partial";
    }

    return null;
  };

  _proto.result = function result(scrollOffsets, borderOffsets) {
    var suitablePlacement = this.findSuitablePlacement();
    var secondaryOffset = this.getSecondaryOffset(suitablePlacement);
    var layerBounds = suitablePlacement.getLayerBounds(secondaryOffset);
    var styles = this.getStyles(layerBounds, suitablePlacement, scrollOffsets, borderOffsets);
    var layerSide = suitablePlacement.primary.prop;
    return {
      styles: styles,
      layerSide: layerSide,
      placement: suitablePlacement,
      layerBounds: layerBounds,
      hasDisappeared: this.getHasDisappeared(layerBounds)
    };
  };

  return Placements;
}();

var SubjectsBounds = /*#__PURE__*/function () {
  function SubjectsBounds(subjectsBounds, overflowContainer) {
    this.overflowContainer = overflowContainer;
    Object.assign(this, subjectsBounds);
  }

  SubjectsBounds.create = function create(environment, layer, trigger, parent, arrow, scrollContainers, overflowContainer, getTriggerBounds) {
    var window = Bounds.fromWindow(environment);
    return new SubjectsBounds({
      layer: Bounds.fromElement(layer, {
        environment: environment,
        withTransform: false
      }),
      trigger: getTriggerBounds ? Bounds.create(boundsToObject(getTriggerBounds())) : Bounds.fromElement(trigger),
      arrow: arrow ? Bounds.fromElement(arrow) : Bounds.empty(),
      parent: parent ? Bounds.fromElement(parent) : window,
      window: window,
      scrollContainers: [window].concat(scrollContainers.map(function (container) {
        return Bounds.fromElement(container, {
          withScrollbars: false
        });
      }))
    }, overflowContainer);
  };

  var _proto = SubjectsBounds.prototype;

  _proto.merge = function merge(subjectsBounds) {
    return new SubjectsBounds(_extends({}, this, subjectsBounds), this.overflowContainer);
  };

  _proto.offsetsToScrollContainers = function offsetsToScrollContainers(subject, allContainers) {
    if (allContainers === void 0) {
      allContainers = false;
    }

    var scrollContainers = this.overflowContainer && !allContainers ? [this.window] : this.scrollContainers;
    return scrollContainers.map(function (scrollContainer) {
      return scrollContainer.offsetsTo(subject);
    });
  };

  _createClass(SubjectsBounds, [{
    key: "layerOffsetsToScrollContainers",
    get: function get() {
      return this.offsetsToScrollContainers(this.layer);
    }
  }, {
    key: "triggerHasBiggerWidth",
    get: function get() {
      return this.trigger.width > this.layer.width;
    }
  }, {
    key: "triggerHasBiggerHeight",
    get: function get() {
      return this.trigger.height > this.layer.height;
    }
  }]);

  return SubjectsBounds;
}();

var GLOBAL_CONTAINER = null;
function setGlobalContainer(container) {
  if (typeof document === "undefined") {
    return;
  }

   true ? tiny_warning__WEBPACK_IMPORTED_MODULE_2___default()(!(GLOBAL_CONTAINER instanceof HTMLElement), "react-laag: You've called 'setGlobalContainer() previously'. It is recommended to only set the global container once, otherwise this may lead to unexpected behaviour.") : 0;

  if (typeof container === "function") {
    GLOBAL_CONTAINER = container();
  } else if (typeof container === "string") {
    GLOBAL_CONTAINER = document.getElementById(container);
  } else {
    GLOBAL_CONTAINER = container;
  }

   true ? tiny_warning__WEBPACK_IMPORTED_MODULE_2___default()(GLOBAL_CONTAINER instanceof HTMLElement, "react-laag: You've called 'setGlobalContainer()', but it didn't result in a valid html-element") : 0;
}
var DEFAULT_OPTIONS = {
  auto: false,
  arrowOffset: 0,
  containerOffset: 10,
  triggerOffset: 0,
  overflowContainer: true,
  placement: "top-center",
  possiblePlacements: PLACEMENT_TYPES,
  preferX: "right",
  preferY: "bottom",
  snap: false,
  container: undefined,
  trigger: undefined
};
function useLayer(_ref) {
  var _triggerBoundsRef$cur;

  var _ref$isOpen = _ref.isOpen,
      isOpen = _ref$isOpen === void 0 ? false : _ref$isOpen,
      _ref$overflowContaine = _ref.overflowContainer,
      overflowContainer = _ref$overflowContaine === void 0 ? DEFAULT_OPTIONS.overflowContainer : _ref$overflowContaine,
      _ref$environment = _ref.environment,
      environment = _ref$environment === void 0 ? typeof window !== "undefined" ? window : undefined : _ref$environment,
      ResizeObserverPolyfill = _ref.ResizeObserver,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? DEFAULT_OPTIONS.placement : _ref$placement,
      _ref$possiblePlacemen = _ref.possiblePlacements,
      possiblePlacements = _ref$possiblePlacemen === void 0 ? DEFAULT_OPTIONS.possiblePlacements : _ref$possiblePlacemen,
      _ref$preferX = _ref.preferX,
      preferX = _ref$preferX === void 0 ? DEFAULT_OPTIONS.preferX : _ref$preferX,
      _ref$preferY = _ref.preferY,
      preferY = _ref$preferY === void 0 ? DEFAULT_OPTIONS.preferY : _ref$preferY,
      _ref$auto = _ref.auto,
      auto = _ref$auto === void 0 ? DEFAULT_OPTIONS.auto : _ref$auto,
      _ref$snap = _ref.snap,
      snap = _ref$snap === void 0 ? DEFAULT_OPTIONS.snap : _ref$snap,
      _ref$triggerOffset = _ref.triggerOffset,
      triggerOffset = _ref$triggerOffset === void 0 ? DEFAULT_OPTIONS.triggerOffset : _ref$triggerOffset,
      _ref$containerOffset = _ref.containerOffset,
      containerOffset = _ref$containerOffset === void 0 ? DEFAULT_OPTIONS.containerOffset : _ref$containerOffset,
      _ref$arrowOffset = _ref.arrowOffset,
      arrowOffset = _ref$arrowOffset === void 0 ? DEFAULT_OPTIONS.arrowOffset : _ref$arrowOffset,
      _ref$container = _ref.container,
      container = _ref$container === void 0 ? DEFAULT_OPTIONS.container : _ref$container,
      _ref$layerDimensions = _ref.layerDimensions,
      layerDimensions = _ref$layerDimensions === void 0 ? null : _ref$layerDimensions,
      onDisappear = _ref.onDisappear,
      onOutsideClick = _ref.onOutsideClick,
      onParentClose = _ref.onParentClose,
      triggerOption = _ref.trigger;

  // initialize styles
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(function () {
    return {
      layerSide: placement === "center" ? "center" : Placements.getSidesFromPlacementType(placement)[0].prop,
      styles: {
        layer: {
          position: overflowContainer ? "fixed" : "absolute",
          top: 0,
          left: 0
        },
        arrow: {
          position: "absolute",
          top: 0,
          left: 0
        }
      }
    };
  }),
      state = _useState[0],
      setState = _useState[1];

  var triggerBoundsRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // tracks state in order for us to use read inside functions that require dependencies,
  // like `useCallback`, without triggering an update

  var lastState = useLastState(state, isOpen); // keeps track of scheduled animation-frames

  var raf = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      // when this hook unmounts, make sure to cancel any scheduled animation-frames
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, []); // Most important function regarding positioning
  // It receives boundaries collected by `useTrackElements`, does some calculations,
  // sets new styles, and handles when a layer has disappeared.

  var handlePositioning = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function handlePositioning(_ref2, scrollOffsets, borderOffsets) {
    var arrow = _ref2.arrow,
        layer = _ref2.layer,
        scrollContainers = _ref2.scrollContainers,
        trigger = _ref2.trigger;
    var parent = scrollContainers[0];
    var subjectsBounds = SubjectsBounds.create(environment, layer, trigger, parent, arrow, scrollContainers, overflowContainer, triggerOption == null ? void 0 : triggerOption.getBounds);
    var config = {
      placement: placement,
      possiblePlacements: possiblePlacements,
      auto: auto,
      layerDimensions: layerDimensions,
      arrowOffset: arrowOffset,
      containerOffset: containerOffset,
      triggerOffset: triggerOffset,
      preferX: preferX,
      preferY: preferY,
      snap: snap,
      overflowContainer: overflowContainer
    };

    var _Placements$create$re = Placements.create(subjectsBounds, config).result(scrollOffsets, borderOffsets),
        hasDisappeared = _Placements$create$re.hasDisappeared,
        layerSide = _Placements$create$re.layerSide,
        styles = _Placements$create$re.styles;

    var newState = {
      layerSide: layerSide,
      styles: styles
    };

    if (!lastState.current || didStateChange(lastState.current, newState)) {
      lastState.current = newState; // optimistically update lastState to prevent infinite loop

      /**
       * We're using requestAnimationFrame-features here to ensure that position updates will
       * happen max once per frame.
       * If during a frame there's already an update scheduled, the existing update will be cancelled
       * and the new update will take precedence.
       */

      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }

      raf.current = requestAnimationFrame(function () {
        setState(newState);
        raf.current = null;
      });
    }

    if (isSet(hasDisappeared) && isSet(onDisappear)) {
      onDisappear(hasDisappeared);
    }
  }, [arrowOffset, auto, containerOffset, environment, layerDimensions, onDisappear, overflowContainer, placement, possiblePlacements, preferX, preferY, snap, triggerOffset, lastState, triggerOption]);

  var _useTrackElements = useTrackElements({
    ResizeObserverPolyfill: ResizeObserverPolyfill,
    environment: environment,
    enabled: isOpen,
    overflowContainer: overflowContainer,
    onChange: handlePositioning,
    triggerOption: triggerOption
  }),
      triggerRef = _useTrackElements.triggerRef,
      layerRef = _useTrackElements.layerRef,
      arrowRef = _useTrackElements.arrowRef,
      closestScrollContainer = _useTrackElements.closestScrollContainer;

  var _useGroup = useGroup({
    isOpen: isOpen,
    onOutsideClick: onOutsideClick,
    onParentClose: onParentClose
  }),
      closeOnOutsideClickRefs = _useGroup.closeOnOutsideClickRefs,
      registrations = _useGroup.registrations;

  var props = {
    triggerProps: Boolean(triggerOption) ? {} // when using the `trigger` option, make `triggerProps` useless
    : {
      ref: mergeRefs(triggerRef, closeOnOutsideClickRefs.trigger, triggerBoundsRef)
    },
    layerProps: {
      ref: mergeRefs(layerRef, closeOnOutsideClickRefs.layer),
      style: state.styles.layer
    },
    arrowProps: {
      ref: arrowRef,
      style: state.styles.arrow,
      layerSide: state.layerSide
    },
    layerSide: state.layerSide,
    triggerBounds: isOpen ? triggerOption ? triggerOption.getBounds() : (_triggerBoundsRef$cur = triggerBoundsRef.current) == null ? void 0 : _triggerBoundsRef$cur.getBoundingClientRect() : null,
    renderLayer: function renderLayer(children) {
      return typeof document !== "undefined" ? (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(GroupProvider, {
        registrations: registrations,
        children: children
      }), overflowContainer || !closestScrollContainer ? getContainerElement(container) : closestScrollContainer) : null;
    }
  };
  return props;
}

function didStateChange(previous, next) {
  if (previous.layerSide !== next.layerSide) {
    return true;
  }

  var styleProps = ["position", "top", "left", "right", "bottom"];

  for (var _i = 0, _styleProps = styleProps; _i < _styleProps.length; _i++) {
    var prop = _styleProps[_i];

    if (previous.styles.layer[prop] !== next.styles.layer[prop] || previous.styles.arrow[prop] !== next.styles.arrow[prop]) {
      return true;
    }
  }

  return false;
}

var DEFAULT_CONTAINER_ID = "layers";

function getContainerElement(container) {
  var element;

  if (typeof container === "function") {
    element = container();

    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("react-laag: You've passed a function to the 'container' prop, but it returned no valid HTMLElement");
    }
  } else if (container instanceof HTMLElement) {
    element = container;
  } else if (typeof container === "string") {
    element = document.getElementById(container);

    if (!element) {
      throw new Error("react-laag: You've passed element with id '" + container + "' to the 'container' prop, but it returned no valid HTMLElement");
    }
  } else if (GLOBAL_CONTAINER instanceof HTMLElement) {
    return GLOBAL_CONTAINER;
  } else {
    element = document.getElementById(DEFAULT_CONTAINER_ID);

    if (!element) {
      element = document.createElement("div");
      element.id = DEFAULT_CONTAINER_ID;
      element.style.cssText = "\n        position: absolute;\n        top: 0px;\n        left: 0px;\n        right: 0px;\n      ";
      document.body.appendChild(element);
    }
  }

  return element;
}

var LEFT = "left";
var TOP = "top";
var BOTTOM = "bottom";
var RIGHT = "right";

function getWidthBasedOnAngle(angle, size) {
  return Math.tan(angle * (Math.PI / 180)) * size;
}

function getViewBox(sizeA, sizeB, side, borderWidth) {
  var _map;

  var map = (_map = {}, _map[BOTTOM] = "0 " + -borderWidth + " " + sizeB + " " + sizeA, _map[TOP] = "0 0 " + sizeB + " " + (sizeA + borderWidth), _map[RIGHT] = -borderWidth + " 0 " + sizeA + " " + sizeB, _map[LEFT] = "0 0 " + (sizeA + borderWidth) + " " + sizeB, _map);
  return map[side.prop];
}

function getTrianglePath(sizeA, sizeB, side, roundness, angle) {
  var _BOTTOM$TOP$RIGHT$LEF, _BOTTOM$TOP$RIGHT$LEF2, _BOTTOM$TOP$RIGHT$LEF3;

  var relativeRoundness = roundness / 10 * sizeA * 2;
  var A = (_BOTTOM$TOP$RIGHT$LEF = {}, _BOTTOM$TOP$RIGHT$LEF[BOTTOM] = [0, sizeA], _BOTTOM$TOP$RIGHT$LEF[TOP] = [0, 0], _BOTTOM$TOP$RIGHT$LEF[RIGHT] = [sizeA, sizeB], _BOTTOM$TOP$RIGHT$LEF[LEFT] = [0, sizeB], _BOTTOM$TOP$RIGHT$LEF)[side.prop].join(" ");
  var B = side.isHorizontal ? "V 0" : "H " + sizeB;
  var cPoint = sizeB / 2;
  var c1A = sizeB / 2 + getWidthBasedOnAngle(angle, sizeA / 8);
  var c1B = sizeA / 8;
  var C = (_BOTTOM$TOP$RIGHT$LEF2 = {}, _BOTTOM$TOP$RIGHT$LEF2[BOTTOM] = ["C", c1A, c1B, cPoint + relativeRoundness, 0, cPoint, 0], _BOTTOM$TOP$RIGHT$LEF2[TOP] = ["C", c1A, sizeA - c1B, cPoint + relativeRoundness, sizeA, cPoint, sizeA], _BOTTOM$TOP$RIGHT$LEF2[RIGHT] = ["C", c1B, sizeB - c1A, 0, cPoint - relativeRoundness, 0, cPoint], _BOTTOM$TOP$RIGHT$LEF2[LEFT] = ["C", sizeA - c1B, sizeB - c1A, sizeA, cPoint - relativeRoundness, sizeA, cPoint], _BOTTOM$TOP$RIGHT$LEF2)[side.prop].join(" ");
  var d1A = sizeB / 2 - getWidthBasedOnAngle(angle, sizeA / 8);
  var d1B = sizeA / 8;
  var D = (_BOTTOM$TOP$RIGHT$LEF3 = {}, _BOTTOM$TOP$RIGHT$LEF3[BOTTOM] = ["C", cPoint - relativeRoundness, 0, d1A, d1B, A], _BOTTOM$TOP$RIGHT$LEF3[TOP] = ["C", cPoint - relativeRoundness, sizeA, d1A, sizeA - d1B, A], _BOTTOM$TOP$RIGHT$LEF3[RIGHT] = ["C", 0, cPoint + relativeRoundness, d1B, sizeB - d1A, A], _BOTTOM$TOP$RIGHT$LEF3[LEFT] = ["C", sizeA, cPoint + relativeRoundness, sizeA - d1B, sizeB - d1A, A], _BOTTOM$TOP$RIGHT$LEF3)[side.prop].join(" ");
  return ["M", A, B, C, D].join(" ");
}

function getBorderMaskPath(sizeA, sizeB, borderWidth, side, angle) {
  var borderOffset = getWidthBasedOnAngle(angle, borderWidth);

  var _ref = !side.isPush ? [sizeA, sizeA - borderWidth] : [0, borderWidth],
      A = _ref[0],
      B = _ref[1];

  if (side.isHorizontal) {
    return ["M", A, borderWidth, "V", sizeB - borderWidth, "L", B, sizeB - borderWidth - borderOffset, "V", borderOffset + borderWidth, "Z"].join(" ");
  }

  return ["M", borderWidth, A, "H", sizeB - borderWidth, "L", sizeB - borderWidth - borderOffset, B, "H", borderOffset + borderWidth, "Z"].join(" ");
}

var Arrow = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function Arrow(_ref2, ref) {
  var _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? 8 : _ref2$size,
      _ref2$angle = _ref2.angle,
      angle = _ref2$angle === void 0 ? 45 : _ref2$angle,
      _ref2$borderWidth = _ref2.borderWidth,
      borderWidth = _ref2$borderWidth === void 0 ? 0 : _ref2$borderWidth,
      _ref2$borderColor = _ref2.borderColor,
      borderColor = _ref2$borderColor === void 0 ? "black" : _ref2$borderColor,
      _ref2$roundness = _ref2.roundness,
      roundness = _ref2$roundness === void 0 ? 0 : _ref2$roundness,
      _ref2$backgroundColor = _ref2.backgroundColor,
      backgroundColor = _ref2$backgroundColor === void 0 ? "white" : _ref2$backgroundColor,
      _ref2$layerSide = _ref2.layerSide,
      layerSide = _ref2$layerSide === void 0 ? "top" : _ref2$layerSide,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? {} : _ref2$style,
      rest = _objectWithoutPropertiesLoose(_ref2, ["size", "angle", "borderWidth", "borderColor", "roundness", "backgroundColor", "layerSide", "style"]);

  if (layerSide === "center") {
    return null;
  }

  var side = BoundSide[layerSide];
  var sizeA = size;
  var sizeB = getWidthBasedOnAngle(angle, size) * 2;
  var maxSize = Math.max(sizeA, sizeB);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", _extends({
    ref: ref
  }, rest, {
    style: _extends({}, style, {
      transform: "translate" + (side.isHorizontal ? "Y" : "X") + "(-50%)"
    }),
    width: maxSize,
    height: maxSize,
    preserveAspectRatio: side.isPush ? "xMinYMin" : "xMaxYMax",
    viewBox: getViewBox(sizeA, sizeB, side, borderWidth)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: backgroundColor,
    strokeWidth: borderWidth,
    stroke: borderColor,
    d: getTrianglePath(sizeA, sizeB, side, roundness, angle)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: backgroundColor,
    d: getBorderMaskPath(sizeA, sizeB, borderWidth, side, angle)
  }));
});

var Status;

(function (Status) {
  Status[Status["ENTERING"] = 0] = "ENTERING";
  Status[Status["LEAVING"] = 1] = "LEAVING";
  Status[Status["IDLE"] = 2] = "IDLE";
})(Status || (Status = {}));

function useHover(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$delayEnter = _ref.delayEnter,
      delayEnter = _ref$delayEnter === void 0 ? 0 : _ref$delayEnter,
      _ref$delayLeave = _ref.delayLeave,
      delayLeave = _ref$delayLeave === void 0 ? 0 : _ref$delayLeave,
      _ref$hideOnScroll = _ref.hideOnScroll,
      hideOnScroll = _ref$hideOnScroll === void 0 ? true : _ref$hideOnScroll;

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      show = _useState[0],
      setShow = _useState[1];

  var timeout = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var status = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(Status.IDLE);
  var hasTouchMoved = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  var removeTimeout = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function removeTimeout() {
    clearTimeout(timeout.current);
    timeout.current = null;
    status.current = Status.IDLE;
  }, []);

  function onMouseEnter() {
    // if was leaving, stop leaving
    if (status.current === Status.LEAVING && timeout.current) {
      removeTimeout();
    }

    if (show) {
      return;
    }

    status.current = Status.ENTERING;
    timeout.current = setTimeout(function () {
      setShow(true);
      timeout.current = null;
      status.current = Status.IDLE;
    }, delayEnter);
  }

  function onMouseLeave(_, immediate) {
    // if was waiting for entering,
    // clear timeout
    if (status.current === Status.ENTERING && timeout.current) {
      removeTimeout();
    }

    if (!show) {
      return;
    }

    if (immediate) {
      setShow(false);
      timeout.current = null;
      status.current = Status.IDLE;
      return;
    }

    status.current = Status.LEAVING;
    timeout.current = setTimeout(function () {
      setShow(false);
      timeout.current = null;
      status.current = Status.IDLE;
    }, delayLeave);
  } // make sure to clear timeout on unmount


  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var currentTimeout = timeout.current;

    function onScroll() {
      if (show && hideOnScroll) {
        removeTimeout();
        setShow(false);
      }
    }

    function onTouchEnd() {
      if (show) {
        removeTimeout();
        setShow(false);
      }
    }

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("touchend", onTouchEnd, true);
    return function () {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("touchend", onTouchEnd, true);

      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [show, hideOnScroll, removeTimeout]);
  var hoverProps = {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onTouchStart: function onTouchStart() {
      hasTouchMoved.current = false;
    },
    onTouchMove: function onTouchMove() {
      hasTouchMoved.current = true;
    },
    onTouchEnd: function onTouchEnd() {
      if (!hasTouchMoved.current && !show) {
        setShow(true);
      }

      hasTouchMoved.current = false;
    }
  };
  return [show, hoverProps, function () {
    return onMouseLeave(null, true);
  }];
}

/**
 * @deprecated
 * Note: this component is marked as deprecated and will be removed and a possible
 * future release
 */

function Transition(_ref) {
  var isOpenExternal = _ref.isOpen,
      children = _ref.children;

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    isOpenInternal: isOpenExternal,
    isLeaving: false
  }),
      state = _useState[0],
      setState = _useState[1];

  var didMount = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (isOpenExternal) {
      setState({
        isOpenInternal: true,
        isLeaving: false
      });
    } else if (didMount.current) {
      setState({
        isOpenInternal: false,
        isLeaving: true
      });
    }
  }, [isOpenExternal, setState]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    didMount.current = true;
  }, []);

  if (!isOpenExternal && !state.isOpenInternal && !state.isLeaving) {
    return null;
  }

  return children(state.isOpenInternal, function () {
    if (!state.isOpenInternal) {
      setState(function (s) {
        return _extends({}, s, {
          isLeaving: false
        });
      });
    }
  }, state.isLeaving);
}


//# sourceMappingURL=react-laag.esm.js.map


/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/Animated/index.js":
/*!***********************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/Animated/index.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../vendor/react-native/Animated/AnimatedImplementation */ "../../vendor/react-native/Animated/AnimatedImplementation");
/* harmony import */ var _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FlatList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../FlatList */ "./exports/FlatList");
/* harmony import */ var _FlatList__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_FlatList__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Image */ "./exports/Image");
/* harmony import */ var _Image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _SectionList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SectionList */ "./exports/SectionList");
/* harmony import */ var _SectionList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_SectionList__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ScrollView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ScrollView */ "./exports/ScrollView");
/* harmony import */ var _ScrollView__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_ScrollView__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Text */ "./exports/Text");
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Text__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../View */ "./exports/View");
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_View__WEBPACK_IMPORTED_MODULE_6__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */








var Animated = _objectSpread({}, (_vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default()), {
  FlatList: _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default().createAnimatedComponent((_FlatList__WEBPACK_IMPORTED_MODULE_1___default()), {
    scrollEventThrottle: 0.0001
  }),
  Image: _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default().createAnimatedComponent((_Image__WEBPACK_IMPORTED_MODULE_2___default())),
  ScrollView: _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default().createAnimatedComponent((_ScrollView__WEBPACK_IMPORTED_MODULE_4___default()), {
    scrollEventThrottle: 0.0001
  }),
  SectionList: _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default().createAnimatedComponent((_SectionList__WEBPACK_IMPORTED_MODULE_3___default()), {
    scrollEventThrottle: 0.0001
  }),
  View: _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default().createAnimatedComponent((_View__WEBPACK_IMPORTED_MODULE_6___default())),
  Text: _vendor_react_native_Animated_AnimatedImplementation__WEBPACK_IMPORTED_MODULE_0___default().createAnimatedComponent((_Text__WEBPACK_IMPORTED_MODULE_5___default()))
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Animated);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/Dimensions/index.js":
/*!*************************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/Dimensions/index.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dimensions)
/* harmony export */ });
/* harmony import */ var fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fbjs/lib/ExecutionEnvironment */ "fbjs/lib/ExecutionEnvironment");
/* harmony import */ var fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fbjs_lib_invariant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fbjs/lib/invariant */ "fbjs/lib/invariant");
/* harmony import */ var fbjs_lib_invariant__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fbjs_lib_invariant__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


var win = fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__.canUseDOM ? window : {
  devicePixelRatio: undefined,
  innerHeight: undefined,
  innerWidth: undefined,
  screen: {
    height: undefined,
    width: undefined
  }
};
var dimensions = {};
var listeners = {};

var Dimensions =
/*#__PURE__*/
function () {
  function Dimensions() {}

  Dimensions.get = function get(dimension) {
    fbjs_lib_invariant__WEBPACK_IMPORTED_MODULE_1___default()(dimensions[dimension], "No dimension set for key " + dimension);
    return dimensions[dimension];
  };

  Dimensions.set = function set(initialDimensions) {
    if (initialDimensions) {
      if (fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__.canUseDOM) {
        fbjs_lib_invariant__WEBPACK_IMPORTED_MODULE_1___default()(false, 'Dimensions cannot be set in the browser');
      } else {
        dimensions.screen = initialDimensions.screen;
        dimensions.window = initialDimensions.window;
      }
    }
  };

  Dimensions._update = function _update() {
    dimensions.window = {
      fontScale: 1,
      height: win.innerHeight,
      scale: win.devicePixelRatio || 1,
      width: win.innerWidth
    };
    dimensions.screen = {
      fontScale: 1,
      height: win.screen.height,
      scale: win.devicePixelRatio || 1,
      width: win.screen.width
    };

    if (Array.isArray(listeners['change'])) {
      listeners['change'].forEach(function (handler) {
        return handler(dimensions);
      });
    }
  };

  Dimensions.addEventListener = function addEventListener(type, handler) {
    listeners[type] = listeners[type] || [];
    listeners[type].push(handler);
  };

  Dimensions.removeEventListener = function removeEventListener(type, handler) {
    if (Array.isArray(listeners[type])) {
      listeners[type] = listeners[type].filter(function (_handler) {
        return _handler !== handler;
      });
    }
  };

  return Dimensions;
}();



Dimensions._update();

if (fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__.canUseDOM) {
  window.addEventListener('resize', Dimensions._update, false);
}

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/Modal/index.js":
/*!********************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/Modal/index.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./cjs/react.development.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ModalPortal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ModalPortal */ "./ModalPortal");
/* harmony import */ var _ModalPortal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ModalPortal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ModalAnimation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ModalAnimation */ "./ModalAnimation");
/* harmony import */ var _ModalAnimation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ModalAnimation__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ModalContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModalContent */ "./ModalContent");
/* harmony import */ var _ModalContent__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_ModalContent__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ModalFocusTrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ModalFocusTrap */ "./ModalFocusTrap");
/* harmony import */ var _ModalFocusTrap__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_ModalFocusTrap__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */





var uniqueModalIdentifier = 0;
var activeModalStack = [];
var activeModalListeners = {};

function notifyActiveModalListeners() {
  if (activeModalStack.length === 0) {
    return;
  }

  var activeModalId = activeModalStack[activeModalStack.length - 1];
  activeModalStack.forEach(function (modalId) {
    if (modalId in activeModalListeners) {
      activeModalListeners[modalId](modalId === activeModalId);
    }
  });
}

function removeActiveModal(modalId) {
  if (modalId in activeModalListeners) {
    // Before removing this listener we should probably tell it
    // that it's no longer the active modal for sure.
    activeModalListeners[modalId](false);
    delete activeModalListeners[modalId];
  }

  var index = activeModalStack.indexOf(modalId);

  if (index !== -1) {
    activeModalStack.splice(index, 1);
    notifyActiveModalListeners();
  }
}

function addActiveModal(modalId, listener) {
  removeActiveModal(modalId);
  activeModalStack.push(modalId);
  activeModalListeners[modalId] = listener;
  notifyActiveModalListeners();
}

var Modal = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, forwardedRef) {
  var animationType = props.animationType,
      children = props.children,
      onDismiss = props.onDismiss,
      onRequestClose = props.onRequestClose,
      onShow = props.onShow,
      transparent = props.transparent,
      _props$visible = props.visible,
      visible = _props$visible === void 0 ? true : _props$visible; // Set a unique model identifier so we can correctly route
  // dismissals and check the layering of modals.

  var modalId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return uniqueModalIdentifier++;
  }, []);

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      isActive = _useState[0],
      setIsActive = _useState[1];

  var onDismissCallback = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    removeActiveModal(modalId);

    if (onDismiss) {
      onDismiss();
    }
  }, [modalId, onDismiss]);
  var onShowCallback = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    addActiveModal(modalId, setIsActive);

    if (onShow) {
      onShow();
    }
  }, [modalId, onShow]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      return removeActiveModal(modalId);
    };
  }, [modalId]);
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((_ModalPortal__WEBPACK_IMPORTED_MODULE_1___default()), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement((_ModalAnimation__WEBPACK_IMPORTED_MODULE_2___default()), {
    animationType: animationType,
    onDismiss: onDismissCallback,
    onShow: onShowCallback,
    visible: visible
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement((_ModalFocusTrap__WEBPACK_IMPORTED_MODULE_4___default()), {
    active: isActive
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement((_ModalContent__WEBPACK_IMPORTED_MODULE_3___default()), {
    active: isActive,
    onRequestClose: onRequestClose,
    ref: forwardedRef,
    transparent: transparent
  }, children))));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/Platform/index.js":
/*!***********************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/Platform/index.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var Platform = {
  OS: 'web',
  select: function select(obj) {
    return 'web' in obj ? obj.web : obj.default;
  },

  get isTesting() {
    if (process.env.NODE_DEV === 'test') {
      return true;
    }

    return false;
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Platform);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/StyleSheet/index.js":
/*!*************************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/StyleSheet/index.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fbjs/lib/ExecutionEnvironment */ "fbjs/lib/ExecutionEnvironment");
/* harmony import */ var fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StyleSheet */ "./StyleSheet");
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

 // allow original component styles to be inspected in React Dev Tools

if (fbjs_lib_ExecutionEnvironment__WEBPACK_IMPORTED_MODULE_0__.canUseDOM && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.resolveRNStyle = (_StyleSheet__WEBPACK_IMPORTED_MODULE_1___default().flatten);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_StyleSheet__WEBPACK_IMPORTED_MODULE_1___default()));

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/Text/index.js":
/*!*******************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/Text/index.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./cjs/react.development.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../createElement */ "./exports/createElement");
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_createElement__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../StyleSheet/css */ "../StyleSheet/css");
/* harmony import */ var _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modules_pick__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../modules/pick */ "../../modules/pick");
/* harmony import */ var _modules_pick__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_pick__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../modules/useElementLayout */ "../../modules/useElementLayout");
/* harmony import */ var _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../modules/useMergeRefs */ "../../modules/useMergeRefs");
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../modules/usePlatformMethods */ "../../modules/usePlatformMethods");
/* harmony import */ var _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../modules/useResponderEvents */ "../../modules/useResponderEvents");
/* harmony import */ var _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../StyleSheet */ "./exports/StyleSheet");
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _TextAncestorContext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./TextAncestorContext */ "../Text/TextAncestorContext");
/* harmony import */ var _TextAncestorContext__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */











var forwardPropsList = {
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  accessible: true,
  children: true,
  classList: true,
  className: true,
  dir: true,
  importantForAccessibility: true,
  lang: true,
  nativeID: true,
  onBlur: true,
  onClick: true,
  onClickCapture: true,
  onContextMenu: true,
  onFocus: true,
  onKeyDown: true,
  onKeyUp: true,
  onTouchCancel: true,
  onTouchCancelCapture: true,
  onTouchEnd: true,
  onTouchEndCapture: true,
  onTouchMove: true,
  onTouchMoveCapture: true,
  onTouchStart: true,
  onTouchStartCapture: true,
  pointerEvents: true,
  ref: true,
  style: true,
  testID: true,
  // unstable
  dataSet: true,
  onMouseDown: true,
  onMouseEnter: true,
  onMouseLeave: true,
  onMouseMove: true,
  onMouseOver: true,
  onMouseOut: true,
  onMouseUp: true,
  onScroll: true,
  onWheel: true,
  href: true,
  rel: true,
  target: true
};

var pickProps = function pickProps(props) {
  return _modules_pick__WEBPACK_IMPORTED_MODULE_3___default()(props, forwardPropsList);
};

var Text = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, forwardedRef) {
  var dir = props.dir,
      numberOfLines = props.numberOfLines,
      onClick = props.onClick,
      onLayout = props.onLayout,
      onPress = props.onPress,
      onMoveShouldSetResponder = props.onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture = props.onMoveShouldSetResponderCapture,
      onResponderEnd = props.onResponderEnd,
      onResponderGrant = props.onResponderGrant,
      onResponderMove = props.onResponderMove,
      onResponderReject = props.onResponderReject,
      onResponderRelease = props.onResponderRelease,
      onResponderStart = props.onResponderStart,
      onResponderTerminate = props.onResponderTerminate,
      onResponderTerminationRequest = props.onResponderTerminationRequest,
      onScrollShouldSetResponder = props.onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture = props.onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder = props.onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture = props.onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder = props.onStartShouldSetResponder,
      onStartShouldSetResponderCapture = props.onStartShouldSetResponderCapture,
      selectable = props.selectable;
  var hasTextAncestor = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)((_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9___default()));
  var hostRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var setRef = _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5___default()(forwardedRef, hostRef);
  var classList = [classes.text, hasTextAncestor === true && classes.textHasAncestor, numberOfLines === 1 && classes.textOneLine, numberOfLines != null && numberOfLines > 1 && classes.textMultiLine];
  var style = [props.style, numberOfLines != null && numberOfLines > 1 && {
    WebkitLineClamp: numberOfLines
  }, selectable === true && styles.selectable, selectable === false && styles.notSelectable, onPress && styles.pressable];
  _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4___default()(hostRef, onLayout);
  _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7___default()(hostRef, {
    onMoveShouldSetResponder: onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture: onMoveShouldSetResponderCapture,
    onResponderEnd: onResponderEnd,
    onResponderGrant: onResponderGrant,
    onResponderMove: onResponderMove,
    onResponderReject: onResponderReject,
    onResponderRelease: onResponderRelease,
    onResponderStart: onResponderStart,
    onResponderTerminate: onResponderTerminate,
    onResponderTerminationRequest: onResponderTerminationRequest,
    onScrollShouldSetResponder: onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture: onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder: onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture: onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder: onStartShouldSetResponder,
    onStartShouldSetResponderCapture: onStartShouldSetResponderCapture
  });

  function handleClick(e) {
    if (onClick != null) {
      onClick(e);
    }

    if (onClick == null && onPress != null) {
      e.stopPropagation();
      onPress(e);
    }
  }

  var component = hasTextAncestor ? 'span' : 'div';
  var supportedProps = pickProps(props);
  supportedProps.classList = classList;
  supportedProps.dir = dir; // 'auto' by default allows browsers to infer writing direction (root elements only)

  if (!hasTextAncestor) {
    supportedProps.dir = dir != null ? dir : 'auto';
  }

  supportedProps.onClick = handleClick;
  supportedProps.ref = setRef;
  supportedProps.style = style;
  _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6___default()(hostRef, supportedProps);
  var element = _createElement__WEBPACK_IMPORTED_MODULE_1___default()(component, supportedProps);
  return hasTextAncestor ? element : react__WEBPACK_IMPORTED_MODULE_0__.createElement((_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9___default().Provider), {
    value: true
  }, element);
});
Text.displayName = 'Text';
var classes = _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2___default().create({
  text: {
    // border: '0 solid black',
    // boxSizing: 'border-box',
    color: 'black',
    display: 'inline',
    // font: '14px System',
    // margin: 0,
    // padding: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  },
  textHasAncestor: {
    color: 'inherit',
    font: 'inherit',
    whiteSpace: 'inherit'
  },
  textOneLine: {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  // See #13
  textMultiLine: {
    display: '-webkit-box',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical'
  }
});
var styles = _StyleSheet__WEBPACK_IMPORTED_MODULE_8___default().create({
  notSelectable: {
    userSelect: 'none'
  },
  selectable: {
    userSelect: 'text'
  },
  pressable: {
    cursor: 'pointer'
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Text);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/TextInput/index.js":
/*!************************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/TextInput/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./cjs/react.development.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../createElement */ "./exports/createElement");
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_createElement__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../StyleSheet/css */ "../StyleSheet/css");
/* harmony import */ var _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modules_pick__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../modules/pick */ "../../modules/pick");
/* harmony import */ var _modules_pick__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_pick__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../modules/useElementLayout */ "../../modules/useElementLayout");
/* harmony import */ var _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _modules_useLayoutEffect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../modules/useLayoutEffect */ "../../modules/useLayoutEffect");
/* harmony import */ var _modules_useLayoutEffect__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_modules_useLayoutEffect__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../modules/useMergeRefs */ "../../modules/useMergeRefs");
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../modules/usePlatformMethods */ "../../modules/usePlatformMethods");
/* harmony import */ var _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../modules/useResponderEvents */ "../../modules/useResponderEvents");
/* harmony import */ var _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../StyleSheet */ "./exports/StyleSheet");
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _modules_TextInputState__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../modules/TextInputState */ "../../modules/TextInputState");
/* harmony import */ var _modules_TextInputState__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_modules_TextInputState__WEBPACK_IMPORTED_MODULE_10__);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */











/**
 * Determines whether a 'selection' prop differs from a node's existing
 * selection state.
 */

var isSelectionStale = function isSelectionStale(node, selection) {
  var selectionEnd = node.selectionEnd,
      selectionStart = node.selectionStart;
  var start = selection.start,
      end = selection.end;
  return start !== selectionStart || end !== selectionEnd;
};
/**
 * Certain input types do no support 'selectSelectionRange' and will throw an
 * error.
 */


var setSelection = function setSelection(node, selection) {
  if (isSelectionStale(node, selection)) {
    var start = selection.start,
        end = selection.end;

    try {
      node.setSelectionRange(start, end || start);
    } catch (e) {}
  }
};

var forwardPropsList = {
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  accessible: true,
  autoCapitalize: true,
  autoComplete: true,
  autoCorrect: true,
  autoFocus: true,
  children: true,
  classList: true,
  defaultValue: true,
  dir: true,
  disabled: true,
  importantForAccessibility: true,
  maxLength: true,
  nativeID: true,
  onBlur: true,
  onChange: true,
  onClick: true,
  onClickCapture: true,
  onContextMenu: true,
  onFocus: true,
  onScroll: true,
  onTouchCancel: true,
  onTouchCancelCapture: true,
  onTouchEnd: true,
  onTouchEndCapture: true,
  onTouchMove: true,
  onTouchMoveCapture: true,
  onTouchStart: true,
  onTouchStartCapture: true,
  placeholder: true,
  pointerEvents: true,
  readOnly: true,
  ref: true,
  rows: true,
  spellCheck: true,
  style: true,
  value: true,
  testID: true,
  type: true,
  // unstable
  dataSet: true,
  onMouseDown: true,
  onMouseEnter: true,
  onMouseLeave: true,
  onMouseMove: true,
  onMouseOver: true,
  onMouseOut: true,
  onMouseUp: true
};

var pickProps = function pickProps(props) {
  return _modules_pick__WEBPACK_IMPORTED_MODULE_3___default()(props, forwardPropsList);
}; // If an Input Method Editor is processing key input, the 'keyCode' is 229.
// https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode


function isEventComposing(nativeEvent) {
  return nativeEvent.isComposing || nativeEvent.keyCode === 229;
}

var TextInput = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, forwardedRef) {
  var _props$autoCapitalize = props.autoCapitalize,
      autoCapitalize = _props$autoCapitalize === void 0 ? 'sentences' : _props$autoCapitalize,
      autoComplete = props.autoComplete,
      autoCompleteType = props.autoCompleteType,
      _props$autoCorrect = props.autoCorrect,
      autoCorrect = _props$autoCorrect === void 0 ? true : _props$autoCorrect,
      blurOnSubmit = props.blurOnSubmit,
      clearTextOnFocus = props.clearTextOnFocus,
      dir = props.dir,
      _props$editable = props.editable,
      editable = _props$editable === void 0 ? true : _props$editable,
      _props$keyboardType = props.keyboardType,
      keyboardType = _props$keyboardType === void 0 ? 'default' : _props$keyboardType,
      _props$multiline = props.multiline,
      multiline = _props$multiline === void 0 ? false : _props$multiline,
      _props$numberOfLines = props.numberOfLines,
      numberOfLines = _props$numberOfLines === void 0 ? 1 : _props$numberOfLines,
      onBlur = props.onBlur,
      onChange = props.onChange,
      onChangeText = props.onChangeText,
      onContentSizeChange = props.onContentSizeChange,
      onFocus = props.onFocus,
      onKeyPress = props.onKeyPress,
      onLayout = props.onLayout,
      onMoveShouldSetResponder = props.onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture = props.onMoveShouldSetResponderCapture,
      onResponderEnd = props.onResponderEnd,
      onResponderGrant = props.onResponderGrant,
      onResponderMove = props.onResponderMove,
      onResponderReject = props.onResponderReject,
      onResponderRelease = props.onResponderRelease,
      onResponderStart = props.onResponderStart,
      onResponderTerminate = props.onResponderTerminate,
      onResponderTerminationRequest = props.onResponderTerminationRequest,
      onScrollShouldSetResponder = props.onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture = props.onScrollShouldSetResponderCapture,
      onSelectionChange = props.onSelectionChange,
      onSelectionChangeShouldSetResponder = props.onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture = props.onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder = props.onStartShouldSetResponder,
      onStartShouldSetResponderCapture = props.onStartShouldSetResponderCapture,
      onSubmitEditing = props.onSubmitEditing,
      placeholderTextColor = props.placeholderTextColor,
      returnKeyType = props.returnKeyType,
      _props$secureTextEntr = props.secureTextEntry,
      secureTextEntry = _props$secureTextEntr === void 0 ? false : _props$secureTextEntr,
      selection = props.selection,
      selectTextOnFocus = props.selectTextOnFocus,
      spellCheck = props.spellCheck;
  var type;
  var inputMode;

  switch (keyboardType) {
    case 'email-address':
      type = 'email';
      break;

    case 'number-pad':
    case 'numeric':
      inputMode = 'numeric';
      break;

    case 'decimal-pad':
      inputMode = 'decimal';
      break;

    case 'phone-pad':
      type = 'tel';
      break;

    case 'search':
    case 'web-search':
      type = 'search';
      break;

    case 'url':
      type = 'url';
      break;

    default:
      type = 'text';
  }

  if (secureTextEntry) {
    type = 'password';
  }

  var dimensions = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    height: null,
    width: null
  });
  var hostRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var handleContentSizeChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var node = hostRef.current;

    if (multiline && onContentSizeChange && node != null) {
      var newHeight = node.scrollHeight;
      var newWidth = node.scrollWidth;

      if (newHeight !== dimensions.current.height || newWidth !== dimensions.current.width) {
        dimensions.current.height = newHeight;
        dimensions.current.width = newWidth;
        onContentSizeChange({
          nativeEvent: {
            contentSize: {
              height: dimensions.current.height,
              width: dimensions.current.width
            }
          }
        });
      }
    }
  }, [hostRef, multiline, onContentSizeChange]);
  var imperativeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return function (hostNode) {
      // TextInput needs to add more methods to the hostNode in addition to those
      // added by `usePlatformMethods`. This is temporarily until an API like
      // `TextInput.clear(hostRef)` is added to React Native.
      if (hostNode != null) {
        hostNode.clear = function () {
          if (hostNode != null) {
            hostNode.value = '';
          }
        };

        hostNode.isFocused = function () {
          return hostNode != null && _modules_TextInputState__WEBPACK_IMPORTED_MODULE_10___default().currentlyFocusedField() === hostNode;
        };

        handleContentSizeChange();
      }
    };
  }, [handleContentSizeChange]);
  var setRef = _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_6___default()(forwardedRef, hostRef, imperativeRef);

  function handleBlur(e) {
    (_modules_TextInputState__WEBPACK_IMPORTED_MODULE_10___default()._currentlyFocusedNode) = null;

    if (onBlur) {
      e.nativeEvent.text = e.target.value;
      onBlur(e);
    }
  }

  function handleChange(e) {
    var text = e.target.value;
    e.nativeEvent.text = text;
    handleContentSizeChange();

    if (onChange) {
      onChange(e);
    }

    if (onChangeText) {
      onChangeText(text);
    }
  }

  function handleFocus(e) {
    var node = hostRef.current;

    if (node != null) {
      (_modules_TextInputState__WEBPACK_IMPORTED_MODULE_10___default()._currentlyFocusedNode) = node;

      if (onFocus) {
        e.nativeEvent.text = e.target.value;
        onFocus(e);
      }

      if (clearTextOnFocus) {
        node.value = '';
      }

      if (selectTextOnFocus) {
        node.select();
      }
    }
  }

  function handleKeyDown(e) {
    // Prevent key events bubbling (see #612)
    e.stopPropagation();
    var blurOnSubmitDefault = !multiline;
    var shouldBlurOnSubmit = blurOnSubmit == null ? blurOnSubmitDefault : blurOnSubmit;
    var nativeEvent = e.nativeEvent;
    var isComposing = isEventComposing(nativeEvent);

    if (onKeyPress) {
      onKeyPress(e);
    }

    if (e.key === 'Enter' && !e.shiftKey && // Do not call submit if composition is occuring.
    !isComposing && !e.isDefaultPrevented()) {
      if ((blurOnSubmit || !multiline) && onSubmitEditing) {
        // prevent "Enter" from inserting a newline or submitting a form
        e.preventDefault();
        nativeEvent.text = e.target.value;
        onSubmitEditing(e);
      }

      if (shouldBlurOnSubmit && hostRef.current != null) {
        hostRef.current.blur();
      }
    }
  }

  function handleSelectionChange(e) {
    if (onSelectionChange) {
      try {
        var node = e.target;
        var selectionStart = node.selectionStart,
            selectionEnd = node.selectionEnd;
        e.nativeEvent.selection = {
          start: selectionStart,
          end: selectionEnd
        };
        e.nativeEvent.text = e.target.value;
        onSelectionChange(e);
      } catch (e) {}
    }
  }

  _modules_useLayoutEffect__WEBPACK_IMPORTED_MODULE_5___default()(function () {
    var node = hostRef.current;

    if (node != null && selection != null) {
      setSelection(node, selection);
    }

    if (document.activeElement === node) {
      (_modules_TextInputState__WEBPACK_IMPORTED_MODULE_10___default()._currentlyFocusedNode) = node;
    }
  }, [hostRef, selection]);
  var component = multiline ? 'textarea' : 'input';
  var classList = [classes.textinput];
  var style = _StyleSheet__WEBPACK_IMPORTED_MODULE_9___default().compose(props.style, placeholderTextColor && {
    placeholderTextColor: placeholderTextColor
  });
  _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4___default()(hostRef, onLayout);
  _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_8___default()(hostRef, {
    onMoveShouldSetResponder: onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture: onMoveShouldSetResponderCapture,
    onResponderEnd: onResponderEnd,
    onResponderGrant: onResponderGrant,
    onResponderMove: onResponderMove,
    onResponderReject: onResponderReject,
    onResponderRelease: onResponderRelease,
    onResponderStart: onResponderStart,
    onResponderTerminate: onResponderTerminate,
    onResponderTerminationRequest: onResponderTerminationRequest,
    onScrollShouldSetResponder: onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture: onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder: onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture: onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder: onStartShouldSetResponder,
    onStartShouldSetResponderCapture: onStartShouldSetResponderCapture
  });
  var supportedProps = pickProps(props);
  supportedProps.autoCapitalize = autoCapitalize;
  supportedProps.autoComplete = autoComplete || autoCompleteType || 'on';
  supportedProps.autoCorrect = autoCorrect ? 'on' : 'off';
  supportedProps.classList = classList; // 'auto' by default allows browsers to infer writing direction

  supportedProps.dir = dir !== undefined ? dir : 'auto';
  supportedProps.enterKeyHint = returnKeyType;
  supportedProps.onBlur = handleBlur;
  supportedProps.onChange = handleChange;
  supportedProps.onFocus = handleFocus;
  supportedProps.onKeyDown = handleKeyDown;
  supportedProps.onSelect = handleSelectionChange;
  supportedProps.readOnly = !editable;
  supportedProps.ref = setRef;
  supportedProps.rows = multiline ? numberOfLines : undefined;
  supportedProps.spellCheck = spellCheck != null ? spellCheck : autoCorrect;
  supportedProps.style = style;
  supportedProps.type = multiline ? undefined : type;
  supportedProps.inputMode = inputMode;
  _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_7___default()(hostRef, supportedProps);
  return _createElement__WEBPACK_IMPORTED_MODULE_1___default()(component, supportedProps);
});
TextInput.displayName = 'TextInput'; // $FlowFixMe

TextInput.State = (_modules_TextInputState__WEBPACK_IMPORTED_MODULE_10___default());
var classes = _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2___default().create({
  textinput: {
    MozAppearance: 'textfield',
    WebkitAppearance: 'none',
    backgroundColor: 'transparent',
    border: '0 solid black',
    borderRadius: 0,
    boxSizing: 'border-box',
    font: '14px System',
    margin: 0,
    padding: 0,
    resize: 'none'
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TextInput);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/TouchableOpacity/index.js":
/*!*******************************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/TouchableOpacity/index.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./cjs/react.development.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../modules/useMergeRefs */ "../../modules/useMergeRefs");
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modules_usePressEvents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../modules/usePressEvents */ "../../modules/usePressEvents");
/* harmony import */ var _modules_usePressEvents__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_modules_usePressEvents__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../StyleSheet */ "./exports/StyleSheet");
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../View */ "./exports/View");
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_View__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */


function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }








/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 */
function TouchableOpacity(props, forwardedRef) {
  var accessible = props.accessible,
      activeOpacity = props.activeOpacity,
      delayPressIn = props.delayPressIn,
      delayPressOut = props.delayPressOut,
      delayLongPress = props.delayLongPress,
      disabled = props.disabled,
      focusable = props.focusable,
      onLongPress = props.onLongPress,
      onPress = props.onPress,
      onPressIn = props.onPressIn,
      onPressOut = props.onPressOut,
      rejectResponderTermination = props.rejectResponderTermination,
      style = props.style,
      rest = _objectWithoutPropertiesLoose(props, ["accessible", "activeOpacity", "delayPressIn", "delayPressOut", "delayLongPress", "disabled", "focusable", "onLongPress", "onPress", "onPressIn", "onPressOut", "rejectResponderTermination", "style"]);

  var hostRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var setRef = _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_1___default()(forwardedRef, hostRef);

  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('0s'),
      duration = _useState[0],
      setDuration = _useState[1];

  var _useState2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
      opacityOverride = _useState2[0],
      setOpacityOverride = _useState2[1];

  var setOpacityTo = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (value, duration) {
    setOpacityOverride(value);
    setDuration(duration ? duration / 1000 + "s" : '0s');
  }, [setOpacityOverride, setDuration]);
  var setOpacityActive = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (duration) {
    setOpacityTo(activeOpacity !== null && activeOpacity !== void 0 ? activeOpacity : 0.2, duration);
  }, [activeOpacity, setOpacityTo]);
  var setOpacityInactive = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (duration) {
    setOpacityTo(null, duration);
  }, [setOpacityTo]);
  var pressConfig = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      cancelable: !rejectResponderTermination,
      disabled: disabled,
      delayLongPress: delayLongPress,
      delayPressStart: delayPressIn,
      delayPressEnd: delayPressOut,
      onLongPress: onLongPress,
      onPress: onPress,
      onPressStart: function onPressStart(event) {
        setOpacityActive(event.dispatchConfig.registrationName === 'onResponderGrant' ? 0 : 150);

        if (onPressIn != null) {
          onPressIn(event);
        }
      },
      onPressEnd: function onPressEnd(event) {
        setOpacityInactive(250);

        if (onPressOut != null) {
          onPressOut(event);
        }
      }
    };
  }, [delayLongPress, delayPressIn, delayPressOut, disabled, onLongPress, onPress, onPressIn, onPressOut, rejectResponderTermination, setOpacityActive, setOpacityInactive]);
  var pressEventHandlers = _modules_usePressEvents__WEBPACK_IMPORTED_MODULE_2___default()(hostRef, pressConfig);
  return react__WEBPACK_IMPORTED_MODULE_0__.createElement((_View__WEBPACK_IMPORTED_MODULE_4___default()), _extends({}, rest, pressEventHandlers, {
    accessibilityState: _objectSpread({
      disabled: disabled
    }, props.accessibilityState),
    accessible: accessible !== false,
    focusable: focusable !== false && onPress !== undefined,
    ref: setRef,
    style: [styles.root, !disabled && styles.actionable, style, opacityOverride != null && {
      opacity: opacityOverride
    }, {
      transitionDuration: duration
    }]
  }));
}

var styles = _StyleSheet__WEBPACK_IMPORTED_MODULE_3___default().create({
  root: {
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    userSelect: 'none'
  },
  actionable: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  }
});
var MemoedTouchableOpacity = react__WEBPACK_IMPORTED_MODULE_0__.memo(react__WEBPACK_IMPORTED_MODULE_0__.forwardRef(TouchableOpacity));
MemoedTouchableOpacity.displayName = 'TouchableOpacity';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MemoedTouchableOpacity);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/View/index.js":
/*!*******************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/View/index.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./cjs/react.development.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../createElement */ "./exports/createElement");
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_createElement__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../StyleSheet/css */ "../StyleSheet/css");
/* harmony import */ var _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _modules_pick__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../modules/pick */ "../../modules/pick");
/* harmony import */ var _modules_pick__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_modules_pick__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../modules/useElementLayout */ "../../modules/useElementLayout");
/* harmony import */ var _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../modules/useMergeRefs */ "../../modules/useMergeRefs");
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../modules/usePlatformMethods */ "../../modules/usePlatformMethods");
/* harmony import */ var _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../modules/useResponderEvents */ "../../modules/useResponderEvents");
/* harmony import */ var _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../StyleSheet */ "./exports/StyleSheet");
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_StyleSheet__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Text_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Text/TextAncestorContext */ "../Text/TextAncestorContext");
/* harmony import */ var _Text_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_Text_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */











var forwardPropsList = {
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  accessible: true,
  children: true,
  className: true,
  classList: true,
  disabled: true,
  importantForAccessibility: true,
  nativeID: true,
  onBlur: true,
  onClick: true,
  onClickCapture: true,
  onContextMenu: true,
  onFocus: true,
  onKeyDown: true,
  onKeyUp: true,
  onTouchCancel: true,
  onTouchCancelCapture: true,
  onTouchEnd: true,
  onTouchEndCapture: true,
  onTouchMove: true,
  onTouchMoveCapture: true,
  onTouchStart: true,
  onTouchStartCapture: true,
  pointerEvents: true,
  ref: true,
  style: true,
  testID: true,
  // unstable
  dataSet: true,
  onMouseDown: true,
  onMouseEnter: true,
  onMouseLeave: true,
  onMouseMove: true,
  onMouseOver: true,
  onMouseOut: true,
  onMouseUp: true,
  onScroll: true,
  onWheel: true,
  href: true,
  rel: true,
  target: true
};

var pickProps = function pickProps(props) {
  return _modules_pick__WEBPACK_IMPORTED_MODULE_3___default()(props, forwardPropsList);
};

var View = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function (props, forwardedRef) {
  var onLayout = props.onLayout,
      onMoveShouldSetResponder = props.onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture = props.onMoveShouldSetResponderCapture,
      onResponderEnd = props.onResponderEnd,
      onResponderGrant = props.onResponderGrant,
      onResponderMove = props.onResponderMove,
      onResponderReject = props.onResponderReject,
      onResponderRelease = props.onResponderRelease,
      onResponderStart = props.onResponderStart,
      onResponderTerminate = props.onResponderTerminate,
      onResponderTerminationRequest = props.onResponderTerminationRequest,
      onScrollShouldSetResponder = props.onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture = props.onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder = props.onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture = props.onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder = props.onStartShouldSetResponder,
      onStartShouldSetResponderCapture = props.onStartShouldSetResponderCapture;

  if (true) {
    react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(props.children).forEach(function (item) {
      if (typeof item === 'string') {
        console.error("Unexpected text node: " + item + ". A text node cannot be a child of a <View>.");
      }
    });
  }

  var hasTextAncestor = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)((_Text_TextAncestorContext__WEBPACK_IMPORTED_MODULE_9___default()));
  var hostRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var setRef = _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_5___default()(forwardedRef, hostRef);
  var classList = [classes.view];
  var style = _StyleSheet__WEBPACK_IMPORTED_MODULE_8___default().compose(hasTextAncestor && styles.inline, props.style);
  _modules_useElementLayout__WEBPACK_IMPORTED_MODULE_4___default()(hostRef, onLayout);
  _modules_useResponderEvents__WEBPACK_IMPORTED_MODULE_7___default()(hostRef, {
    onMoveShouldSetResponder: onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture: onMoveShouldSetResponderCapture,
    onResponderEnd: onResponderEnd,
    onResponderGrant: onResponderGrant,
    onResponderMove: onResponderMove,
    onResponderReject: onResponderReject,
    onResponderRelease: onResponderRelease,
    onResponderStart: onResponderStart,
    onResponderTerminate: onResponderTerminate,
    onResponderTerminationRequest: onResponderTerminationRequest,
    onScrollShouldSetResponder: onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture: onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder: onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture: onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder: onStartShouldSetResponder,
    onStartShouldSetResponderCapture: onStartShouldSetResponderCapture
  });
  var supportedProps = pickProps(props);
  supportedProps.classList = classList;
  supportedProps.ref = setRef;
  supportedProps.style = style;
  _modules_usePlatformMethods__WEBPACK_IMPORTED_MODULE_6___default()(hostRef, supportedProps);
  return _createElement__WEBPACK_IMPORTED_MODULE_1___default()('div', supportedProps);
});
View.displayName = 'View';
var classes = _StyleSheet_css__WEBPACK_IMPORTED_MODULE_2___default().create({
  view: {
    alignItems: 'stretch',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0
  }
});
var styles = _StyleSheet__WEBPACK_IMPORTED_MODULE_8___default().create({
  inline: {
    display: 'inline-flex'
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/exports/findNodeHandle/index.js":
/*!*****************************************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/exports/findNodeHandle/index.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ "./cjs/react-dom.development.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */


var findNodeHandle = function findNodeHandle(component) {
  var node;

  try {
    node = (0,react_dom__WEBPACK_IMPORTED_MODULE_0__.findDOMNode)(component);
  } catch (e) {}

  return node;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (findNodeHandle);

/***/ }),

/***/ "../../../../../node_modules/react-native-web/dist/index.js":
/*!******************************************************************!*\
  !*** ../../../../../node_modules/react-native-web/dist/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unstable_createElement": () => (/* reexport default from dynamic */ _exports_createElement__WEBPACK_IMPORTED_MODULE_0___default.a),
/* harmony export */   "findNodeHandle": () => (/* reexport default from dynamic */ _exports_findNodeHandle__WEBPACK_IMPORTED_MODULE_1___default.a),
/* harmony export */   "processColor": () => (/* reexport default from dynamic */ _exports_processColor__WEBPACK_IMPORTED_MODULE_2___default.a),
/* harmony export */   "render": () => (/* reexport default from dynamic */ _exports_render__WEBPACK_IMPORTED_MODULE_3___default.a),
/* harmony export */   "unmountComponentAtNode": () => (/* reexport default from dynamic */ _exports_unmountComponentAtNode__WEBPACK_IMPORTED_MODULE_4___default.a),
/* harmony export */   "NativeModules": () => (/* reexport default from dynamic */ _exports_NativeModules__WEBPACK_IMPORTED_MODULE_5___default.a),
/* harmony export */   "AccessibilityInfo": () => (/* reexport default from dynamic */ _exports_AccessibilityInfo__WEBPACK_IMPORTED_MODULE_6___default.a),
/* harmony export */   "Alert": () => (/* reexport default from dynamic */ _exports_Alert__WEBPACK_IMPORTED_MODULE_7___default.a),
/* harmony export */   "Animated": () => (/* reexport default from dynamic */ _exports_Animated__WEBPACK_IMPORTED_MODULE_8___default.a),
/* harmony export */   "Appearance": () => (/* reexport default from dynamic */ _exports_Appearance__WEBPACK_IMPORTED_MODULE_9___default.a),
/* harmony export */   "AppRegistry": () => (/* reexport default from dynamic */ _exports_AppRegistry__WEBPACK_IMPORTED_MODULE_10___default.a),
/* harmony export */   "AppState": () => (/* reexport default from dynamic */ _exports_AppState__WEBPACK_IMPORTED_MODULE_11___default.a),
/* harmony export */   "BackHandler": () => (/* reexport default from dynamic */ _exports_BackHandler__WEBPACK_IMPORTED_MODULE_12___default.a),
/* harmony export */   "Clipboard": () => (/* reexport default from dynamic */ _exports_Clipboard__WEBPACK_IMPORTED_MODULE_13___default.a),
/* harmony export */   "DeviceInfo": () => (/* reexport default from dynamic */ _exports_DeviceInfo__WEBPACK_IMPORTED_MODULE_14___default.a),
/* harmony export */   "Dimensions": () => (/* reexport default from dynamic */ _exports_Dimensions__WEBPACK_IMPORTED_MODULE_15___default.a),
/* harmony export */   "Easing": () => (/* reexport default from dynamic */ _exports_Easing__WEBPACK_IMPORTED_MODULE_16___default.a),
/* harmony export */   "I18nManager": () => (/* reexport default from dynamic */ _exports_I18nManager__WEBPACK_IMPORTED_MODULE_17___default.a),
/* harmony export */   "Keyboard": () => (/* reexport default from dynamic */ _exports_Keyboard__WEBPACK_IMPORTED_MODULE_18___default.a),
/* harmony export */   "InteractionManager": () => (/* reexport default from dynamic */ _exports_InteractionManager__WEBPACK_IMPORTED_MODULE_19___default.a),
/* harmony export */   "LayoutAnimation": () => (/* reexport default from dynamic */ _exports_LayoutAnimation__WEBPACK_IMPORTED_MODULE_20___default.a),
/* harmony export */   "Linking": () => (/* reexport default from dynamic */ _exports_Linking__WEBPACK_IMPORTED_MODULE_21___default.a),
/* harmony export */   "NativeEventEmitter": () => (/* reexport default from dynamic */ _exports_NativeEventEmitter__WEBPACK_IMPORTED_MODULE_22___default.a),
/* harmony export */   "PanResponder": () => (/* reexport default from dynamic */ _exports_PanResponder__WEBPACK_IMPORTED_MODULE_23___default.a),
/* harmony export */   "PixelRatio": () => (/* reexport default from dynamic */ _exports_PixelRatio__WEBPACK_IMPORTED_MODULE_24___default.a),
/* harmony export */   "Platform": () => (/* reexport default from dynamic */ _exports_Platform__WEBPACK_IMPORTED_MODULE_25___default.a),
/* harmony export */   "Share": () => (/* reexport default from dynamic */ _exports_Share__WEBPACK_IMPORTED_MODULE_26___default.a),
/* harmony export */   "StyleSheet": () => (/* reexport default from dynamic */ _exports_StyleSheet__WEBPACK_IMPORTED_MODULE_27___default.a),
/* harmony export */   "UIManager": () => (/* reexport default from dynamic */ _exports_UIManager__WEBPACK_IMPORTED_MODULE_28___default.a),
/* harmony export */   "Vibration": () => (/* reexport default from dynamic */ _exports_Vibration__WEBPACK_IMPORTED_MODULE_29___default.a),
/* harmony export */   "ActivityIndicator": () => (/* reexport default from dynamic */ _exports_ActivityIndicator__WEBPACK_IMPORTED_MODULE_30___default.a),
/* harmony export */   "Button": () => (/* reexport default from dynamic */ _exports_Button__WEBPACK_IMPORTED_MODULE_31___default.a),
/* harmony export */   "CheckBox": () => (/* reexport default from dynamic */ _exports_CheckBox__WEBPACK_IMPORTED_MODULE_32___default.a),
/* harmony export */   "FlatList": () => (/* reexport default from dynamic */ _exports_FlatList__WEBPACK_IMPORTED_MODULE_33___default.a),
/* harmony export */   "Image": () => (/* reexport default from dynamic */ _exports_Image__WEBPACK_IMPORTED_MODULE_34___default.a),
/* harmony export */   "ImageBackground": () => (/* reexport default from dynamic */ _exports_ImageBackground__WEBPACK_IMPORTED_MODULE_35___default.a),
/* harmony export */   "KeyboardAvoidingView": () => (/* reexport default from dynamic */ _exports_KeyboardAvoidingView__WEBPACK_IMPORTED_MODULE_36___default.a),
/* harmony export */   "Modal": () => (/* reexport default from dynamic */ _exports_Modal__WEBPACK_IMPORTED_MODULE_37___default.a),
/* harmony export */   "Picker": () => (/* reexport default from dynamic */ _exports_Picker__WEBPACK_IMPORTED_MODULE_38___default.a),
/* harmony export */   "Pressable": () => (/* reexport default from dynamic */ _exports_Pressable__WEBPACK_IMPORTED_MODULE_39___default.a),
/* harmony export */   "ProgressBar": () => (/* reexport default from dynamic */ _exports_ProgressBar__WEBPACK_IMPORTED_MODULE_40___default.a),
/* harmony export */   "RefreshControl": () => (/* reexport default from dynamic */ _exports_RefreshControl__WEBPACK_IMPORTED_MODULE_41___default.a),
/* harmony export */   "SafeAreaView": () => (/* reexport default from dynamic */ _exports_SafeAreaView__WEBPACK_IMPORTED_MODULE_42___default.a),
/* harmony export */   "ScrollView": () => (/* reexport default from dynamic */ _exports_ScrollView__WEBPACK_IMPORTED_MODULE_43___default.a),
/* harmony export */   "SectionList": () => (/* reexport default from dynamic */ _exports_SectionList__WEBPACK_IMPORTED_MODULE_44___default.a),
/* harmony export */   "StatusBar": () => (/* reexport default from dynamic */ _exports_StatusBar__WEBPACK_IMPORTED_MODULE_45___default.a),
/* harmony export */   "Switch": () => (/* reexport default from dynamic */ _exports_Switch__WEBPACK_IMPORTED_MODULE_46___default.a),
/* harmony export */   "Text": () => (/* reexport default from dynamic */ _exports_Text__WEBPACK_IMPORTED_MODULE_47___default.a),
/* harmony export */   "TextInput": () => (/* reexport default from dynamic */ _exports_TextInput__WEBPACK_IMPORTED_MODULE_48___default.a),
/* harmony export */   "Touchable": () => (/* reexport default from dynamic */ _exports_Touchable__WEBPACK_IMPORTED_MODULE_49___default.a),
/* harmony export */   "TouchableHighlight": () => (/* reexport default from dynamic */ _exports_TouchableHighlight__WEBPACK_IMPORTED_MODULE_50___default.a),
/* harmony export */   "TouchableNativeFeedback": () => (/* reexport default from dynamic */ _exports_TouchableNativeFeedback__WEBPACK_IMPORTED_MODULE_51___default.a),
/* harmony export */   "TouchableOpacity": () => (/* reexport default from dynamic */ _exports_TouchableOpacity__WEBPACK_IMPORTED_MODULE_52___default.a),
/* harmony export */   "TouchableWithoutFeedback": () => (/* reexport default from dynamic */ _exports_TouchableWithoutFeedback__WEBPACK_IMPORTED_MODULE_53___default.a),
/* harmony export */   "View": () => (/* reexport default from dynamic */ _exports_View__WEBPACK_IMPORTED_MODULE_54___default.a),
/* harmony export */   "VirtualizedList": () => (/* reexport default from dynamic */ _exports_VirtualizedList__WEBPACK_IMPORTED_MODULE_55___default.a),
/* harmony export */   "YellowBox": () => (/* reexport default from dynamic */ _exports_YellowBox__WEBPACK_IMPORTED_MODULE_56___default.a),
/* harmony export */   "DrawerLayoutAndroid": () => (/* reexport default from dynamic */ _exports_DrawerLayoutAndroid__WEBPACK_IMPORTED_MODULE_57___default.a),
/* harmony export */   "InputAccessoryView": () => (/* reexport default from dynamic */ _exports_InputAccessoryView__WEBPACK_IMPORTED_MODULE_58___default.a),
/* harmony export */   "ToastAndroid": () => (/* reexport default from dynamic */ _exports_ToastAndroid__WEBPACK_IMPORTED_MODULE_59___default.a),
/* harmony export */   "PermissionsAndroid": () => (/* reexport default from dynamic */ _exports_PermissionsAndroid__WEBPACK_IMPORTED_MODULE_60___default.a),
/* harmony export */   "Settings": () => (/* reexport default from dynamic */ _exports_Settings__WEBPACK_IMPORTED_MODULE_61___default.a),
/* harmony export */   "Systrace": () => (/* reexport default from dynamic */ _exports_Systrace__WEBPACK_IMPORTED_MODULE_62___default.a),
/* harmony export */   "TVEventHandler": () => (/* reexport default from dynamic */ _exports_TVEventHandler__WEBPACK_IMPORTED_MODULE_63___default.a),
/* harmony export */   "DeviceEventEmitter": () => (/* reexport default from dynamic */ _exports_DeviceEventEmitter__WEBPACK_IMPORTED_MODULE_64___default.a),
/* harmony export */   "useColorScheme": () => (/* reexport default from dynamic */ _exports_useColorScheme__WEBPACK_IMPORTED_MODULE_65___default.a),
/* harmony export */   "useWindowDimensions": () => (/* reexport default from dynamic */ _exports_useWindowDimensions__WEBPACK_IMPORTED_MODULE_66___default.a)
/* harmony export */ });
/* harmony import */ var _exports_createElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./exports/createElement */ "./exports/createElement");
/* harmony import */ var _exports_createElement__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_exports_createElement__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _exports_findNodeHandle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exports/findNodeHandle */ "./exports/findNodeHandle");
/* harmony import */ var _exports_findNodeHandle__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_exports_findNodeHandle__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _exports_processColor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exports/processColor */ "./exports/processColor");
/* harmony import */ var _exports_processColor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_exports_processColor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _exports_render__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exports/render */ "./exports/render");
/* harmony import */ var _exports_render__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_exports_render__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _exports_unmountComponentAtNode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./exports/unmountComponentAtNode */ "./exports/unmountComponentAtNode");
/* harmony import */ var _exports_unmountComponentAtNode__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_exports_unmountComponentAtNode__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _exports_NativeModules__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./exports/NativeModules */ "./exports/NativeModules");
/* harmony import */ var _exports_NativeModules__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_exports_NativeModules__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _exports_AccessibilityInfo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./exports/AccessibilityInfo */ "./exports/AccessibilityInfo");
/* harmony import */ var _exports_AccessibilityInfo__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_exports_AccessibilityInfo__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _exports_Alert__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./exports/Alert */ "./exports/Alert");
/* harmony import */ var _exports_Alert__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_exports_Alert__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _exports_Animated__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./exports/Animated */ "./exports/Animated");
/* harmony import */ var _exports_Animated__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_exports_Animated__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _exports_Appearance__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./exports/Appearance */ "./exports/Appearance");
/* harmony import */ var _exports_Appearance__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_exports_Appearance__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _exports_AppRegistry__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./exports/AppRegistry */ "./exports/AppRegistry");
/* harmony import */ var _exports_AppRegistry__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_exports_AppRegistry__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _exports_AppState__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./exports/AppState */ "./exports/AppState");
/* harmony import */ var _exports_AppState__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_exports_AppState__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _exports_BackHandler__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./exports/BackHandler */ "./exports/BackHandler");
/* harmony import */ var _exports_BackHandler__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_exports_BackHandler__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _exports_Clipboard__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./exports/Clipboard */ "./exports/Clipboard");
/* harmony import */ var _exports_Clipboard__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_exports_Clipboard__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _exports_DeviceInfo__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./exports/DeviceInfo */ "./exports/DeviceInfo");
/* harmony import */ var _exports_DeviceInfo__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_exports_DeviceInfo__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _exports_Dimensions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./exports/Dimensions */ "./exports/Dimensions");
/* harmony import */ var _exports_Dimensions__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_exports_Dimensions__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _exports_Easing__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./exports/Easing */ "./exports/Easing");
/* harmony import */ var _exports_Easing__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_exports_Easing__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _exports_I18nManager__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./exports/I18nManager */ "./exports/I18nManager");
/* harmony import */ var _exports_I18nManager__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_exports_I18nManager__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _exports_Keyboard__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./exports/Keyboard */ "./exports/Keyboard");
/* harmony import */ var _exports_Keyboard__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_exports_Keyboard__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _exports_InteractionManager__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./exports/InteractionManager */ "./exports/InteractionManager");
/* harmony import */ var _exports_InteractionManager__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_exports_InteractionManager__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _exports_LayoutAnimation__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./exports/LayoutAnimation */ "./exports/LayoutAnimation");
/* harmony import */ var _exports_LayoutAnimation__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_exports_LayoutAnimation__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _exports_Linking__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./exports/Linking */ "./exports/Linking");
/* harmony import */ var _exports_Linking__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(_exports_Linking__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var _exports_NativeEventEmitter__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./exports/NativeEventEmitter */ "./exports/NativeEventEmitter");
/* harmony import */ var _exports_NativeEventEmitter__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(_exports_NativeEventEmitter__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _exports_PanResponder__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./exports/PanResponder */ "./exports/PanResponder");
/* harmony import */ var _exports_PanResponder__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(_exports_PanResponder__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var _exports_PixelRatio__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./exports/PixelRatio */ "./exports/PixelRatio");
/* harmony import */ var _exports_PixelRatio__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(_exports_PixelRatio__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var _exports_Platform__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./exports/Platform */ "./exports/Platform");
/* harmony import */ var _exports_Platform__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(_exports_Platform__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var _exports_Share__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./exports/Share */ "./exports/Share");
/* harmony import */ var _exports_Share__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(_exports_Share__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var _exports_StyleSheet__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./exports/StyleSheet */ "./exports/StyleSheet");
/* harmony import */ var _exports_StyleSheet__WEBPACK_IMPORTED_MODULE_27___default = /*#__PURE__*/__webpack_require__.n(_exports_StyleSheet__WEBPACK_IMPORTED_MODULE_27__);
/* harmony import */ var _exports_UIManager__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./exports/UIManager */ "./exports/UIManager");
/* harmony import */ var _exports_UIManager__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/__webpack_require__.n(_exports_UIManager__WEBPACK_IMPORTED_MODULE_28__);
/* harmony import */ var _exports_Vibration__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./exports/Vibration */ "./exports/Vibration");
/* harmony import */ var _exports_Vibration__WEBPACK_IMPORTED_MODULE_29___default = /*#__PURE__*/__webpack_require__.n(_exports_Vibration__WEBPACK_IMPORTED_MODULE_29__);
/* harmony import */ var _exports_ActivityIndicator__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./exports/ActivityIndicator */ "./exports/ActivityIndicator");
/* harmony import */ var _exports_ActivityIndicator__WEBPACK_IMPORTED_MODULE_30___default = /*#__PURE__*/__webpack_require__.n(_exports_ActivityIndicator__WEBPACK_IMPORTED_MODULE_30__);
/* harmony import */ var _exports_Button__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./exports/Button */ "./exports/Button");
/* harmony import */ var _exports_Button__WEBPACK_IMPORTED_MODULE_31___default = /*#__PURE__*/__webpack_require__.n(_exports_Button__WEBPACK_IMPORTED_MODULE_31__);
/* harmony import */ var _exports_CheckBox__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./exports/CheckBox */ "./exports/CheckBox");
/* harmony import */ var _exports_CheckBox__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(_exports_CheckBox__WEBPACK_IMPORTED_MODULE_32__);
/* harmony import */ var _exports_FlatList__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./exports/FlatList */ "./exports/FlatList");
/* harmony import */ var _exports_FlatList__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/__webpack_require__.n(_exports_FlatList__WEBPACK_IMPORTED_MODULE_33__);
/* harmony import */ var _exports_Image__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./exports/Image */ "./exports/Image");
/* harmony import */ var _exports_Image__WEBPACK_IMPORTED_MODULE_34___default = /*#__PURE__*/__webpack_require__.n(_exports_Image__WEBPACK_IMPORTED_MODULE_34__);
/* harmony import */ var _exports_ImageBackground__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./exports/ImageBackground */ "./exports/ImageBackground");
/* harmony import */ var _exports_ImageBackground__WEBPACK_IMPORTED_MODULE_35___default = /*#__PURE__*/__webpack_require__.n(_exports_ImageBackground__WEBPACK_IMPORTED_MODULE_35__);
/* harmony import */ var _exports_KeyboardAvoidingView__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./exports/KeyboardAvoidingView */ "./exports/KeyboardAvoidingView");
/* harmony import */ var _exports_KeyboardAvoidingView__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/__webpack_require__.n(_exports_KeyboardAvoidingView__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */ var _exports_Modal__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./exports/Modal */ "./exports/Modal");
/* harmony import */ var _exports_Modal__WEBPACK_IMPORTED_MODULE_37___default = /*#__PURE__*/__webpack_require__.n(_exports_Modal__WEBPACK_IMPORTED_MODULE_37__);
/* harmony import */ var _exports_Picker__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./exports/Picker */ "./exports/Picker");
/* harmony import */ var _exports_Picker__WEBPACK_IMPORTED_MODULE_38___default = /*#__PURE__*/__webpack_require__.n(_exports_Picker__WEBPACK_IMPORTED_MODULE_38__);
/* harmony import */ var _exports_Pressable__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./exports/Pressable */ "./exports/Pressable");
/* harmony import */ var _exports_Pressable__WEBPACK_IMPORTED_MODULE_39___default = /*#__PURE__*/__webpack_require__.n(_exports_Pressable__WEBPACK_IMPORTED_MODULE_39__);
/* harmony import */ var _exports_ProgressBar__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./exports/ProgressBar */ "./exports/ProgressBar");
/* harmony import */ var _exports_ProgressBar__WEBPACK_IMPORTED_MODULE_40___default = /*#__PURE__*/__webpack_require__.n(_exports_ProgressBar__WEBPACK_IMPORTED_MODULE_40__);
/* harmony import */ var _exports_RefreshControl__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./exports/RefreshControl */ "./exports/RefreshControl");
/* harmony import */ var _exports_RefreshControl__WEBPACK_IMPORTED_MODULE_41___default = /*#__PURE__*/__webpack_require__.n(_exports_RefreshControl__WEBPACK_IMPORTED_MODULE_41__);
/* harmony import */ var _exports_SafeAreaView__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./exports/SafeAreaView */ "./exports/SafeAreaView");
/* harmony import */ var _exports_SafeAreaView__WEBPACK_IMPORTED_MODULE_42___default = /*#__PURE__*/__webpack_require__.n(_exports_SafeAreaView__WEBPACK_IMPORTED_MODULE_42__);
/* harmony import */ var _exports_ScrollView__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./exports/ScrollView */ "./exports/ScrollView");
/* harmony import */ var _exports_ScrollView__WEBPACK_IMPORTED_MODULE_43___default = /*#__PURE__*/__webpack_require__.n(_exports_ScrollView__WEBPACK_IMPORTED_MODULE_43__);
/* harmony import */ var _exports_SectionList__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./exports/SectionList */ "./exports/SectionList");
/* harmony import */ var _exports_SectionList__WEBPACK_IMPORTED_MODULE_44___default = /*#__PURE__*/__webpack_require__.n(_exports_SectionList__WEBPACK_IMPORTED_MODULE_44__);
/* harmony import */ var _exports_StatusBar__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./exports/StatusBar */ "./exports/StatusBar");
/* harmony import */ var _exports_StatusBar__WEBPACK_IMPORTED_MODULE_45___default = /*#__PURE__*/__webpack_require__.n(_exports_StatusBar__WEBPACK_IMPORTED_MODULE_45__);
/* harmony import */ var _exports_Switch__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./exports/Switch */ "./exports/Switch");
/* harmony import */ var _exports_Switch__WEBPACK_IMPORTED_MODULE_46___default = /*#__PURE__*/__webpack_require__.n(_exports_Switch__WEBPACK_IMPORTED_MODULE_46__);
/* harmony import */ var _exports_Text__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./exports/Text */ "./exports/Text");
/* harmony import */ var _exports_Text__WEBPACK_IMPORTED_MODULE_47___default = /*#__PURE__*/__webpack_require__.n(_exports_Text__WEBPACK_IMPORTED_MODULE_47__);
/* harmony import */ var _exports_TextInput__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./exports/TextInput */ "./exports/TextInput");
/* harmony import */ var _exports_TextInput__WEBPACK_IMPORTED_MODULE_48___default = /*#__PURE__*/__webpack_require__.n(_exports_TextInput__WEBPACK_IMPORTED_MODULE_48__);
/* harmony import */ var _exports_Touchable__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./exports/Touchable */ "./exports/Touchable");
/* harmony import */ var _exports_Touchable__WEBPACK_IMPORTED_MODULE_49___default = /*#__PURE__*/__webpack_require__.n(_exports_Touchable__WEBPACK_IMPORTED_MODULE_49__);
/* harmony import */ var _exports_TouchableHighlight__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./exports/TouchableHighlight */ "./exports/TouchableHighlight");
/* harmony import */ var _exports_TouchableHighlight__WEBPACK_IMPORTED_MODULE_50___default = /*#__PURE__*/__webpack_require__.n(_exports_TouchableHighlight__WEBPACK_IMPORTED_MODULE_50__);
/* harmony import */ var _exports_TouchableNativeFeedback__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./exports/TouchableNativeFeedback */ "./exports/TouchableNativeFeedback");
/* harmony import */ var _exports_TouchableNativeFeedback__WEBPACK_IMPORTED_MODULE_51___default = /*#__PURE__*/__webpack_require__.n(_exports_TouchableNativeFeedback__WEBPACK_IMPORTED_MODULE_51__);
/* harmony import */ var _exports_TouchableOpacity__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./exports/TouchableOpacity */ "./exports/TouchableOpacity");
/* harmony import */ var _exports_TouchableOpacity__WEBPACK_IMPORTED_MODULE_52___default = /*#__PURE__*/__webpack_require__.n(_exports_TouchableOpacity__WEBPACK_IMPORTED_MODULE_52__);
/* harmony import */ var _exports_TouchableWithoutFeedback__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./exports/TouchableWithoutFeedback */ "./exports/TouchableWithoutFeedback");
/* harmony import */ var _exports_TouchableWithoutFeedback__WEBPACK_IMPORTED_MODULE_53___default = /*#__PURE__*/__webpack_require__.n(_exports_TouchableWithoutFeedback__WEBPACK_IMPORTED_MODULE_53__);
/* harmony import */ var _exports_View__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./exports/View */ "./exports/View");
/* harmony import */ var _exports_View__WEBPACK_IMPORTED_MODULE_54___default = /*#__PURE__*/__webpack_require__.n(_exports_View__WEBPACK_IMPORTED_MODULE_54__);
/* harmony import */ var _exports_VirtualizedList__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./exports/VirtualizedList */ "./exports/VirtualizedList");
/* harmony import */ var _exports_VirtualizedList__WEBPACK_IMPORTED_MODULE_55___default = /*#__PURE__*/__webpack_require__.n(_exports_VirtualizedList__WEBPACK_IMPORTED_MODULE_55__);
/* harmony import */ var _exports_YellowBox__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./exports/YellowBox */ "./exports/YellowBox");
/* harmony import */ var _exports_YellowBox__WEBPACK_IMPORTED_MODULE_56___default = /*#__PURE__*/__webpack_require__.n(_exports_YellowBox__WEBPACK_IMPORTED_MODULE_56__);
/* harmony import */ var _exports_DrawerLayoutAndroid__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./exports/DrawerLayoutAndroid */ "./exports/DrawerLayoutAndroid");
/* harmony import */ var _exports_DrawerLayoutAndroid__WEBPACK_IMPORTED_MODULE_57___default = /*#__PURE__*/__webpack_require__.n(_exports_DrawerLayoutAndroid__WEBPACK_IMPORTED_MODULE_57__);
/* harmony import */ var _exports_InputAccessoryView__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./exports/InputAccessoryView */ "./exports/InputAccessoryView");
/* harmony import */ var _exports_InputAccessoryView__WEBPACK_IMPORTED_MODULE_58___default = /*#__PURE__*/__webpack_require__.n(_exports_InputAccessoryView__WEBPACK_IMPORTED_MODULE_58__);
/* harmony import */ var _exports_ToastAndroid__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./exports/ToastAndroid */ "./exports/ToastAndroid");
/* harmony import */ var _exports_ToastAndroid__WEBPACK_IMPORTED_MODULE_59___default = /*#__PURE__*/__webpack_require__.n(_exports_ToastAndroid__WEBPACK_IMPORTED_MODULE_59__);
/* harmony import */ var _exports_PermissionsAndroid__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./exports/PermissionsAndroid */ "./exports/PermissionsAndroid");
/* harmony import */ var _exports_PermissionsAndroid__WEBPACK_IMPORTED_MODULE_60___default = /*#__PURE__*/__webpack_require__.n(_exports_PermissionsAndroid__WEBPACK_IMPORTED_MODULE_60__);
/* harmony import */ var _exports_Settings__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./exports/Settings */ "./exports/Settings");
/* harmony import */ var _exports_Settings__WEBPACK_IMPORTED_MODULE_61___default = /*#__PURE__*/__webpack_require__.n(_exports_Settings__WEBPACK_IMPORTED_MODULE_61__);
/* harmony import */ var _exports_Systrace__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./exports/Systrace */ "./exports/Systrace");
/* harmony import */ var _exports_Systrace__WEBPACK_IMPORTED_MODULE_62___default = /*#__PURE__*/__webpack_require__.n(_exports_Systrace__WEBPACK_IMPORTED_MODULE_62__);
/* harmony import */ var _exports_TVEventHandler__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./exports/TVEventHandler */ "./exports/TVEventHandler");
/* harmony import */ var _exports_TVEventHandler__WEBPACK_IMPORTED_MODULE_63___default = /*#__PURE__*/__webpack_require__.n(_exports_TVEventHandler__WEBPACK_IMPORTED_MODULE_63__);
/* harmony import */ var _exports_DeviceEventEmitter__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./exports/DeviceEventEmitter */ "./exports/DeviceEventEmitter");
/* harmony import */ var _exports_DeviceEventEmitter__WEBPACK_IMPORTED_MODULE_64___default = /*#__PURE__*/__webpack_require__.n(_exports_DeviceEventEmitter__WEBPACK_IMPORTED_MODULE_64__);
/* harmony import */ var _exports_useColorScheme__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./exports/useColorScheme */ "./exports/useColorScheme");
/* harmony import */ var _exports_useColorScheme__WEBPACK_IMPORTED_MODULE_65___default = /*#__PURE__*/__webpack_require__.n(_exports_useColorScheme__WEBPACK_IMPORTED_MODULE_65__);
/* harmony import */ var _exports_useWindowDimensions__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./exports/useWindowDimensions */ "./exports/useWindowDimensions");
/* harmony import */ var _exports_useWindowDimensions__WEBPACK_IMPORTED_MODULE_66___default = /*#__PURE__*/__webpack_require__.n(_exports_useWindowDimensions__WEBPACK_IMPORTED_MODULE_66__);





 // APIs
























 // components



























 // compat (components)



 // compat (apis)




 // plugins

 // hooks




/***/ }),

/***/ "../../../../../node_modules/react/index.js":
/*!**************************************************!*\
  !*** ../../../../../node_modules/react/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "./cjs/react.development.js");
}


/***/ }),

/***/ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx":
/*!************************************************************************************************************************!*\
  !*** ../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_snackui_loader_dist_index_js_cssPath_true_extract_specs_tsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx */ "../../../../../node_modules/css-loader/dist/cjs.js!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_snackui_loader_dist_index_js_cssPath_true_extract_specs_tsx__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_snackui_loader_dist_index_js_cssPath_true_extract_specs_tsx__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*****************************************************************************************!*\
  !*** ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "fbjs/lib/ExecutionEnvironment":
/*!************************************************!*\
  !*** external "fbjs/lib/ExecutionEnvironment" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("fbjs/lib/ExecutionEnvironment");;

/***/ }),

/***/ "fbjs/lib/invariant":
/*!*************************************!*\
  !*** external "fbjs/lib/invariant" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("fbjs/lib/invariant");;

/***/ }),

/***/ "./cjs/react.development.js":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ "./cjs/react-dom.development.js":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");;

/***/ }),

/***/ "./exports/AccessibilityInfo":
/*!******************************************************************!*\
  !*** external "react-native-web/dist/exports/AccessibilityInfo" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/AccessibilityInfo");;

/***/ }),

/***/ "./exports/ActivityIndicator":
/*!******************************************************************!*\
  !*** external "react-native-web/dist/exports/ActivityIndicator" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/ActivityIndicator");;

/***/ }),

/***/ "./exports/Alert":
/*!******************************************************!*\
  !*** external "react-native-web/dist/exports/Alert" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Alert");;

/***/ }),

/***/ "./exports/Animated":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/Animated" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Animated");;

/***/ }),

/***/ "./exports/AppRegistry":
/*!************************************************************!*\
  !*** external "react-native-web/dist/exports/AppRegistry" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/AppRegistry");;

/***/ }),

/***/ "./exports/AppState":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/AppState" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/AppState");;

/***/ }),

/***/ "./exports/Appearance":
/*!***********************************************************!*\
  !*** external "react-native-web/dist/exports/Appearance" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Appearance");;

/***/ }),

/***/ "./exports/BackHandler":
/*!************************************************************!*\
  !*** external "react-native-web/dist/exports/BackHandler" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/BackHandler");;

/***/ }),

/***/ "./exports/Button":
/*!*******************************************************!*\
  !*** external "react-native-web/dist/exports/Button" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Button");;

/***/ }),

/***/ "./exports/CheckBox":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/CheckBox" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/CheckBox");;

/***/ }),

/***/ "./exports/Clipboard":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/Clipboard" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Clipboard");;

/***/ }),

/***/ "./exports/DeviceEventEmitter":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/DeviceEventEmitter" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/DeviceEventEmitter");;

/***/ }),

/***/ "./exports/DeviceInfo":
/*!***********************************************************!*\
  !*** external "react-native-web/dist/exports/DeviceInfo" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/DeviceInfo");;

/***/ }),

/***/ "./exports/Dimensions":
/*!***********************************************************!*\
  !*** external "react-native-web/dist/exports/Dimensions" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Dimensions");;

/***/ }),

/***/ "./exports/DrawerLayoutAndroid":
/*!********************************************************************!*\
  !*** external "react-native-web/dist/exports/DrawerLayoutAndroid" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/DrawerLayoutAndroid");;

/***/ }),

/***/ "./exports/Easing":
/*!*******************************************************!*\
  !*** external "react-native-web/dist/exports/Easing" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Easing");;

/***/ }),

/***/ "./exports/FlatList":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/FlatList" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/FlatList");;

/***/ }),

/***/ "./exports/I18nManager":
/*!************************************************************!*\
  !*** external "react-native-web/dist/exports/I18nManager" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/I18nManager");;

/***/ }),

/***/ "./exports/Image":
/*!******************************************************!*\
  !*** external "react-native-web/dist/exports/Image" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Image");;

/***/ }),

/***/ "./exports/ImageBackground":
/*!****************************************************************!*\
  !*** external "react-native-web/dist/exports/ImageBackground" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/ImageBackground");;

/***/ }),

/***/ "./exports/InputAccessoryView":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/InputAccessoryView" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/InputAccessoryView");;

/***/ }),

/***/ "./exports/InteractionManager":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/InteractionManager" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/InteractionManager");;

/***/ }),

/***/ "./exports/Keyboard":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/Keyboard" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Keyboard");;

/***/ }),

/***/ "./exports/KeyboardAvoidingView":
/*!*********************************************************************!*\
  !*** external "react-native-web/dist/exports/KeyboardAvoidingView" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/KeyboardAvoidingView");;

/***/ }),

/***/ "./exports/LayoutAnimation":
/*!****************************************************************!*\
  !*** external "react-native-web/dist/exports/LayoutAnimation" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/LayoutAnimation");;

/***/ }),

/***/ "./exports/Linking":
/*!********************************************************!*\
  !*** external "react-native-web/dist/exports/Linking" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Linking");;

/***/ }),

/***/ "./exports/Modal":
/*!******************************************************!*\
  !*** external "react-native-web/dist/exports/Modal" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Modal");;

/***/ }),

/***/ "./ModalAnimation":
/*!*********************************************************************!*\
  !*** external "react-native-web/dist/exports/Modal/ModalAnimation" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Modal/ModalAnimation");;

/***/ }),

/***/ "./ModalContent":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/Modal/ModalContent" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Modal/ModalContent");;

/***/ }),

/***/ "./ModalFocusTrap":
/*!*********************************************************************!*\
  !*** external "react-native-web/dist/exports/Modal/ModalFocusTrap" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Modal/ModalFocusTrap");;

/***/ }),

/***/ "./ModalPortal":
/*!******************************************************************!*\
  !*** external "react-native-web/dist/exports/Modal/ModalPortal" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Modal/ModalPortal");;

/***/ }),

/***/ "./exports/NativeEventEmitter":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/NativeEventEmitter" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/NativeEventEmitter");;

/***/ }),

/***/ "./exports/NativeModules":
/*!**************************************************************!*\
  !*** external "react-native-web/dist/exports/NativeModules" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/NativeModules");;

/***/ }),

/***/ "./exports/PanResponder":
/*!*************************************************************!*\
  !*** external "react-native-web/dist/exports/PanResponder" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/PanResponder");;

/***/ }),

/***/ "./exports/PermissionsAndroid":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/PermissionsAndroid" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/PermissionsAndroid");;

/***/ }),

/***/ "./exports/Picker":
/*!*******************************************************!*\
  !*** external "react-native-web/dist/exports/Picker" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Picker");;

/***/ }),

/***/ "./exports/PixelRatio":
/*!***********************************************************!*\
  !*** external "react-native-web/dist/exports/PixelRatio" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/PixelRatio");;

/***/ }),

/***/ "./exports/Platform":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/Platform" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Platform");;

/***/ }),

/***/ "./exports/Pressable":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/Pressable" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Pressable");;

/***/ }),

/***/ "./exports/ProgressBar":
/*!************************************************************!*\
  !*** external "react-native-web/dist/exports/ProgressBar" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/ProgressBar");;

/***/ }),

/***/ "./exports/RefreshControl":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/exports/RefreshControl" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/RefreshControl");;

/***/ }),

/***/ "./exports/SafeAreaView":
/*!*************************************************************!*\
  !*** external "react-native-web/dist/exports/SafeAreaView" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/SafeAreaView");;

/***/ }),

/***/ "./exports/ScrollView":
/*!***********************************************************!*\
  !*** external "react-native-web/dist/exports/ScrollView" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/ScrollView");;

/***/ }),

/***/ "./exports/SectionList":
/*!************************************************************!*\
  !*** external "react-native-web/dist/exports/SectionList" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/SectionList");;

/***/ }),

/***/ "./exports/Settings":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/Settings" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Settings");;

/***/ }),

/***/ "./exports/Share":
/*!******************************************************!*\
  !*** external "react-native-web/dist/exports/Share" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Share");;

/***/ }),

/***/ "./exports/StatusBar":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/StatusBar" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/StatusBar");;

/***/ }),

/***/ "./exports/StyleSheet":
/*!***********************************************************!*\
  !*** external "react-native-web/dist/exports/StyleSheet" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/StyleSheet");;

/***/ }),

/***/ "./StyleSheet":
/*!**********************************************************************!*\
  !*** external "react-native-web/dist/exports/StyleSheet/StyleSheet" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/StyleSheet/StyleSheet");;

/***/ }),

/***/ "../StyleSheet/css":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/exports/StyleSheet/css" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/StyleSheet/css");;

/***/ }),

/***/ "./exports/Switch":
/*!*******************************************************!*\
  !*** external "react-native-web/dist/exports/Switch" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Switch");;

/***/ }),

/***/ "./exports/Systrace":
/*!*********************************************************!*\
  !*** external "react-native-web/dist/exports/Systrace" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Systrace");;

/***/ }),

/***/ "./exports/TVEventHandler":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/exports/TVEventHandler" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/TVEventHandler");;

/***/ }),

/***/ "./exports/Text":
/*!*****************************************************!*\
  !*** external "react-native-web/dist/exports/Text" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Text");;

/***/ }),

/***/ "../Text/TextAncestorContext":
/*!*************************************************************************!*\
  !*** external "react-native-web/dist/exports/Text/TextAncestorContext" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Text/TextAncestorContext");;

/***/ }),

/***/ "./exports/TextInput":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/TextInput" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/TextInput");;

/***/ }),

/***/ "./exports/ToastAndroid":
/*!*************************************************************!*\
  !*** external "react-native-web/dist/exports/ToastAndroid" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/ToastAndroid");;

/***/ }),

/***/ "./exports/Touchable":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/Touchable" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Touchable");;

/***/ }),

/***/ "./exports/TouchableHighlight":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/exports/TouchableHighlight" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/TouchableHighlight");;

/***/ }),

/***/ "./exports/TouchableNativeFeedback":
/*!************************************************************************!*\
  !*** external "react-native-web/dist/exports/TouchableNativeFeedback" ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/TouchableNativeFeedback");;

/***/ }),

/***/ "./exports/TouchableOpacity":
/*!*****************************************************************!*\
  !*** external "react-native-web/dist/exports/TouchableOpacity" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/TouchableOpacity");;

/***/ }),

/***/ "./exports/TouchableWithoutFeedback":
/*!*************************************************************************!*\
  !*** external "react-native-web/dist/exports/TouchableWithoutFeedback" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/TouchableWithoutFeedback");;

/***/ }),

/***/ "./exports/UIManager":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/UIManager" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/UIManager");;

/***/ }),

/***/ "./exports/Vibration":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/Vibration" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/Vibration");;

/***/ }),

/***/ "./exports/View":
/*!*****************************************************!*\
  !*** external "react-native-web/dist/exports/View" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/View");;

/***/ }),

/***/ "./exports/VirtualizedList":
/*!****************************************************************!*\
  !*** external "react-native-web/dist/exports/VirtualizedList" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/VirtualizedList");;

/***/ }),

/***/ "./exports/YellowBox":
/*!**********************************************************!*\
  !*** external "react-native-web/dist/exports/YellowBox" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/YellowBox");;

/***/ }),

/***/ "./exports/createElement":
/*!**************************************************************!*\
  !*** external "react-native-web/dist/exports/createElement" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/createElement");;

/***/ }),

/***/ "./exports/findNodeHandle":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/exports/findNodeHandle" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/findNodeHandle");;

/***/ }),

/***/ "./exports/processColor":
/*!*************************************************************!*\
  !*** external "react-native-web/dist/exports/processColor" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/processColor");;

/***/ }),

/***/ "./exports/render":
/*!*******************************************************!*\
  !*** external "react-native-web/dist/exports/render" ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/render");;

/***/ }),

/***/ "./exports/unmountComponentAtNode":
/*!***********************************************************************!*\
  !*** external "react-native-web/dist/exports/unmountComponentAtNode" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/unmountComponentAtNode");;

/***/ }),

/***/ "./exports/useColorScheme":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/exports/useColorScheme" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/useColorScheme");;

/***/ }),

/***/ "./exports/useWindowDimensions":
/*!********************************************************************!*\
  !*** external "react-native-web/dist/exports/useWindowDimensions" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/exports/useWindowDimensions");;

/***/ }),

/***/ "../../modules/TextInputState":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/modules/TextInputState" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/TextInputState");;

/***/ }),

/***/ "../../modules/pick":
/*!*****************************************************!*\
  !*** external "react-native-web/dist/modules/pick" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/pick");;

/***/ }),

/***/ "../../modules/useElementLayout":
/*!*****************************************************************!*\
  !*** external "react-native-web/dist/modules/useElementLayout" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/useElementLayout");;

/***/ }),

/***/ "../../modules/useLayoutEffect":
/*!****************************************************************!*\
  !*** external "react-native-web/dist/modules/useLayoutEffect" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/useLayoutEffect");;

/***/ }),

/***/ "../../modules/useMergeRefs":
/*!*************************************************************!*\
  !*** external "react-native-web/dist/modules/useMergeRefs" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/useMergeRefs");;

/***/ }),

/***/ "../../modules/usePlatformMethods":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/modules/usePlatformMethods" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/usePlatformMethods");;

/***/ }),

/***/ "../../modules/usePressEvents":
/*!***************************************************************!*\
  !*** external "react-native-web/dist/modules/usePressEvents" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/usePressEvents");;

/***/ }),

/***/ "../../modules/useResponderEvents":
/*!*******************************************************************!*\
  !*** external "react-native-web/dist/modules/useResponderEvents" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/modules/useResponderEvents");;

/***/ }),

/***/ "../../vendor/react-native/Animated/AnimatedImplementation":
/*!********************************************************************************************!*\
  !*** external "react-native-web/dist/vendor/react-native/Animated/AnimatedImplementation" ***!
  \********************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-native-web/dist/vendor/react-native/Animated/AnimatedImplementation");;

/***/ }),

/***/ "tiny-warning":
/*!*******************************!*\
  !*** external "tiny-warning" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("tiny-warning");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!***************************!*\
  !*** ./extract-specs.tsx ***!
  \***************************/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TestMediaQuery = TestMediaQuery;
exports.Test1 = Test1;
exports.Test2 = Test2;
exports.Test3 = Test3;
exports.Test4 = Test4;
exports.Test5 = Test5;
exports.Test6 = Test6;
exports.Test7 = Test7;
exports.Test8 = Test8;
exports.Test9 = Test9;
exports.Test10 = Test10;
exports.Test11 = Test11;
exports.Test12 = Test12;
exports.Test13 = Test13;
exports.Test14 = Test14;
exports.Test15 = Test15;
exports.Test16 = Test16;

__webpack_require__(/*! ../../../../../../../../tmp/snackui.css!=!snackui-loader?cssPath=true!./extract-specs.tsx */ "../../../../../../../../tmp/snackui.css!=!../../../snackui-loader/dist/index.js?cssPath=true!./extract-specs.tsx");

var React = _interopRequireWildcard(__webpack_require__(/*! react */ "../../../../../node_modules/react/index.js"));

var _snackui = __webpack_require__(/*! snackui */ "../../../snackui/src/index.ts");

var _constants = __webpack_require__(/*! ./constants */ "./constants.tsx");

var _extractSpecConstants = __webpack_require__(/*! ./extract-spec-constants */ "./extract-spec-constants.ts");

var _helpers = __webpack_require__(/*! @snackui/helpers */ "../../../helpers/src/index.ts");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var REACT_ELEMENT_TYPE;

function _jsx(type, props, key, children) { if (!REACT_ELEMENT_TYPE) { REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7; } var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = { children: void 0 }; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = new Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }

const _cn48 = " _fleGro- _fleShr-";
const _cn47 = " _bacCol-1g6456j _fleGro-1 _fleShr-1";
const _cn46 = " _bacCol-57dg7b ";
const _cn45 = " _fleGro-1 _fleShr- _minHei-10px _minWid-10px";
const _cn44 = " _fleGro- _fleShr- _minHei-12px _minWid-12px";
const _cn43 = " _fleBas-auto _fleDir-column _bacCol--r-b-baCol-1g1g664545656j6j-1g6456j _bacCol--r-b-baCol-5757d7dg7b-57dg7b";
const _cn42 = " _col-1h9q8wt _fonSiz-24px _marTop-0px";
const _cn41 = " _col-jwli3a _fonSiz-40px _marTop--4px";
const _cn40 = " _dis-inline _fonWei-400 _hei-36px _linHei-40px _texAli-center _wid-36px ";
const _cn39 = " _opa- _tra-12d2xq9";
const _cn38 = " _opa-1 _tra-";
const _cn37 = " _borBotCol-19sur4y _borLefCol-1utlcvg _borRigCol-1qev2y0 _borTopCol-48c68v";
const _cn36 = " _borBotCol-wqks8h _borLefCol-3se2kx _borRigCol-ycnuvz _borTopCol-3vzq9n";
const _cn35 = " _borBotLefRad-0px _borBotRigRad-0px _borTopLefRad-0px _borTopRigRad-0px _hei-0px";
const _cn34 = " _borBotLefRad-8px _borBotRigRad-8px _borTopLefRad-8px _borTopRigRad-8px _hei-31px";
const _cn33 = " _aliIte-center _bacCol-57dg7b _borBotSty-solid _borBotWid-1px _borLefSty-solid _borLefWid-1px _borRigSty-solid _borRigWid-1px _borTopSty-solid _borTopWid-1px _minHei-10px _oveX-hidden _oveY-hidden _pos-relative ";
const _cn32 = " _col-jwli3a";
const _cn31 = " _col-cqee49";
const _cn30 = " _fonSiz-15px _fonWei-600 ";
const _cn29 = " _dis-inline _useSel-text";
const _cn28 = " _dis-inline _fonSiz-10px";
const _cn27 = " _fleBas-auto _fleDir-column _padBot-15px _padTop-15px home-top-dish";
const _cn26 = " _bacCol-14lw9ot _bot-0px _lef-0px _pos-relative _rig-0px _top-0px";
const _cn25 = " _bacCol-1g6456j _fleBas-auto _fleDir-column _pos-absolute";
const _cn24 = " _bot-0px _fleBas-auto _fleDir-column _lef-0px _pos-relative _rig-0px _top-0px";
const _cn23 = " _hei-0px _wid-0px";
const _cn22 = " _hei-10px _wid-10px";
const _cn21 = " _fleBas-auto _fleDir-column _maxWid-30 _minWid-500px _padBot-10px _padLef-11px _padRig-11px _wid-66";
const _cn20 = " _bacCol-1g6456j";
const _cn19 = " _bacCol-57dg7b";
const _cn18 = " _fleBas-auto _fleDir-column _oveX-hidden _oveY-hidden hello-world ";
const _cn17 = "  _bacCol-57dg7b";
const _cn16 = " _fleBas-auto _fleDir-column _oveX-hidden _oveY-hidden ";
const _cn15 = " _hei-200px _oveX--r-o-ovX-o-ok-visible _oveY--r-o-ovY-i-ip04b4b-visible";
const _cn14 = " _oveX-hidden _oveY-hidden ";
const _cn13 = "  _bacCol-14lw9ot _top--14px";
const _cn12 = " _bacCol-kemksi _borBotLefRad-12px _borBotRigRad-12px _borTopLefRad-12px _borTopRigRad-12px _boxSha-1tpz28 _fleBas-auto _fleDir-column _padBot-2px _padLef-5px _padRig-5px _padTop-2px _top-0px ease-in-out-top ";
const _cn11 = " _oveX-hidden _oveY-hidden who";
const _cn10 = " _bacCol-1g6456j _borBotLefRad-100px _borBotRigRad-100px _borTopLefRad-100px _borTopRigRad-100px _boxSha-1xz9bc3 _fleBas-auto _fleDir-column _fleGro-1 _fleShr-1 test1";
const _cn9 = "  _borLefWid-_sm0_0px";
const _cn8 = "  _borLefSty-_sm0_solid";
const _cn7 = "  _borLefWid-_sm_1px";
const _cn6 = "  _borLefSty-_sm_solid";
const _cn5 = " _borRigSty-solid _borRigWid-0px";
const _cn4 = " _borRigSty-solid _borRigWid-1px";
const _cn3 = " _fleBas-auto _fleDir-column ";
const _cn2 = " _fleBas-auto _fleDir-column _bacCol-_sm_1g6456j _bacCol-_sm0_1542mo4 _padRig-_sm_10px _padRig-_sm0_0px _borTopSty-_xs_solid _borTopWid-_xs_1px";
const _cn = " _dis-inline";
const nonStaticInt = eval(`10`);

const child = /*#__PURE__*/_jsx("span", {
  className: _cn
}, void 0, "hello world");

var _ref = /*#__PURE__*/_jsx("div", {
  className: _cn2
}, void 0, child);

var _ref2 = /*#__PURE__*/_jsx("div", {});

function TestMediaQuery() {
  // should extract
  // should extract
  const media2 = (0, _snackui.useMedia)(); // should remain

  const media3 = (0, _snackui.useMedia)(); // should remain

  return /*#__PURE__*/React.createElement(React.Fragment, null, _ref, /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn3 + (media2.xs && nonStaticInt ? _cn4 : _cn5) + _cn6 + _cn7 + _cn8 + _cn9)
  }, void 0, media3.lg && _ref2));
}

var _ref3 = /*#__PURE__*/_jsx("div", {
  className: _cn10
}, void 0, child);

function Test1() {
  return _ref3;
} // leaves valid props, combines classname


function Test2(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/_jsx(_snackui.Box, {
    onAccessibilityTap: () => {},
    className: _cn11
  }), /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn12 + (props.conditional ? _cn13 : " "))
  }, void 0, child));
} // single spread at end


function Test3(props) {
  return /*#__PURE__*/React.createElement(_snackui.VStack, Object.assign({
    onLayout: () => {}
  }, props, {
    className: (0, _helpers.concatClassName)(_cn14 + (props && props.className || ""), props)
  }), child);
} // static + dynamic prop, hoverStyle


function Test4() {
  return /*#__PURE__*/_jsx(_snackui.VStack, {
    width: `calc(100% + ${nonStaticInt * 2}px)`,
    className: _cn15
  });
} // spread


function Test5(props) {
  return /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn16 + (props.conditional ? _cn17 : " "))
  }, void 0, /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn18 + (props.conditional ? _cn17 : " "))
  }));
} // ternary


function Test6(props) {
  return /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn16 + (props.conditional ? _cn19 : _cn20))
  }, void 0, child);
} // evaluates away


function Test7() {
  return /*#__PURE__*/_jsx("div", {
    className: _cn21
  }, void 0, /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn3 + (nonStaticInt ? _cn22 : _cn23))
  }));
} // style expasion + imported constants


var _ref4 = /*#__PURE__*/_jsx("div", {
  className: _cn24
}, void 0, /*#__PURE__*/_jsx("div", {
  className: _cn25
}, void 0, /*#__PURE__*/_jsx(_snackui.AbsoluteVStack, {
  color: "blue",
  className: _cn26
})));

function Test8() {
  return _ref4;
} // combines with classname


var _ref5 = /*#__PURE__*/_jsx("div", {
  className: _cn27
});

function Test9() {
  return _ref5;
} // Text


function Test10({
  textStyle
}) {
  return /*#__PURE__*/_jsx("span", {
    className: _cn28
  }, void 0, /*#__PURE__*/_jsx("span", {
    className: _cn29
  }, void 0, /*#__PURE__*/React.createElement(_snackui.Text, Object.assign({}, textStyle, {
    className: (0, _helpers.concatClassName)(_cn30 + (nonStaticInt ? _cn31 : _cn32) + (" " + (textStyle && textStyle.className || "")), textStyle)
  }), "hello")));
} // alllll in one


function Test11(props) {
  return /*#__PURE__*/React.createElement(_snackui.VStack, Object.assign({}, props, {
    className: (0, _helpers.concatClassName)(_cn33 + (props.conditional ? _cn34 : _cn35) + (" " + (props.altConditional ? _cn36 : _cn37)) + (" " + (props && props.className || "")), props)
  }), child);
} // ternary multiple on same key


function Test12(props) {
  return /*#__PURE__*/_jsx("div", {
    className: (0, _helpers.concatClassName)(_cn3 + (props.conditional ? _cn38 : _cn39))
  });
} // text with complex conditional


function Test13(props) {
  return /*#__PURE__*/_jsx("span", {
    className: (0, _helpers.concatClassName)(_cn40 + (props.conditional ? _cn41 : _cn42))
  });
} // pressStyle + external constants


var _ref6 = /*#__PURE__*/_jsx("div", {
  className: _cn43
});

function Test14() {
  return _ref6;
} // spacer


var _ref7 = /*#__PURE__*/_jsx("div", {
  className: _cn44
});

var _ref8 = /*#__PURE__*/_jsx("div", {
  className: _cn45
});

function Test15() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, _ref7, _ref8);
} // override props when spread is used


function Test16(props) {
  return /*#__PURE__*/React.createElement(_snackui.VStack, Object.assign({}, props, {
    className: (0, _helpers.concatClassName)(_cn46 + (props.conditional ? _cn47 : _cn48) + (" " + (props && props.className || "")), props)
  }));
} // // TODO can't do this because it renders null on native
// // need to patch expo-linear-gradient for now
// export function TestLinearGradient() {
//   return (
//     <>
//       <VStack backgroundColor="red" width={10} height={10} />
//       <LinearGradient
//         style={[StyleSheet.absoluteFill]}
//         colors={['red', 'blue']}
//       />
//     </>
//   )
// }
})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;