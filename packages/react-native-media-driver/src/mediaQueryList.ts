import type { MediaQueryList } from '@tamagui/web'
import { Dimensions } from 'react-native'

import { matchQuery } from './matchQuery'

type Orientation = 'landscape' | 'portrait'

type Listener = (orientation: Orientation) => void

export class NativeMediaQueryList implements MediaQueryList {
  private listeners: Listener[] = []

  private get orientation(): Orientation {
    const windowDimensions = Dimensions.get('window')
    return windowDimensions.height > windowDimensions.width ? 'portrait' : 'landscape'
  }

  constructor(private query: string) {
    this.notify()
    Dimensions.addEventListener('change', () => {
      this.notify()
    })
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener(this.orientation)
    })
  }

  addListener(listener: Listener) {
    this.listeners.push(listener)
  }

  removeListener(listener: Listener) {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) this.listeners.splice(index, 1)
  }

  match(query: string, { width, height }: { width: number; height: number }) {
    return matchQuery(query, {
      type: 'screen',
      orientation: height > width ? 'portrait' : 'landscape',
      'device-width': width,
      'device-height': height,
    })
  }

  get matches(): boolean {
    const windowDimensions = Dimensions.get('window')
    const matches = matchQuery(this.query, {
      type: 'screen',
      orientation: this.orientation,
      ...windowDimensions,
      'device-width': windowDimensions.width,
      'device-height': windowDimensions.height,
    })
    return matches
  }
}
