/**
 * Sticksy.js
 * A library for making cool things like fixed widgets.
 * Dependency-free. ES5 code.
 * -
 * @version 0.2.0
 * @url https://github.com/kovart/sticksy
 * @author Artem Kovalchuk <kovart.dev@gmail.com>
 * @license The MIT License (MIT)
 */

const States = {
  STATIC: 'static',
  FIXED: 'fixed',
  STUCK: 'stuck',
}

/**
 * Constructor function for Sticksy
 * @param {(string|Element)} target Sticky element or query
 * @param {Object=} options Options object
 * @param {boolean=} options.listen Listen for DOM changes in the container
 * @param {boolean=} options.enabled Should the element be sticky immediately
 * @param {number=} options.topSpacing Top indent when element has 'fixed' state
 * @constructor
 */
export function Sticksy(target, options) {
  if (!target) throw new Error('You have to specify the target element')
  if (typeof target !== 'string' && !(target instanceof Element))
    throw new Error(
      'Expected a string or element, but got: ' + Object.prototype.toString.call(target)
    )
  const targetEl = Utils.findElement(target)
  if (!targetEl) throw new Error('Cannot find target element: ' + target)
  const containerEl = targetEl.parentNode
  if (!containerEl) throw new Error('Cannot find container of target element: ' + target)

  options = options || {}

  this._props = {
    containerEl: containerEl,
    targetEl: targetEl,
    topSpacing: options.topSpacing || 0,
    enabled: options.enabled || true,
    listen: options.listen || false, // listen for the DOM changes in the container
  }

  /**
   * Called when state of sticky element has changed
   * @type {Function|null} Callback
   */
  this.onStateChanged = null

  /**
   * DOM Element reference of sticky element
   * @type {Element} nodeRef
   */
  this.nodeRef = targetEl

  this._initialize()
}

// Static variables
Sticksy.instances = []
Sticksy.enabledInstances = []

Sticksy.prototype._initialize = function () {
  // default state
  this.state = States.STATIC

  this._stickyNodes = []
  // Since sticky nodes may have a fixed position,
  // the library injects cloned (dummy) nodes to avoid problems with a DOM flow
  this._dummyNodes = []
  // Sticky element makes lower elements sticky also
  let sibling = this._props.targetEl

  while (sibling) {
    const clone = sibling.cloneNode(true)
    clone.style.visibility = 'hidden'
    clone.style.pointerEvents = 'none'
    clone.className += ' sticksy-dummy-node'
    clone.removeAttribute('id')
    this._props.targetEl.parentNode.insertBefore(clone, this._props.targetEl)

    this._stickyNodes.push(sibling)
    this._dummyNodes.push(clone)
    sibling = sibling.nextElementSibling
  }

  // Used when we calc the state of elements
  this._stickyNodesHeight = 0

  // Positions of the scroll when the elements are fixed (sticky)
  this._limits = {
    top: 0,
    bottom: 0,
  }

  // MutationObserver state
  this._isListening = false

  // The library uses 'position: absolute' to stuck sticky nodes to the bottom of the container
  this._props.containerEl.style.position = 'relative'
  // Flexbox doesn't collapse margin of items
  this._shouldCollapseMargins =
    getComputedStyle(this._props.containerEl).display.indexOf('flex') === -1

  // Listen for DOM changes in the container
  if (this._props.listen) {
    this._mutationObserver = new MutationObserver(() => {
      this.hardRefresh()
    })

    this._startListen()
  }

  Sticksy.instances.push(this)
  if (this._props.enabled) {
    Sticksy.enabledInstances.push(this)
  }

  this.hardRefresh()
}

Sticksy.prototype._startListen = function () {
  if (!this._props.listen || this._isListening) return
  this._mutationObserver.observe(this._props.containerEl, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  })
  this._isListening = true
}

Sticksy.prototype._stopListen = function () {
  if (!this._props.listen || !this._isListening) return
  this._mutationObserver.disconnect()
  this._isListening = false
}

Sticksy.prototype._calcState = function (windowOffset) {
  if (windowOffset < this._limits.top) {
    return States.STATIC
  } else if (windowOffset >= this._limits.bottom) {
    return States.STUCK
  }
  return States.FIXED
}

