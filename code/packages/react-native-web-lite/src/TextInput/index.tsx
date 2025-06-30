/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react'
import { StyleSheet } from '@tamagui/react-native-web-internals'
import {
  TextInputState,
  forwardedProps,
  getLocaleDirection,
  pick,
  useElementLayout,
  useLocaleContext,
  useMergeRefs,
  usePlatformMethods,
  useResponderEvents,
} from '@tamagui/react-native-web-internals'

import { useCreateElement } from '../createElement/index'
import type { PlatformMethods } from '../types'
import type { TextInputProps } from './types'

/**
 * Determines whether a 'selection' prop differs from a node's existing
 * selection state.
 */
const isSelectionStale = (node, selection) => {
  const { selectionEnd, selectionStart } = node
  const { start, end } = selection
  return start !== selectionStart || end !== selectionEnd
}

/**
 * Certain input types do no support 'selectSelectionRange' and will throw an
 * error.
 */
const setSelection = (node, selection) => {
  if (isSelectionStale(node, selection)) {
    const { start, end } = selection
    try {
      node.setSelectionRange(start, end || start)
    } catch (e) {}
  }
}

const forwardPropsList = Object.assign(
  {},
  forwardedProps.defaultProps,
  forwardedProps.accessibilityProps,
  forwardedProps.clickProps,
  forwardedProps.focusProps,
  forwardedProps.keyboardProps,
  forwardedProps.mouseProps,
  forwardedProps.touchProps,
  forwardedProps.styleProps,
  {
    autoCapitalize: true,
    className: true,
    autoComplete: true,
    autoCorrect: true,
    autoFocus: true,
    defaultValue: true,
    disabled: true,
    lang: true,
    maxLength: true,
    onChange: true,
    onScroll: true,
    placeholder: true,
    pointerEvents: true,
    readOnly: true,
    rows: true,
    spellCheck: true,
    value: true,
    type: true,
  }
)

const pickProps = (props) => pick(props, forwardPropsList)

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

// If an Input Method Editor is processing key input, the 'keyCode' is 229.
// https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
function isEventComposing(nativeEvent) {
  return nativeEvent.isComposing || nativeEvent.keyCode === 229
}

let focusTimeout: number | null = null

