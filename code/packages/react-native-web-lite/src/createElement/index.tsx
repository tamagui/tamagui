/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import {
  AccessibilityUtil,
  LocaleProvider,
  createDOMProps,
  stylesFromProps,
} from '@tamagui/react-native-web-internals'
import {
  type StyleObject,
  getStyleTags,
  insertStyleRules,
  useDidFinishSSR,
} from '@tamagui/web'
import React, { useInsertionEffect, useMemo } from 'react'

// SSR safe create element
export const useCreateElement = (component, props, options?) => {
  const { element, styles } = createElementAndStyles(component, props, options)

  const isHydrated = useDidFinishSSR()

  // only for ssr
  const styleTags = useMemo(
    () => {
      return isHydrated || !styles ? null : getStyleTags(styles)
    },
    [
      // never changes
    ]
  )

  // after that we insert
  useInsertionEffect(() => {
    if (!styles) return
    const styleObj: Record<string, StyleObject> = {}
    for (const style of styles) {
      styleObj[style[0]] = style
    }
    insertStyleRules(styleObj)
  }, [styles])

  return (
    <>
      {element}
      {styleTags}
    </>
  )
}

export const createElement = (component, props, options?) => {
  const { element, styles } = createElementAndStyles(component, props, options)

  return (
    <>
      {element}
      {styles ? getStyleTags(styles) : null}
    </>
  )
}

const createElementAndStyles = (component, props, options?) => {
  // Use equivalent platform elements where possible.
  let accessibilityComponent
  if (component && component.constructor === String) {
    accessibilityComponent = AccessibilityUtil.propsToAccessibilityComponent(props)
  }
  const Component = accessibilityComponent || component
  const domProps = createDOMProps(Component, props, options)

  const styles = stylesFromProps.get(domProps)

  let element = React.createElement(Component, domProps)

  // Update locale context if element's writing direction prop changes
  const elementWithLocaleProvider = domProps.dir ? (
    <LocaleProvider direction={domProps.dir} locale={domProps.lang}>
      {element}
    </LocaleProvider>
  ) : (
    element
  )

  return {
    element: elementWithLocaleProvider,
    styles,
  }
}