Sticksy.prototype._updateStickyNodesHeight = function () {
  this._stickyNodesHeight =
    Utils.getComputedBox(this._stickyNodes[this._stickyNodes.length - 1])
      .bottomWithMargin - Utils.getComputedBox(this._stickyNodes[0]).topWithMargin
}

Sticksy.prototype._updateLimits = function () {
  const containerEl = this._props.containerEl
  const stickyNodes = this._stickyNodes

  const containerBox = Utils.getComputedBox(containerEl)
  const topNodeBox = Utils.getComputedBox(stickyNodes[0])

  this._limits = {
    top: topNodeBox.topWithMargin - this._props.topSpacing,
    bottom:
      containerBox.bottom -
      containerBox.paddingBottom -
      this._props.topSpacing -
      this._stickyNodesHeight,
  }
}

Sticksy.prototype._applyState = function (state) {
  // We enable dummy nodes at the end
  // to avoid 'scrolling down effect' in Chrome
  if (state === States.STATIC) {
    this._resetElements(this._stickyNodes)
    this._disableElements(this._dummyNodes)
  } else {
    this._fixElementsSize(this._stickyNodes)
    if (state === States.FIXED) {
      this._fixElements(this._stickyNodes)
    } else {
      this._stuckElements(this._stickyNodes)
    }
    this._enableElements(this._dummyNodes)
  }
}

/**
 * Recalculate the position
 * @public
 */
Sticksy.prototype.refresh = function () {
  const state = this._calcState(window.pageYOffset, this._limits)
  if (state === this.state) return

  this.state = state

  this._stopListen()
  this._applyState(state)
  this._startListen()

  if (typeof this.onStateChanged === 'function') {
    this.onStateChanged(state)
  }
}

/**
 * Reset, recalculate and then update the position
 * @public
 */
Sticksy.prototype.hardRefresh = function () {
  this._stopListen()
  const oldState = this.state
  // reset state for recalculation
  this.state = States.STATIC
  this._applyState(this.state)
  this._fixElementsSize(this._stickyNodes)
  this._updateStickyNodesHeight()
  this._updateLimits()
  this.state = this._calcState(window.pageYOffset, this._limits)
  this._applyState(this.state)
  this._startListen()

  if (typeof this.onStateChanged === 'function' && oldState !== this.state) {
    this.onStateChanged(this.state)
  }
}

/**
 * Enable 'sticky' effect
 * @public
 */
Sticksy.prototype.enable = function () {
  this._props.enabled = true
  Sticksy.enabledInstances.push(this)
  this.hardRefresh()
}

/**
 * Disable 'sticky' effect
 * @public
 */
Sticksy.prototype.disable = function () {
  this._props.enabled = false
  this.state = States.STATIC
  this._applyState(this.state)

  Sticksy.enabledInstances.splice(Sticksy.enabledInstances.indexOf(this), 1)
}

/* --------------------------
 *  Operations with elements
 * -------------------------- */

Sticksy.prototype._fixElements = function (elements) {
  let previousMarginBottom = 0 // for margins collapse
  let offset = this._props.topSpacing
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    const box = Utils.getComputedBox(el)
    const extraMarginTop = this._shouldCollapseMargins
      ? Math.max(0, previousMarginBottom - box.marginTop)
      : previousMarginBottom
    el.style.position = 'fixed'
    el.style.top = offset + extraMarginTop + 'px'
    el.style.bottom = ''
    offset += box.height + box.marginTop + extraMarginTop
    previousMarginBottom = box.marginBottom
  }
}

Sticksy.prototype._stuckElements = function (elements) {
  let previousMarginTop = 0 // for margins collapse
  // we add offset because the container padding doesn't affect on absolute position
  let offset = Utils.getComputedBox(this._props.containerEl).paddingBottom
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i]
    const box = Utils.getComputedBox(el)
    const extraMarginBottom = this._shouldCollapseMargins
      ? Math.max(0, previousMarginTop - box.marginBottom)
      : previousMarginTop
    el.style.position = 'absolute'
    el.style.top = 'auto'
    el.style.bottom = offset + extraMarginBottom + 'px'
    offset += box.height + box.marginBottom + extraMarginBottom
    previousMarginTop = box.marginTop
  }
}

