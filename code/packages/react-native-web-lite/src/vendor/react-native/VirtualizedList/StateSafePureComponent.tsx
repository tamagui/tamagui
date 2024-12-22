// @ts-nocheck
import { invariant } from '@tamagui/react-native-web-internals'
import React from 'react'

/**
 * `setState` is called asynchronously, and should not rely on the value of
 * `this.props` or `this.state`:
 * https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
 *
 * SafePureComponent adds runtime enforcement, to catch cases where these
 * variables are read in a state updater function, instead of the ones passed
 * in.
 */
export default class StateSafePureComponent<Props, State> extends React.PureComponent<
  Props,
  State
> {
  private _inAsyncStateUpdate = false

  constructor(props: Props) {
    super(props)
    this._installSetStateHooks()
  }

  setState(
    partialState:
      | Partial<State>
      | ((state: State, props: Props) => Partial<State> | null)
      | null,
    callback?: () => void
  ): void {
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

  private _installSetStateHooks() {
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
      set(newProps: Props) {
        props = newProps
      },
    })
    Object.defineProperty(this, 'state', {
      get() {
        invariant(
          !that._inAsyncStateUpdate,
          '"this.state" should not be accessed during state updates'
        )
        return state
      },
      set(newState: State) {
        state = newState
      },
    })
  }
}
