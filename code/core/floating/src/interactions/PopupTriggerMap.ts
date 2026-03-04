// tracks trigger elements for multi-trigger tooltip/popover patterns.
// when multiple triggers share a single floating element (scoped pattern),
// this lets useHover check if the cursor moved to a sibling trigger
// and suppress the close.

export class PopupTriggerMap {
  private map = new Map<string, Element>()
  private elements = new Set<Element>()

  add(id: string, element: Element) {
    const prev = this.map.get(id)
    if (prev) {
      this.elements.delete(prev)
    }
    this.map.set(id, element)
    this.elements.add(element)
  }

  delete(id: string) {
    const el = this.map.get(id)
    if (el) {
      this.elements.delete(el)
      this.map.delete(id)
    }
  }

  hasElement(element: Element): boolean {
    return this.elements.has(element)
  }
}
