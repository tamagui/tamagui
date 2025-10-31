/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

import { invariant } from '@tamagui/react-native-web-internals'
import * as React from 'react'

/**
 * `setState` is called asynchronously, and should not rely on the value of
 * `this.props` or `this.state`:
 * https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
 *
 * SafePureComponent adds runtime enforcement, to catch cases where these
 * variables are read in a state updater function, instead of the ones passed
 * in.
 */
class StateSafePureComponent extends React.PureComponent {
  _inAsyncStateUpdate = false

  constructor(props) {
    super(props)
    this._installSetStateHooks()
  }

  setState(partialState, callback) {
    if (typeof partialState === 'function') {
      super.setState((state, props) => {
        this._inAsyncStateUpdate = true
        let ret
        try {
          ret = partialState(state, props)
        } catch (err) {
          throw err
        } finally {
          this._inAsyncStateUpdate = false
        }
        return ret
      }, callback)
    } else {
      super.setState(partialState, callback)
    }
  }

  _installSetStateHooks() {
    const that = this
    let { props, state } = this

    Object.defineProperty(this, 'props', {
      get() {
        invariant(
          !that._inAsyncStateUpdate,
          '"this.props" should not be accessed during state updates'
        )
        return props
      },
      set(newProps) {
        props = newProps
      },
    })
    Object.defineProperty(this, 'state', {
      get() {
        invariant(
          !that._inAsyncStateUpdate,
          '"this.state" should not be acceessed during state updates'
        )
        return state
      },
      set(newState) {
        state = newState
      },
    })
  }
}

export { StateSafePureComponent }
export default StateSafePureComponent
