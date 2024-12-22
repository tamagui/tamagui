// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react'
import {
  Platform,
  StyleSheet,
  TextInputState,
  UIManager,
  dismissKeyboard,
  invariant,
  mergeRefs,
  warning,
} from '@tamagui/react-native-web-internals'

import Dimensions from '../Dimensions/index'
import View from '../View/index'
import ScrollViewBase from './ScrollViewBase'

const emptyObject = {} as any
const IS_ANIMATING_TOUCH_START_THRESHOLD_MS = 16

type Event = Object

class ScrollView extends React.Component<any> {
  _scrollNodeRef: any
  _innerViewRef: any

  keyboardWillOpenTo: any = null
  additionalScrollOffset = 0
  isTouching = false
  lastMomentumScrollBeginTime = 0
  lastMomentumScrollEndTime = 0

  // Reset to false every time becomes responder. This is used to:
  // - Determine if the scroll view has been scrolled and therefore should
  // refuse to give up its responder lock.
  // - Determine if releasing should dismiss the keyboard when we are in
  // tap-to-dismiss mode (!this.props.keyboardShouldPersistTaps).
  observedScrollSinceBecomingResponder = false
  becameResponderWhileAnimating = false

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder() {
    return this.mixin
  }

  getScrollableNode() {
    return this._scrollNodeRef
  }

  getInnerViewRef() {
    return this._innerViewRef
  }

  getInnerViewNode() {
    return this._innerViewRef
  }

  getNativeScrollRef() {
    return this._scrollNodeRef
  }

  render() {
    const {
      contentContainerStyle,
      horizontal,
      onContentSizeChange,
      refreshControl,
      stickyHeaderIndices,
      pagingEnabled,
      /* eslint-disable */
      forwardedRef,
      keyboardDismissMode,
      onScroll,
      centerContent,
      /* eslint-enable */
      ...other
    } = this.props

    if (process.env.NODE_ENV !== 'production' && this.props.style) {
      const style = StyleSheet.flatten(this.props.style)
      const childLayoutProps = ['alignItems', 'justifyContent'].filter(
        (prop) => style && style[prop] !== undefined
      )
      invariant(
        childLayoutProps.length === 0,
        `ScrollView child layout (${JSON.stringify(childLayoutProps)}) ` +
          'must be applied through the contentContainerStyle prop.'
      )
    }

    let contentSizeChangeProps = {}
    if (onContentSizeChange) {
      contentSizeChangeProps = {
        onLayout: this._handleContentOnLayout.bind(this),
      }
    }

    const hasStickyHeaderIndices = !horizontal && Array.isArray(stickyHeaderIndices)
    const children =
      hasStickyHeaderIndices || pagingEnabled
        ? React.Children.map(this.props.children, (child, i) => {
            const isSticky = hasStickyHeaderIndices && stickyHeaderIndices.indexOf(i) > -1
            if (child != null && (isSticky || pagingEnabled)) {
              return (
                <View
                  style={StyleSheet.compose(
                    isSticky && styles.stickyHeader,
                    pagingEnabled && styles.pagingEnabledChild
                  )}
                >
                  {child}
                </View>
              )
            } else {
              return child
            }
          })
        : this.props.children

    const contentContainer = (
      <View
        {...contentSizeChangeProps}
        // @ts-ignore
        collapsable={false}
        ref={this._setInnerViewRef.bind(this)}
        style={[
          horizontal && styles.contentContainerHorizontal,
          centerContent && styles.contentContainerCenterContent,
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    )

    const baseStyle = horizontal ? styles.baseHorizontal : styles.baseVertical
    const pagingEnabledStyle = horizontal
      ? styles.pagingEnabledHorizontal
      : styles.pagingEnabledVertical

    const props = {
      ...other,
      style: [baseStyle, pagingEnabled && pagingEnabledStyle, this.props.style],
      onTouchStart: this.scrollResponderHandleTouchStart.bind(this),
      onTouchMove: this.scrollResponderHandleTouchMove.bind(this),
      onTouchEnd: this.scrollResponderHandleTouchEnd.bind(this),
      onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag.bind(this),
      onScrollEndDrag: this.scrollResponderHandleScrollEndDrag.bind(this),
      onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin.bind(this),
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd.bind(this),
      onStartShouldSetResponder:
        this.scrollResponderHandleStartShouldSetResponder.bind(this),
      onStartShouldSetResponderCapture:
        this.scrollResponderHandleStartShouldSetResponderCapture.bind(this),
      onScrollShouldSetResponder:
        this.scrollResponderHandleScrollShouldSetResponder.bind(this),
      onScroll: this._handleScroll.bind(this),
      onResponderGrant: this.scrollResponderHandleResponderGrant.bind(this),
      onResponderTerminationRequest:
        this.scrollResponderHandleTerminationRequest.bind(this),
      onResponderRelease: this.scrollResponderHandleResponderRelease.bind(this),
      onResponderReject: this.scrollResponderHandleResponderReject.bind(this),
    }

    const ScrollViewClass = ScrollViewBase

    invariant(ScrollViewClass !== undefined, 'ScrollViewClass must not be undefined')

    const scrollView = (
      <ScrollViewClass {...props} ref={this._setScrollNodeRef.bind(this)}>
        {contentContainer}
      </ScrollViewClass>
    )

    if (refreshControl) {
      return React.cloneElement(refreshControl, { style: props.style }, scrollView)
    }

    return scrollView
  }

  _handleContentOnLayout(e: any) {
    const { width, height } = e.nativeEvent.layout
    this.props.onContentSizeChange(width, height)
  }

  _handleScroll(e: Object) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.onScroll && this.props.scrollEventThrottle == null) {
        console.info(
          'You specified `onScroll` on a <ScrollView> but not ' +
            '`scrollEventThrottle`. You will only receive one event. ' +
            'Using `16` you get all the events but be aware that it may ' +
            "cause frame drops, use a bigger number if you don't need as " +
            'much precision.'
        )
      }
    }

