import { Subscription } from '@unimodules/core'
import mediaQuery from 'css-mediaquery'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Dimensions } from 'react-native'

type Listener = (context: MediaQueryList) => any

/**
 * A pseudo implementation of MediaQueryList
 * https://www.w3.org/TR/css3-mediaqueries/
 */
export default class MediaQueryList /* extends MediaQueryList */ {
  private listeners: Listener[] = []

  private orientation: ScreenOrientation.Orientation =
    ScreenOrientation.Orientation.PORTRAIT_UP

  private unsubscribe: Subscription | null = null

  constructor(private query: string) {
    ;(async () => {
      try {
        const orientation = await ScreenOrientation.getOrientationAsync()
        this.updateListeners({ orientation })
      } catch (_) {}
    })()
    try {
      this.unsubscribe = ScreenOrientation.addOrientationChangeListener(
        ({ orientationInfo: { orientation } }) => {
          this.updateListeners({ orientation })
        }
      )
    } catch (err) {
      console.log('error listening for updates :(')
    }
    Dimensions.addEventListener('change', this.resize)
  }

  private resize = () => {
    this.updateListeners({ orientation: this.orientation })
  }

  // TODO: find an automatic interface for unmounting
  _unmount() {
    this.unsubscribe?.remove()
    Dimensions.removeEventListener('change', this.resize)
  }

  public addListener(listener: Listener) {
    this.listeners.push(listener)
  }

  public removeListener(listener: Listener) {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) this.listeners.splice(index, 1)
  }

  public get matches(): boolean {
    const windowDimensions = Dimensions.get('window')
    return mediaQuery.match(this.query, {
      type: 'screen',
      orientation:
        this.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        this.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? 'landscape'
          : 'portrait',
      ...windowDimensions,
      'device-width': windowDimensions.width,
      'device-height': windowDimensions.height,
    })
  }

  private updateListeners({ orientation }) {
    this.orientation = orientation
    this.listeners.forEach((listener) => {
      listener(this)
    })
  }
}

export const matchMedia = (query: string) => new MediaQueryList(query)
