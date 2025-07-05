/**
 * 

Copyright (c) 2015 Gil Barbara

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

const canUseDOM = () =>
  typeof window !== 'undefined' && !!window.document && !!window.document.createElement

interface Options {
  authorizedInInputs: number[]
  disableKeys: boolean
  disableScroll: boolean
  disableWheel: boolean
  keyboardKeys: number[]
}

class DisableScroll {
  element: Element | null
  lockToScrollPos: [number, number]
  options: Options

  constructor() {
    this.element = null
    this.lockToScrollPos = [0, 0]
    this.options = {
      authorizedInInputs: [32, 37, 38, 39, 40],
      disableKeys: true,
      disableScroll: true,
      disableWheel: true,
      keyboardKeys: [32, 33, 34, 35, 36, 37, 38, 39, 40],
      // space: 32, page up: 33, page down: 34, end: 35, home: 36
      // left: 37, up: 38, right: 39, down: 40
    }

    /* istanbul ignore else */
    if (canUseDOM()) {
      this.element = document.scrollingElement
    }
  }

  /**
   * Disable Page Scroll
   */
  on(element?: Element, options?: Partial<Options>) {
    if (!canUseDOM()) return

    this.element = element || this.element
    this.options = {
      ...this.options,
      ...options,
    }

    const { disableKeys, disableScroll, disableWheel } = this.options

    /* istanbul ignore else */
    if (disableWheel) {
      document.addEventListener('wheel', this.handleWheel, { passive: false })
      document.addEventListener('touchmove', this.handleWheel, { passive: false })
    }

    /* istanbul ignore else */
    if (disableScroll) {
      this.lockToScrollPos = [this.element?.scrollLeft ?? 0, this.element?.scrollTop ?? 0]
      document.addEventListener('scroll', this.handleScroll, { passive: false })
    }

    /* istanbul ignore else */
    if (disableKeys) {
      document.addEventListener('keydown', this.handleKeydown, { passive: false })
    }
  }

  /**
   * Re-enable page scrolls
   */
  off() {
    if (!canUseDOM()) return

    document.removeEventListener('wheel', this.handleWheel)
    document.removeEventListener('touchmove', this.handleWheel)
    document.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('keydown', this.handleKeydown)
  }

  handleWheel = (e: WheelEvent | TouchEvent) => {
    e.preventDefault()
  }

  handleScroll = () => {
    window.scrollTo(...this.lockToScrollPos)
  }

  handleKeydown = (e: KeyboardEvent) => {
    let keys = this.options.keyboardKeys

    /* istanbul ignore else */
    if (
      ['INPUT', 'TEXTAREA'].includes(
        (e.target as HTMLInputElement | HTMLTextAreaElement).tagName
      )
    ) {
      keys = keys.filter((key) => !this.options.authorizedInInputs.includes(key))
    }

    /* istanbul ignore else */
    if (keys.includes(e.keyCode)) {
      e.preventDefault()
    }
  }
}

export const disableScroll = new DisableScroll()