Sticksy.prototype._resetElements = (elements) => {
  elements.forEach((el) => {
    el.style.position = ''
    el.style.top = ''
    el.style.bottom = ''
    el.style.height = ''
    el.style.width = ''
  })
}

Sticksy.prototype._disableElements = (elements) => {
  elements.forEach((el) => {
    el.style.display = 'none'
  })
}

Sticksy.prototype._enableElements = function (elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = getComputedStyle(this._stickyNodes[i]).display
  }
}

Sticksy.prototype._fixElementsSize = function () {
  for (let i = 0; i < this._stickyNodes.length; i++) {
    const stickyNode = this._stickyNodes[i]
    const style = getComputedStyle(stickyNode)
    stickyNode.style.width = style.width
    stickyNode.style.height = style.height
  }
}

/* ------------------------
 *  Static methods
 * ------------------------ */

Sticksy.refreshAll = () => {
  for (let i = 0; i < Sticksy.enabledInstances.length; i++) {
    Sticksy.enabledInstances[i].refresh()
  }
}

Sticksy.hardRefreshAll = () => {
  for (let i = 0; i < Sticksy.enabledInstances.length; i++) {
    Sticksy.enabledInstances[i].hardRefresh()
  }
}

Sticksy.enableAll = function () {
  Sticksy.enabledInstances = Sticksy.instances.slice()
  this.hardRefreshAll()
}

Sticksy.disableAll = () => {
  const copy = Sticksy.enabledInstances.slice()
  for (let i = 0; i < copy.length; i++) {
    Sticksy.enabledInstances[i].disable()
  }
  Sticksy.enabledInstances = []
}

/**
 * Initialize all sticky elements
 * @param {string|Element|Element[]|jQuery} target - Query string, DOM elements or JQuery object
 * @param {{topSpacing: number=, listen: boolean=}=} options - Constructor options
 * @param {boolean=} ignoreNothingFound - Don't throw an error if there are no elements that satisfying selector.
 * @returns {(Sticksy)[]}
 */
Sticksy.initializeAll = (target, options, ignoreNothingFound) => {
  if (typeof target === 'undefined') throw new Error("'target' parameter is undefined")

  let elements = []
  if (target instanceof Element) {
    elements = [target]
  } else if (
    typeof target.length !== 'undefined' &&
    target.length > 0 &&
    target[0] instanceof Element
  ) {
    // check if JQuery object and fetch native DOM elements
    elements = typeof target.get === 'function' ? target.get() : target
  } else if (typeof target === 'string') {
    elements = document.querySelectorAll(target) || []
  }

  // There may be situations when we have several sticky elements in one parent
  // To resolve this situation we take only the first element
  const parents = []
  const stickyElements = []
  elements.forEach((el) => {
    if (parents.indexOf(el.parentNode) !== -1) return
    parents.push(el.parentNode)
    stickyElements.push(el)
  })

  if (!ignoreNothingFound && !stickyElements.length)
    throw new Error('There are no elements to initialize')

  return stickyElements.map((el) => new Sticksy(el, options))
}

/* ------------------------
 *  Refresh events
 * ------------------------ */

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', Sticksy.refreshAll)
  window.addEventListener('resize', Sticksy.hardRefreshAll)
}

/* ------------------------
 *  Helpers
 * ------------------------ */

const Utils = {
  parseNumber: (val) => Number.parseFloat(val) || 0,
  findElement: (el, root) => {
    if (!root) root = document
    return 'string' === typeof el
      ? root.querySelector(el)
      : el instanceof Element
        ? el
        : undefined
  },
  getComputedBox: (elem) => {
    const box = elem.getBoundingClientRect()
    const style = getComputedStyle(elem)

    return {
      height: box.height,
      width: box.width,
      top: window.pageYOffset + box.top,
      bottom: window.pageYOffset + box.bottom,
      marginTop: Utils.parseNumber(style.marginTop),
      marginBottom: Utils.parseNumber(style.marginBottom),
      paddingTop: Utils.parseNumber(style.paddingTop),
      paddingBottom: Utils.parseNumber(style.paddingBottom),
      topWithMargin: window.pageYOffset + box.top - Utils.parseNumber(style.marginTop),
      bottomWithMargin:
        window.pageYOffset + box.bottom + Utils.parseNumber(style.marginBottom),
    }
  },
}
