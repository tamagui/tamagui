/**
* @license React
 * react-server-dom-vite-client-proxy.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react';

// Store of components discovered during RSC to load
// them later when consuming the response in SSR.
globalThis.__COMPONENT_INDEX = {}; // Store to get module references for long strings
// when rendering in RSC (strings cannot be wrapped Proxy).

globalThis.__STRING_REFERENCE_INDEX = {};
var MODULE_TAG = Symbol.for('react.module.reference');
var STRING_SIZE_LIMIT = 64;
var FN_RSC_ERROR = 'Functions exported from client components cannot be called or used as constructors from a server component.';
function isRsc() {
  var currentDispatcher = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
  return !!(currentDispatcher && currentDispatcher.isRsc);
}

function createModuleReference(id, value, name, isDefault) {
  var moduleRef = Object.create(null);
  moduleRef.$$typeof = MODULE_TAG;
  moduleRef.filepath = id;
  moduleRef.name = isDefault ? 'default' : name; // Store component in a global index during RSC to use it later in SSR

  globalThis.__COMPONENT_INDEX[id] = Object.defineProperty(globalThis.__COMPONENT_INDEX[id] || Object.create(null), moduleRef.name, {
    value: value,
    writable: true
  });
  return moduleRef;
} // A ClientProxy behaves as a module reference for the Flight
// runtime (RSC) and as a real component for the Fizz runtime (SSR).
// Note that this is not used in browser environments.


function wrapInClientProxy(_ref) {
  var id = _ref.id,
      name = _ref.name,
      isDefault = _ref.isDefault,
      value = _ref.value;
  var type = typeof value;

  if (value === null || type !== 'object' && type !== 'function') {
    if (type === 'string' && value.length >= STRING_SIZE_LIMIT) {
      var _moduleRef = createModuleReference(id, value, name, isDefault);

      globalThis.__STRING_REFERENCE_INDEX[value] = _moduleRef;
    }

    return value;
  }

  var moduleRef = createModuleReference(id, value, name, isDefault);

  var get = function (target, prop, receiver) {
    if (prop === '$$unwrappedValue') return value;
    if (prop === '$$moduleReference') return moduleRef;
    return Reflect.get(isRsc() ? moduleRef : target, prop, receiver);
  };

  return new Proxy(value, type === 'object' ? {
    get: get
  } : {
    get: get,
    apply: function () {
      if (isRsc()) throw new Error(FN_RSC_ERROR + (" Calling \"" + name + "\"."));
      return Reflect.apply.apply(Reflect, arguments);
    },
    construct: function () {
      if (isRsc()) throw new Error(FN_RSC_ERROR + (" Instantiating \"" + name + "\"."));
      return Reflect.construct.apply(Reflect, arguments);
    }
  });
}

export { FN_RSC_ERROR, MODULE_TAG, STRING_SIZE_LIMIT, isRsc, wrapInClientProxy };