const TextInput = React.forwardRef<HTMLElement & PlatformMethods, TextInputProps>(
  (props, forwardedRef) => {
    const {
      autoCapitalize = 'sentences',
      autoComplete,
      autoCompleteType,
      autoCorrect = true,
      blurOnSubmit,
      clearTextOnFocus,
      dir,
      editable,
      enterKeyHint,
      inputMode = 'text',
      keyboardType,
      multiline = false,
      numberOfLines,
      onBlur,
      onChange,
      onChangeText,
      onContentSizeChange,
      onFocus,
      onKeyPress,
      onLayout,
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onResponderEnd,
      onResponderGrant,
      onResponderMove,
      onResponderReject,
      onResponderRelease,
      onResponderStart,
      onResponderTerminate,
      onResponderTerminationRequest,
      onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture,
      onSelectionChange,
      onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
      onSubmitEditing,
      placeholderTextColor,
      readOnly = false,
      returnKeyType,
      rows = 1,
      secureTextEntry = false,
      selection,
      selectTextOnFocus,
      spellCheck,
    } = props

    let type
    let _inputMode

    if (inputMode != null) {
      _inputMode = inputMode
      if (inputMode === 'email') {
        type = 'email'
      } else if (inputMode === 'tel') {
        type = 'tel'
      } else if (inputMode === 'search') {
        type = 'search'
      } else if (inputMode === 'url') {
        type = 'url'
      } else {
        type = 'text'
      }
    } else if (keyboardType != null) {
      warn('keyboardType', 'keyboardType is deprecated. Use inputMode.')
      switch (keyboardType) {
        case 'email-address':
          type = 'email'
          break
        case 'number-pad':
        case 'numeric':
          _inputMode = 'numeric'
          break
        case 'decimal-pad':
          _inputMode = 'decimal'
          break
        case 'phone-pad':
          type = 'tel'
          break
        case 'search':
        case 'web-search':
          type = 'search'
          break
        case 'url':
          type = 'url'
          break
        default:
          type = 'text'
      }
    }

    if (secureTextEntry) {
      type = 'password'
    }

    const dimensions = React.useRef({ height: null, width: null })
    const hostRef = React.useRef(null)

    const handleContentSizeChange = React.useCallback(
      (hostNode) => {
        if (multiline && onContentSizeChange && hostNode != null) {
          const newHeight = hostNode.scrollHeight
          const newWidth = hostNode.scrollWidth
          if (
            newHeight !== dimensions.current.height ||
            newWidth !== dimensions.current.width
          ) {
            dimensions.current.height = newHeight
            dimensions.current.width = newWidth
            onContentSizeChange({
              nativeEvent: {
                contentSize: {
                  height: dimensions.current.height,
                  width: dimensions.current.width,
                },
              },
            })
          }
        }
      },
      [multiline, onContentSizeChange]
    )

    const imperativeRef = React.useMemo(
      () => (hostNode) => {
        // TextInput needs to add more methods to the hostNode in addition to those
        // added by `usePlatformMethods`. This is temporarily until an API like
        // `TextInput.clear(hostRef)` is added to React Native.
        if (hostNode != null) {
          hostNode.clear = function () {
            if (hostNode != null) {
              hostNode.value = ''
            }
          }
          hostNode.isFocused = function () {
            return hostNode != null && TextInputState.currentlyFocusedField() === hostNode
          }
          handleContentSizeChange(hostNode)
        }
      },
      [handleContentSizeChange]
    )

    function handleBlur(e) {
      TextInputState._currentlyFocusedNode = null
      if (onBlur) {
        e.nativeEvent.text = e.target.value
        onBlur(e)
      }
    }

    function handleChange(e) {
      const hostNode = e.target
      const text = hostNode.value
      e.nativeEvent.text = text
      handleContentSizeChange(hostNode)
      if (onChange) {
        onChange(e)
      }
      if (onChangeText) {
        onChangeText(text)
      }
    }

    function handleFocus(e) {
      const hostNode = e.target
      if (onFocus) {
        e.nativeEvent.text = hostNode.value
        onFocus(e)
      }
      if (hostNode != null) {
        TextInputState._currentlyFocusedNode = hostNode
        if (clearTextOnFocus) {
          hostNode.value = ''
        }
        if (selectTextOnFocus) {
          // Safari requires selection to occur in a setTimeout
          if (focusTimeout != null) {
            clearTimeout(focusTimeout)
          }
          //@ts-ignore
          focusTimeout = setTimeout(() => {
            if (hostNode != null) {
              hostNode.select()
            }
          }, 0)
        }
      }
    }

    function handleKeyDown(e) {
      const hostNode = e.target
      // Prevent key events bubbling (see #612)
      e.stopPropagation()

      const blurOnSubmitDefault = !multiline
      const shouldBlurOnSubmit = blurOnSubmit == null ? blurOnSubmitDefault : blurOnSubmit

      const nativeEvent = e.nativeEvent
      const isComposing = isEventComposing(nativeEvent)

      if (onKeyPress) {
        onKeyPress(e)
      }

      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        // Do not call submit if composition is occuring.
        !isComposing &&
        !e.isDefaultPrevented()
      ) {
        if ((blurOnSubmit || !multiline) && onSubmitEditing) {
          // prevent "Enter" from inserting a newline or submitting a form
          e.preventDefault()
          nativeEvent.text = e.target.value
          onSubmitEditing(e)
        }
        if (shouldBlurOnSubmit && hostNode != null) {
          setTimeout(() => hostNode.blur(), 0)
        }
      }
    }

    function handleSelectionChange(e) {
      if (onSelectionChange) {
        try {
          const node = e.target
          const { selectionStart, selectionEnd } = node
          e.nativeEvent.selection = {
            start: selectionStart,
            end: selectionEnd,
          }
          e.nativeEvent.text = e.target.value
          onSelectionChange(e)
        } catch (e) {}
      }
    }

    useIsomorphicLayoutEffect(() => {
      const node = hostRef.current
      if (node != null && selection != null) {
        setSelection(node, selection)
      }
      if (document.activeElement === node) {
        TextInputState._currentlyFocusedNode = node
      }
    }, [hostRef, selection])

    const component = multiline ? 'textarea' : 'input'

    useElementLayout(hostRef, onLayout)
    useResponderEvents(hostRef, {
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onResponderEnd,
      onResponderGrant,
      onResponderMove,
      onResponderReject,
      onResponderRelease,
      onResponderStart,
      onResponderTerminate,
      onResponderTerminationRequest,
      onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
    })
    const { direction: contextDirection } = useLocaleContext()

    const supportedProps = pickProps(props) as any
    supportedProps.autoCapitalize = autoCapitalize
    supportedProps.autoComplete = autoComplete || autoCompleteType || 'on'
    supportedProps.autoCorrect = autoCorrect ? 'on' : 'off'
    // 'auto' by default allows browsers to infer writing direction
    supportedProps.dir = dir !== undefined ? dir : 'auto'
    if (returnKeyType != null) {
      warn('returnKeyType', 'returnKeyType is deprecated. Use enterKeyHint.')
    }
    supportedProps.enterKeyHint = enterKeyHint || returnKeyType
    supportedProps.inputMode = _inputMode
    supportedProps.onBlur = handleBlur
    supportedProps.onChange = handleChange
    supportedProps.onFocus = handleFocus
    supportedProps.onKeyDown = handleKeyDown
    supportedProps.onSelect = handleSelectionChange
    if (editable != null) {
      warn('editable', 'editable is deprecated. Use readOnly.')
    }
    supportedProps.readOnly = readOnly === true || editable === false
    if (numberOfLines != null) {
      warn('numberOfLines', 'TextInput numberOfLines is deprecated. Use rows.')
    }
    supportedProps.rows = multiline ? (rows != null ? rows : numberOfLines) : 1
    supportedProps.spellCheck = spellCheck != null ? spellCheck : autoCorrect
    supportedProps.style = [
      { '--placeholderTextColor': placeholderTextColor },
      styles.textinput$raw,
      styles.placeholder,
      props.style,
    ]
    supportedProps.type = multiline ? undefined : type

    const platformMethodsRef = usePlatformMethods(supportedProps)

    const setRef = useMergeRefs(hostRef, platformMethodsRef, imperativeRef, forwardedRef)

    supportedProps.ref = setRef

    const langDirection = props.lang != null ? getLocaleDirection(props.lang) : null
    const componentDirection = props.dir || langDirection
    const writingDirection = componentDirection || contextDirection

    const element = useCreateElement(component, supportedProps, {
      writingDirection,
    })

    return element
  }
)

function warn(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(...args)
  }
}

TextInput.displayName = 'TextInput'
//@ts-ignore
TextInput.State = TextInputState

const styles = StyleSheet.create({
  textinput$raw: {},
  placeholder: {
    placeholderTextColor: 'var(--placeholderTextColor)',
  },
})

export default TextInput
