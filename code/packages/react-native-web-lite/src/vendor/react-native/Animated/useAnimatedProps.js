

import _createForOfIteratorHelperLoose from '@babel/runtime/helpers/createForOfIteratorHelperLoose'
import {
  useLayoutEffect as _,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import useRefEffect from '../useRefEffect'
import { AnimatedEvent } from './AnimatedEvent'
import NativeAnimatedHelper from './NativeAnimatedHelper'
import AnimatedProps from './nodes/AnimatedProps'

const useLayoutEffect = typeof window === 'undefined' ? useEffect : _

export default function useAnimatedProps(props) {
  var _useReducer = useReducer((count) => count + 1, 0),
    scheduleUpdate = _useReducer[1]

  var onUpdateRef = useRef(null) // TODO: Only invalidate `node` if animated props or `style` change. In the
  // previous implementation, we permitted `style` to override props with the
  // same name property name as styles, so we can probably continue doing that.
  // The ordering of other props *should* not matter.

  var node = useMemo(
    () =>
      new AnimatedProps(props, () =>
        onUpdateRef.current == null ? void 0 : onUpdateRef.current()
      ),
    [props]
  )
  useAnimatedPropsLifecycle(node) // TODO: This "effect" does three things:
  //
  //   1) Call `setNativeView`.
  //   2) Update `onUpdateRef`.
  //   3) Update listeners for `AnimatedEvent` props.
  //
  // Ideally, each of these would be separat "effects" so that they are not
  // unnecessarily re-run when irrelevant dependencies change. For example, we
  // should be able to hoist all `AnimatedEvent` props and only do #3 if either
  // the `AnimatedEvent` props change or `instance` changes.
  //
  // But there is no way to transparently compose three separate callback refs,
  // so we just combine them all into one for now.

  var refEffect = useCallback(
    (instance) => {
      // NOTE: This may be called more often than necessary (e.g. when `props`
      // changes), but `setNativeView` already optimizes for that.
      node.setNativeView(instance) // NOTE: This callback is only used by the JavaScript animation driver.

      onUpdateRef.current = () => {
        // Schedule an update for this component to update `reducedProps`,
        // but do not compute it immediately. If a parent also updated, we
        // need to merge those new props in before updating.
        startTransition(() => {
          scheduleUpdate()
        })
      }

      var target = getEventTarget(instance)
      var events = []

      for (var propName in props) {
        var propValue = props[propName]

        if (propValue instanceof AnimatedEvent && propValue.__isNative) {
          propValue.__attach(target, propName)

          events.push([propName, propValue])
        }
      }

      return () => {
        onUpdateRef.current = null

        for (
          var _iterator = _createForOfIteratorHelperLoose(events), _step;
          !(_step = _iterator()).done;

        ) {
          var _step$value = _step.value,
            _propName = _step$value[0],
            _propValue = _step$value[1]

          _propValue.__detach(target, _propName)
        }
      }
    },
    [props, node]
  )
  var callbackRef = useRefEffect(refEffect)
  return [reduceAnimatedProps(node), callbackRef]
}

function reduceAnimatedProps(node) {
  // Force `collapsable` to be false so that the native view is not flattened.
  // Flattened views cannot be accurately referenced by the native driver.
  return {
    ...node.__getValue(),
    collapsable: false,
  }
}
/**
 * Manages the lifecycle of the supplied `AnimatedProps` by invoking `__attach`
 * and `__detach`. However, this is more complicated because `AnimatedProps`
 * uses reference counting to determine when to recursively detach its children
 * nodes. So in order to optimize this, we avoid detaching until the next attach
 * unless we are unmounting.
 */

function useAnimatedPropsLifecycle(node) {
  var prevNodeRef = useRef(null)
  var isUnmountingRef = useRef(false)
  useEffect(() => {
    // It is ok for multiple components to call `flushQueue` because it noops
    // if the queue is empty. When multiple animated components are mounted at
    // the same time. Only first component flushes the queue and the others will noop.
    NativeAnimatedHelper.API.flushQueue()
  })
  useLayoutEffect(() => {
    isUnmountingRef.current = false
    return () => {
      isUnmountingRef.current = true
    }
  }, [])
  useLayoutEffect(() => {
    node.__attach()

    if (prevNodeRef.current != null) {
      var prevNode = prevNodeRef.current // TODO: Stop restoring default values (unless `reset` is called).

      prevNode.__restoreDefaultValues()

      prevNode.__detach()

      prevNodeRef.current = null
    }

    return () => {
      if (isUnmountingRef.current) {
        // NOTE: Do not restore default values on unmount, see D18197735.
        node.__detach()
      } else {
        prevNodeRef.current = node
      }
    }
  }, [node])
}

function getEventTarget(instance) {
  return typeof instance === 'object' &&
    typeof (instance == null ? void 0 : instance.getScrollableNode) === 'function' // $FlowFixMe[incompatible-use] - Legacy instance assumptions.
    ? instance.getScrollableNode()
    : instance
} // $FlowFixMe[unclear-type] - Legacy instance assumptions.

function isFabricInstance(instance) {
  var _instance$getScrollRe

  return (
    hasFabricHandle(instance) || // Some components have a setNativeProps function but aren't a host component
    // such as lists like FlatList and SectionList. These should also use
    // forceUpdate in Fabric since setNativeProps doesn't exist on the underlying
    // host component. This crazy hack is essentially special casing those lists and
    // ScrollView itself to use forceUpdate in Fabric.
    // If these components end up using forwardRef then these hacks can go away
    // as instance would actually be the underlying host component and the above check
    // would be sufficient.
    hasFabricHandle(
      instance == null
        ? void 0
        : instance.getNativeScrollRef == null
        ? void 0
        : instance.getNativeScrollRef()
    ) ||
    hasFabricHandle(
      instance == null
        ? void 0
        : instance.getScrollResponder == null
        ? void 0
        : (_instance$getScrollRe = instance.getScrollResponder()) == null
        ? void 0
        : _instance$getScrollRe.getNativeScrollRef == null
        ? void 0
        : _instance$getScrollRe.getNativeScrollRef()
    )
  )
} // $FlowFixMe[unclear-type] - Legacy instance assumptions.

function hasFabricHandle(instance) {
  var _instance$_internalIn, _instance$_internalIn2

  // eslint-disable-next-line dot-notation
  return (
    (instance == null
      ? void 0
      : (_instance$_internalIn = instance['_internalInstanceHandle']) == null
      ? void 0
      : (_instance$_internalIn2 = _instance$_internalIn.stateNode) == null
      ? void 0
      : _instance$_internalIn2.canonical) != null
  )
}
