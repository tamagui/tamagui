import { UNWRAP_PROXY } from './constants'
import { shouldDebug } from './useStoreDebug'

export const TRIGGER_UPDATE = Symbol()
export const ADD_TRACKER = Symbol()
export const TRACK = Symbol()
export const SHOULD_DEBUG = Symbol()

export type StoreTracker = {
  isTracking: boolean
  tracked: Set<string>
  dispose: () => void
  component?: any
  firstRun: boolean
  last?: any
  lastKeys?: any
}

export const disableTracking = new WeakMap()

export const setDisableStoreTracking = (storeInstance: any, val: boolean) => {
  const store = storeInstance[UNWRAP_PROXY] ?? storeInstance
  disableTracking.set(store, val)
}

export class Store<Props extends Object = {}> {
  private _listeners = new Set<Function>()
  private _trackers = new Set<StoreTracker>()
  _version = 0

  constructor(public props: Props) {}

  subscribe = (onChanged: Function) => {
    this._listeners.add(onChanged)
    return () => {
      this._listeners.delete(onChanged)
    }
  };

  [TRIGGER_UPDATE]() {
    this._version = (this._version + 1) % Number.MAX_SAFE_INTEGER
    // this can't be wholesale...
    // startTransition(() => {
    for (const cb of this._listeners) {
      if (typeof cb !== 'function') {
        console.error('error', cb, this._listeners)
        continue
      }
      cb()
    }
    // })
  }

  [ADD_TRACKER](tracker: StoreTracker) {
    this._trackers.add(tracker)
    return () => {
      this._trackers.delete(tracker)
    }
  }

  [TRACK](key: string, debug?: boolean) {
    if (key[0] === '_' || key[0] === '$' || key === 'props' || key === 'toJSON') {
      return
    }
    if (debug) {
      console.log('(debug) CHECK TRACKERS FOR', key)
    }
    for (const tracker of this._trackers) {
      if (tracker.isTracking) {
        tracker.tracked.add(key)
        if (debug) {
          console.log('(debug) TRACK', key, tracker)
        }
      }
    }
  }

  [SHOULD_DEBUG]() {
    const info = { storeInstance: this }
    return [...this._trackers].some(
      (tracker) => tracker.component && shouldDebug(tracker.component, info)
    )
  }
}