    if (this.props.keyboardDismissMode === 'on-drag') {
      dismissKeyboard()
    }

    this.scrollResponderHandleScroll(e)
  }

  _setInnerViewRef(node) {
    this._innerViewRef = node
  }

  _setScrollNodeRef(node) {
    this._scrollNodeRef = node
    // ScrollView needs to add more methods to the hostNode in addition to those
    // added by `usePlatformMethods`. This is temporarily until an API like
    // `ScrollView.scrollTo(hostNode, { x, y })` is added to React Native.
    if (node != null) {
      node.getScrollResponder = this.getScrollResponder
      node.getInnerViewNode = this.getInnerViewNode
      node.getInnerViewRef = this.getInnerViewRef
      node.getNativeScrollRef = this.getNativeScrollRef
      node.getScrollableNode = this.getScrollableNode
      node.scrollTo = this.scrollTo
      node.scrollToEnd = this.scrollToEnd
      node.scrollResponderZoomTo = this.scrollResponderZoomTo
      node.scrollResponderScrollNativeHandleToKeyboard =
        this.scrollResponderScrollNativeHandleToKeyboard
    }
    const ref = mergeRefs(this.props.forwardedRef)
    ref(node)
  }

  /**
   * Invoke this from an `onScroll` event.
   */
  scrollResponderHandleScrollShouldSetResponder(): boolean {
    return this.isTouching
  }

  /**
   * Merely touch starting is not sufficient for a scroll view to become the
   * responder. Being the "responder" means that the very next touch move/end
   * event will result in an action/movement.
   *
   * Invoke this from an `onStartShouldSetResponder` event.
   *
   * `onStartShouldSetResponder` is used when the next move/end will trigger
   * some UI movement/action, but when you want to yield priority to views
   * nested inside of the view.
   *
   * There may be some cases where scroll views actually should return `true`
   * from `onStartShouldSetResponder`: Any time we are detecting a standard tap
   * that gives priority to nested views.
   *
   * - If a single tap on the scroll view triggers an action such as
   *   recentering a map style view yet wants to give priority to interaction
   *   views inside (such as dropped pins or labels), then we would return true
   *   from this method when there is a single touch.
   *
   * - Similar to the previous case, if a two finger "tap" should trigger a
   *   zoom, we would check the `touches` count, and if `>= 2`, we would return
   *   true.
   *
   */
  scrollResponderHandleStartShouldSetResponder(): boolean {
    return false
  }

  /**
   * There are times when the scroll view wants to become the responder
   * (meaning respond to the next immediate `touchStart/touchEnd`), in a way
   * that *doesn't* give priority to nested views (hence the capture phase):
   *
   * - Currently animating.
   * - Tapping anywhere that is not the focused input, while the keyboard is
   *   up (which should dismiss the keyboard).
   *
   * Invoke this from an `onStartShouldSetResponderCapture` event.
   */
  scrollResponderHandleStartShouldSetResponderCapture(e: Event): boolean {
    // First see if we want to eat taps while the keyboard is up
    // var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
    // if (!this.props.keyboardShouldPersistTaps &&
    //   currentlyFocusedTextInput != null &&
    //   e.target !== currentlyFocusedTextInput) {
    //   return true;
    // }
    return this.scrollResponderIsAnimating()
  }

  /**
   * Invoke this from an `onResponderReject` event.
   *
   * Some other element is not yielding its role as responder. Normally, we'd
   * just disable the `UIScrollView`, but a touch has already began on it, the
   * `UIScrollView` will not accept being disabled after that. The easiest
   * solution for now is to accept the limitation of disallowing this
   * altogether. To improve this, find a way to disable the `UIScrollView` after
   * a touch has already started.
   */
  scrollResponderHandleResponderReject() {
    warning(false, "ScrollView doesn't take rejection well - scrolls anyway")
  }

  /**
   * We will allow the scroll view to give up its lock iff it acquired the lock
   * during an animation. This is a very useful default that happens to satisfy
   * many common user experiences.
   *
   * - Stop a scroll on the left edge, then turn that into an outer view's
   *   backswipe.
   * - Stop a scroll mid-bounce at the top, continue pulling to have the outer
   *   view dismiss.
   * - However, without catching the scroll view mid-bounce (while it is
   *   motionless), if you drag far enough for the scroll view to become
   *   responder (and therefore drag the scroll view a bit), any backswipe
   *   navigation of a swipe gesture higher in the view hierarchy, should be
   *   rejected.
   */
  scrollResponderHandleTerminationRequest(): boolean {
    return !this.observedScrollSinceBecomingResponder
  }

  /**
   * Invoke this from an `onTouchEnd` event.
   *
   * @param {SyntheticEvent} e Event.
   */
  scrollResponderHandleTouchEnd(e: Event) {
    const nativeEvent = e.nativeEvent
    this.isTouching = nativeEvent.touches.length !== 0
    this.props.onTouchEnd && this.props.onTouchEnd(e)
  }

  /**
   * Invoke this from an `onResponderRelease` event.
   */
  scrollResponderHandleResponderRelease(e: Event) {
    this.props.onResponderRelease && this.props.onResponderRelease(e)

    // By default scroll views will unfocus a textField
    // if another touch occurs outside of it
    const currentlyFocusedTextInput = TextInputState.currentlyFocusedField()
    if (
      !this.props.keyboardShouldPersistTaps &&
      currentlyFocusedTextInput != null &&
      e.target !== currentlyFocusedTextInput &&
      !this.observedScrollSinceBecomingResponder &&
      !this.becameResponderWhileAnimating
    ) {
      this.props.onScrollResponderKeyboardDismissed &&
        this.props.onScrollResponderKeyboardDismissed(e)
      TextInputState.blurTextInput(currentlyFocusedTextInput)
    }
  }

  scrollResponderHandleScroll(e: Event) {
    this.observedScrollSinceBecomingResponder = true
    this.props.onScroll && this.props.onScroll(e)
  }

  /**
   * Invoke this from an `onResponderGrant` event.
   */
  scrollResponderHandleResponderGrant(e: Event) {
    this.observedScrollSinceBecomingResponder = false
    this.props.onResponderGrant && this.props.onResponderGrant(e)
    this.becameResponderWhileAnimating = this.scrollResponderIsAnimating()
  }

  /**
   * Unfortunately, `onScrollBeginDrag` also fires when *stopping* the scroll
   * animation, and there's not an easy way to distinguish a drag vs. stopping
   * momentum.
   *
   * Invoke this from an `onScrollBeginDrag` event.
   */
  scrollResponderHandleScrollBeginDrag(e: Event) {
    this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e)
  }

  /**
   * Invoke this from an `onScrollEndDrag` event.
   */
  scrollResponderHandleScrollEndDrag(e: Event) {
    this.props.onScrollEndDrag && this.props.onScrollEndDrag(e)
  }

  /**
   * Invoke this from an `onMomentumScrollBegin` event.
   */
  scrollResponderHandleMomentumScrollBegin(e: Event) {
    this.lastMomentumScrollBeginTime = Date.now()
    this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin(e)
  }

  /**
   * Invoke this from an `onMomentumScrollEnd` event.
   */
  scrollResponderHandleMomentumScrollEnd(e: Event) {
    this.lastMomentumScrollEndTime = Date.now()
    this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e)
  }

  /**
   * Invoke this from an `onTouchStart` event.
   *
   * Since we know that the `SimpleEventPlugin` occurs later in the plugin
   * order, after `ResponderEventPlugin`, we can detect that we were *not*
   * permitted to be the responder (presumably because a contained view became
   * responder). The `onResponderReject` won't fire in that case - it only
   * fires when a *current* responder rejects our request.
   *
   * @param {SyntheticEvent} e Touch Start event.
   */
  scrollResponderHandleTouchStart(e: Event) {
    this.isTouching = true
    this.props.onTouchStart && this.props.onTouchStart(e)
  }

  /**
   * Invoke this from an `onTouchMove` event.
   *
   * Since we know that the `SimpleEventPlugin` occurs later in the plugin
   * order, after `ResponderEventPlugin`, we can detect that we were *not*
   * permitted to be the responder (presumably because a contained view became
   * responder). The `onResponderReject` won't fire in that case - it only
   * fires when a *current* responder rejects our request.
   *
   * @param {SyntheticEvent} e Touch Start event.
   */
  scrollResponderHandleTouchMove(e: Event) {
    this.props.onTouchMove && this.props.onTouchMove(e)
  }

  /**
   * A helper function for this class that lets us quickly determine if the
   * view is currently animating. This is particularly useful to know when
   * a touch has just started or ended.
   */
  scrollResponderIsAnimating(): boolean {
    const now = Date.now()
    const timeSinceLastMomentumScrollEnd = now - this.lastMomentumScrollEndTime
    const isAnimating =
      timeSinceLastMomentumScrollEnd < IS_ANIMATING_TOUCH_START_THRESHOLD_MS ||
      this.lastMomentumScrollEndTime < this.lastMomentumScrollBeginTime
    return isAnimating
  }
}

