/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
 import invariant from 'fbjs/lib/invariant';
 import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
 var canUseDOM = ExecutionEnvironment.canUseDOM;
 var dimensions = {
   window: {
     fontScale: 1,
     height: 0,
     scale: 1,
     width: 0
   },
   screen: {
     fontScale: 1,
     height: 0,
     scale: 1,
     width: 0
   }
 };
 var listeners = {};
let shouldInit = canUseDOM;
 
 var Dimensions = /*#__PURE__*/function () {
   function Dimensions() {}
 
   Dimensions.get = function get(dimension) {
     if (shouldInit) {
       shouldInit = false
       Dimensions._update()
     }
     invariant(dimensions[dimension], "No dimension set for key " + dimension);
     return dimensions[dimension];
   };
 
   Dimensions.set = function set(initialDimensions) {
     if (initialDimensions) {
       if (canUseDOM) {
         invariant(false, 'Dimensions cannot be set in the browser');
       } else {
         if (initialDimensions.screen != null) {
           dimensions.screen = initialDimensions.screen;
         }
 
         if (initialDimensions.window != null) {
           dimensions.window = initialDimensions.window;
         }
       }
     }
   };
 
   Dimensions._update = function _update() {
     if (!canUseDOM) {
       return;
     }
 
     var win = window;
     var docEl = win.document.documentElement;
     dimensions.window = {
       fontScale: 1,
       height: docEl.clientHeight,
       scale: win.devicePixelRatio || 1,
       width: docEl.clientWidth
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
     var _this = this;
 
     listeners[type] = listeners[type] || [];
     listeners[type].push(handler);
     return {
       remove: function remove() {
         _this.removeEventListener(type, handler);
       }
     };
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
 
 export { Dimensions as default };
 
 if (canUseDOM) {
 
   window.addEventListener('resize', Dimensions._update, false);
 }