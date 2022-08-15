/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

import _extends from "@babel/runtime/helpers/extends";
import _objectSpread from "@babel/runtime/helpers/objectSpread2";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["style"],
    _excluded2 = ["style"];
import View from '../../../exports/View';
import { AnimatedEvent } from './AnimatedEvent';
import AnimatedProps from './nodes/AnimatedProps';
import * as React from 'react';
import NativeAnimatedHelper from './NativeAnimatedHelper';
import invariant from 'fbjs/lib/invariant';
import setAndForwardRef from '../Utilities/setAndForwardRef';
var animatedComponentNextId = 1;

function createAnimatedComponent(Component, options) {
  invariant(typeof Component !== 'function' || Component.prototype && Component.prototype.isReactComponent, '`createAnimatedComponent` does not support stateless functional components; ' + 'use a class component instead.');

  class AnimatedComponent extends React.Component {
    constructor() {
      super(...arguments);
      this._invokeAnimatedPropsCallbackOnMount = false;
      this._eventDetachers = [];
      this._animatedComponentId = animatedComponentNextId++ + ":animatedComponent";

      this._isFabric = () => {
        var _this$_component$_int, _this$_component$_int2, _this$_component$getN, _this$_component$getN2, _this$_component$getS, _this$_component$getS2;

        // When called during the first render, `_component` is always null.
        // Therefore, even if a component is rendered in Fabric, we can't detect
        // that until ref is set, which happens sometime after the first render.
        // In cases where this value switching between "false" and "true" on Fabric
        // causes issues, add an additional check for _component nullity.
        if (this._component == null) {
          return false;
        }

        return (// eslint-disable-next-line dot-notation
          ((_this$_component$_int = this._component['_internalInstanceHandle']) == null ? void 0 : (_this$_component$_int2 = _this$_component$_int.stateNode) == null ? void 0 : _this$_component$_int2.canonical) != null || // Some components have a setNativeProps function but aren't a host component
          // such as lists like FlatList and SectionList. These should also use
          // forceUpdate in Fabric since setNativeProps doesn't exist on the underlying
          // host component. This crazy hack is essentially special casing those lists and
          // ScrollView itself to use forceUpdate in Fabric.
          // If these components end up using forwardRef then these hacks can go away
          // as this._component would actually be the underlying host component and the above check
          // would be sufficient.
          this._component.getNativeScrollRef != null && this._component.getNativeScrollRef() != null && // eslint-disable-next-line dot-notation
          ((_this$_component$getN = this._component.getNativeScrollRef()['_internalInstanceHandle']) == null ? void 0 : (_this$_component$getN2 = _this$_component$getN.stateNode) == null ? void 0 : _this$_component$getN2.canonical) != null || this._component.getScrollResponder != null && this._component.getScrollResponder() != null && this._component.getScrollResponder().getNativeScrollRef != null && this._component.getScrollResponder().getNativeScrollRef() != null && ((_this$_component$getS = this._component.getScrollResponder().getNativeScrollRef()[// eslint-disable-next-line dot-notation
          '_internalInstanceHandle']) == null ? void 0 : (_this$_component$getS2 = _this$_component$getS.stateNode) == null ? void 0 : _this$_component$getS2.canonical) != null
        );
      };

      this._waitForUpdate = () => {
        if (this._isFabric()) {
          NativeAnimatedHelper.API.setWaitingForIdentifier(this._animatedComponentId);
        }
      };

      this._markUpdateComplete = () => {
        if (this._isFabric()) {
          NativeAnimatedHelper.API.unsetWaitingForIdentifier(this._animatedComponentId);
        }
      };

      this._animatedPropsCallback = () => {
        if (this._component == null) {
          // AnimatedProps is created in will-mount because it's used in render.
          // But this callback may be invoked before mount in async mode,
          // In which case we should defer the setNativeProps() call.
          // React may throw away uncommitted work in async mode,
          // So a deferred call won't always be invoked.
          this._invokeAnimatedPropsCallbackOnMount = true;
        } else if (process.env.NODE_ENV === 'test' || // For animating properties of non-leaf/non-native components
        typeof this._component.setNativeProps !== 'function' || // In Fabric, force animations to go through forceUpdate and skip setNativeProps
        this._isFabric()) {
          this.forceUpdate();
        } else if (!this._propsAnimated.__isNative) {
          this._component.setNativeProps(this._propsAnimated.__getAnimatedValue());
        } else {
          throw new Error('Attempting to run JS driven animation on animated ' + 'node that has been moved to "native" earlier by starting an ' + 'animation with `useNativeDriver: true`');
        }
      };

      this._setComponentRef = setAndForwardRef({
        getForwardedRef: () => this.props.forwardedRef,
        setLocalRef: ref => {
          this._prevComponent = this._component;
          this._component = ref; // TODO: Delete this in a future release.

          if (ref != null && ref.getNode == null) {
            ref.getNode = () => {
              var _ref$constructor$name;

              console.warn('%s: Calling `getNode()` on the ref of an Animated component ' + 'is no longer necessary. You can now directly use the ref ' + 'instead. This method will be removed in a future release.', (_ref$constructor$name = ref.constructor.name) !== null && _ref$constructor$name !== void 0 ? _ref$constructor$name : '<<anonymous>>');
              return ref;
            };
          }
        }
      });
    }

    _attachNativeEvents() {
      var _this$_component,
          _this = this;

      // Make sure to get the scrollable node for components that implement
      // `ScrollResponder.Mixin`.
      var scrollableNode = (_this$_component = this._component) != null && _this$_component.getScrollableNode ? this._component.getScrollableNode() : this._component;

      var _loop = function _loop(key) {
        var prop = _this.props[key];

        if (prop instanceof AnimatedEvent && prop.__isNative) {
          prop.__attach(scrollableNode, key);

          _this._eventDetachers.push(() => prop.__detach(scrollableNode, key));
        }
      };

      for (var key in this.props) {
        _loop(key);
      }
    }

    _detachNativeEvents() {
      this._eventDetachers.forEach(remove => remove());

      this._eventDetachers = [];
    }

    _attachProps(nextProps) {
      var oldPropsAnimated = this._propsAnimated;

      if (nextProps === oldPropsAnimated) {
        return;
      }

      this._propsAnimated = new AnimatedProps(nextProps, this._animatedPropsCallback); // When you call detach, it removes the element from the parent list
      // of children. If it goes to 0, then the parent also detaches itself
      // and so on.
      // An optimization is to attach the new elements and THEN detach the old
      // ones instead of detaching and THEN attaching.
      // This way the intermediate state isn't to go to 0 and trigger
      // this expensive recursive detaching to then re-attach everything on
      // the very next operation.

      if (oldPropsAnimated) {
        oldPropsAnimated.__restoreDefaultValues();

        oldPropsAnimated.__detach();
      }
    }

    render() {
      var _ref = this._propsAnimated.__getValue() || {},
          _ref$style = _ref.style,
          style = _ref$style === void 0 ? {} : _ref$style,
          props = _objectWithoutPropertiesLoose(_ref, _excluded);

      var _ref2 = this.props.passthroughAnimatedPropExplicitValues || {},
          _ref2$style = _ref2.style,
          passthruStyle = _ref2$style === void 0 ? {} : _ref2$style,
          passthruProps = _objectWithoutPropertiesLoose(_ref2, _excluded2);

      var mergedStyle = _objectSpread(_objectSpread({}, style), passthruStyle);

      return /*#__PURE__*/React.createElement(Component, _extends({}, props, passthruProps, {
        style: mergedStyle,
        ref: this._setComponentRef
      }));
    }

    UNSAFE_componentWillMount() {
      this._waitForUpdate();

      this._attachProps(this.props);
    }

    componentDidMount() {
      if (this._invokeAnimatedPropsCallbackOnMount) {
        this._invokeAnimatedPropsCallbackOnMount = false;

        this._animatedPropsCallback();
      }

      this._propsAnimated.setNativeView(this._component);

      this._attachNativeEvents();

      this._markUpdateComplete();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      this._waitForUpdate();

      this._attachProps(newProps);
    }

    componentDidUpdate(prevProps) {
      if (this._component !== this._prevComponent) {
        this._propsAnimated.setNativeView(this._component);
      }

      if (this._component !== this._prevComponent || prevProps !== this.props) {
        this._detachNativeEvents();

        this._attachNativeEvents();
      }

      this._markUpdateComplete();
    }

    componentWillUnmount() {
      this._propsAnimated && this._propsAnimated.__detach();

      this._detachNativeEvents();

      this._markUpdateComplete();

      this._component = null;
      this._prevComponent = null;
    }

  }

  return /*#__PURE__*/React.forwardRef(function AnimatedComponentWrapper(props, ref) {
    return /*#__PURE__*/React.createElement(AnimatedComponent, _extends({}, props, ref == null ? null : {
      forwardedRef: ref
    }));
  });
}

export default createAnimatedComponent;