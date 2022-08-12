/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'fbjs/lib/invariant'
import { ComponentType, FunctionComponent, ReactNode } from 'react'
import React from 'react'

import render, { hydrate } from '../render'
import StyleSheet from '../StyleSheet'
import AppContainer from './AppContainer'

export default function renderApplication<Props extends Object>(
  RootComponent: ComponentType<Props>,
  WrapperComponent: FunctionComponent<any> | null = null,
  callback: () => void = () => {},
  options: {
    hydrate: boolean
    initialProps: Props
    rootTag: any
  }
) {
  const { hydrate: shouldHydrate, initialProps, rootTag } = options
  const renderFn = shouldHydrate ? hydrate : render

  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag)

  renderFn(
    <AppContainer WrapperComponent={WrapperComponent} rootTag={rootTag}>
      <RootComponent {...initialProps} />
    </AppContainer>,
    rootTag,
    callback
  )
}

export function getApplication(
  RootComponent: ComponentType<Object>,
  initialProps: Object,
  WrapperComponent?: FunctionComponent<any> | null
): {
  element: ReactNode
  getStyleElement: (object: Object) => ReactNode
} {
  const element = (
    <AppContainer WrapperComponent={WrapperComponent} rootTag={{}}>
      <RootComponent {...initialProps} />
    </AppContainer>
  )
  // Don't escape CSS text
  const getStyleElement = (props) => {
    const sheet = StyleSheet.getSheet()
    return (
      <style {...props} dangerouslySetInnerHTML={{ __html: sheet.textContent }} id={sheet.id} />
    )
  }
  return { element, getStyleElement }
}
