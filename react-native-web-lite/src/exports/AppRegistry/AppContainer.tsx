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

import StyleSheet from '../StyleSheet'
import View from '../View'

type Props = {
  WrapperComponent?: React.FunctionComponent<any> | null
  children?: React.ReactNode
  rootTag: any
}

const RootTagContext: React.Context<any> = React.createContext(null)

export default function AppContainer(props: Props) {
  const { children, WrapperComponent } = props

  let innerView = (
    <View key={1} pointerEvents="box-none" style={styles.appContainer}>
      {children}
    </View>
  )

  if (WrapperComponent) {
    innerView = <WrapperComponent>{innerView}</WrapperComponent>
  }

  return (
    <RootTagContext.Provider value={props.rootTag}>
      <View pointerEvents="box-none" style={styles.appContainer}>
        {innerView}
      </View>
    </RootTagContext.Provider>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
})