const commonStyle = {
  flexGrow: 1,
  flexShrink: 1,
  // Enable hardware compositing in modern browsers.
  // Creates a new layer with its own backing surface that can significantly
  // improve scroll performance.
  transform: [{ translateZ: 0 }],
  // iOS native scrolling
  WebkitOverflowScrolling: 'touch',
}

const styles = {
  baseVertical: {
    ...commonStyle,
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  baseHorizontal: {
    ...commonStyle,
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  contentContainerHorizontal: {
    flexDirection: 'row',
  },
  contentContainerCenterContent: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  pagingEnabledHorizontal: {
    scrollSnapType: 'x mandatory',
  },
  pagingEnabledVertical: {
    scrollSnapType: 'y mandatory',
  },
  pagingEnabledChild: {
    scrollSnapAlign: 'start',
  },
}

const ForwardedScrollView = React.forwardRef((props, forwardedRef) => {
  return <ScrollView {...props} forwardedRef={forwardedRef} />
})

ForwardedScrollView.displayName = 'ScrollView'

export default ForwardedScrollView

/**
 * Mixin that can be integrated in order to handle scrolling that plays well
 * with `ResponderEventPlugin`. Integrate with your platform specific scroll
 * views, or even your custom built (every-frame animating) scroll views so that
 * all of these systems play well with the `ResponderEventPlugin`.
 *
 * iOS scroll event timing nuances:
 * ===============================
 *
 *
 * Scrolling without bouncing, if you touch down:
 * -------------------------------
 *
 * 1. `onMomentumScrollBegin` (when animation begins after letting up)
 *    ... physical touch starts ...
 * 2. `onTouchStartCapture`   (when you press down to stop the scroll)
 * 3. `onTouchStart`          (same, but bubble phase)
 * 4. `onResponderRelease`    (when lifting up - you could pause forever before * lifting)
 * 5. `onMomentumScrollEnd`
 *
 *
 * Scrolling with bouncing, if you touch down:
 * -------------------------------
 *
 * 1. `onMomentumScrollBegin` (when animation begins after letting up)
 *    ... bounce begins ...
 *    ... some time elapses ...
 *    ... physical touch during bounce ...
 * 2. `onMomentumScrollEnd`   (Makes no sense why this occurs first during bounce)
 * 3. `onTouchStartCapture`   (immediately after `onMomentumScrollEnd`)
 * 4. `onTouchStart`          (same, but bubble phase)
 * 5. `onTouchEnd`            (You could hold the touch start for a long time)
 * 6. `onMomentumScrollBegin` (When releasing the view starts bouncing back)
 *
 * So when we receive an `onTouchStart`, how can we tell if we are touching
 * *during* an animation (which then causes the animation to stop)? The only way
 * to tell is if the `touchStart` occurred immediately after the
 * `onMomentumScrollEnd`.
 *
 * This is abstracted out for you, so you can just call this.scrollResponderIsAnimating() if
 * necessary
 *
 * `ScrollResponder` also includes logic for blurring a currently focused input
 * if one is focused while scrolling. The `ScrollResponder` is a natural place
 * to put this logic since it can support not dismissing the keyboard while
 * scrolling, unless a recognized "tap"-like gesture has occurred.
 *
 * The public lifecycle API includes events for keyboard interaction, responder
 * interaction, and scrolling (among others). The keyboard callbacks
 * `onKeyboardWill/Did/*` are *global* events, but are invoked on scroll
 * responder's props so that you can guarantee that the scroll responder's
 * internal state has been updated accordingly (and deterministically) by
 * the time the props callbacks are invoke. Otherwise, you would always wonder
 * if the scroll responder is currently in a state where it recognizes new
 * keyboard positions etc. If coordinating scrolling with keyboard movement,
 * *always* use these hooks instead of listening to your own global keyboard
 * events.
 *
 * Public keyboard lifecycle API: (props callbacks)
 *
 * Standard Keyboard Appearance Sequence:
 *
 *   this.props.onKeyboardWillShow
 *   this.props.onKeyboardDidShow
 *
 * `onScrollResponderKeyboardDismissed` will be invoked if an appropriate
 * tap inside the scroll responder's scrollable region was responsible
 * for the dismissal of the keyboard. There are other reasons why the
 * keyboard could be dismissed.
 *
 *   this.props.onScrollResponderKeyboardDismissed
 *
 * Standard Keyboard Hide Sequence:
 *
 *   this.props.onKeyboardWillHide
 *   this.props.onKeyboardDidHide
 */
