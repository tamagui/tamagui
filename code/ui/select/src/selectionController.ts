import type { ReactNode } from 'react'

export type SelectMode = 'single' | 'multiple'
export type SelectSelection = string | string[]

export type SelectRegisteredItem = {
  id: symbol
  value: string
  disabled: boolean
  textValue?: string
  label?: ReactNode
}

export type SelectItemRegistration = {
  id: symbol
  update(item: Partial<Omit<SelectRegisteredItem, 'id'>>): void
  setNode(node: unknown): void
  unregister(): void
}

export type SelectItemRegistry = ReturnType<typeof createSelectItemRegistry>

export function getSelectLabelText(label: ReactNode): string {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label)
  }
  if (Array.isArray(label)) {
    return label.map(getSelectLabelText).join('')
  }
  if (label && typeof label === 'object' && 'props' in label) {
    return getSelectLabelText((label as any).props?.children)
  }
  return ''
}

export function createSelectItemRegistry(onChange?: () => void) {
  const items: SelectRegisteredItem[] = []
  const labelRegistrations = new Map<
    string,
    Map<symbol, { label: ReactNode; textValue?: string }>
  >()
  const explicitTextValues = new Map<symbol, string | undefined>()
  const itemNodes = new Map<symbol, any>()
  const listeners = new Set<() => void>()

  const notify = () => {
    onChange?.()
    listeners.forEach((listener) => listener())
  }

  const getItems = () => items

  const getItem = (value: string) => items.find((item) => item.value === value)

  const getIndex = (value: string) => items.findIndex((item) => item.value === value)

  const getRegisteredLabel = (value: string) => {
    const registrations = labelRegistrations.get(value)
    if (!registrations?.size) return undefined
    const values = Array.from(registrations.values())
    return values[values.length - 1]
  }

  const applyRegisteredLabel = (value: string) => {
    const registeredLabel = getRegisteredLabel(value)
    let changed = false
    for (const item of items) {
      if (item.value !== value) continue
      const nextLabel = registeredLabel?.label
      const nextTextValue = explicitTextValues.get(item.id) || registeredLabel?.textValue
      if (item.label !== nextLabel || item.textValue !== nextTextValue) {
        item.label = nextLabel
        item.textValue = nextTextValue
        changed = true
      }
    }
    if (changed) notify()
  }

  const syncNodeOrder = () => {
    const previousOrder = items.map((item) => item.id)
    items.sort((a, b) => {
      const aNode = itemNodes.get(a.id)
      const bNode = itemNodes.get(b.id)
      if (!aNode || !bNode || typeof aNode.compareDocumentPosition !== 'function') {
        return 0
      }
      const position = aNode.compareDocumentPosition(bNode)
      if (position & 4) return -1
      if (position & 2) return 1
      return 0
    })
    if (items.some((item, index) => item.id !== previousOrder[index])) {
      notify()
    }
  }

  const registerItem = (
    item: Omit<SelectRegisteredItem, 'id'>
  ): SelectItemRegistration => {
    const id = Symbol(item.value)
    const registeredLabel = getRegisteredLabel(item.value)
    const registeredItem: SelectRegisteredItem = {
      ...item,
      ...registeredLabel,
      textValue: item.textValue ?? registeredLabel?.textValue,
      id,
    }
    explicitTextValues.set(id, item.textValue)
    items.push(registeredItem)
    notify()

    return {
      id,
      update(next) {
        const index = items.findIndex((current) => current.id === id)
        if (index < 0) return
        const current = items[index]
        if ('textValue' in next) {
          explicitTextValues.set(id, next.textValue)
        }
        const nextItem = { ...current, ...next }
        if (next.value !== undefined && next.value !== current.value) {
          const nextLabel = getRegisteredLabel(next.value)
          nextItem.label = nextLabel?.label
        }
        const explicitTextValue = explicitTextValues.get(id)
        nextItem.textValue =
          explicitTextValue ||
          getSelectLabelText(nextItem.label) ||
          (nextItem.label ? nextItem.value : undefined)
        const changed = Object.entries(next).some(
          ([key, value]) => current[key as keyof SelectRegisteredItem] !== value
        )
        const textValueChanged = current.textValue !== nextItem.textValue
        if (!changed && !textValueChanged) return
        items[index] = nextItem
        notify()
      },
      setNode(node) {
        if (node) {
          itemNodes.set(id, node)
          syncNodeOrder()
        } else {
          itemNodes.delete(id)
        }
      },
      unregister() {
        const index = items.findIndex((current) => current.id === id)
        if (index < 0) return
        items.splice(index, 1)
        explicitTextValues.delete(id)
        itemNodes.delete(id)
        notify()
      },
    }
  }

  const registerLabel = (value: string, label: ReactNode, textValue?: string) => {
    const id = Symbol(value)
    const normalizedTextValue = textValue || getSelectLabelText(label) || value
    const registrations =
      labelRegistrations.get(value) ??
      (() => {
        const next = new Map<symbol, { label: ReactNode; textValue?: string }>()
        labelRegistrations.set(value, next)
        return next
      })()
    registrations.set(id, { label, textValue: normalizedTextValue })
    applyRegisteredLabel(value)

    return () => {
      registrations.delete(id)
      if (!registrations.size) {
        labelRegistrations.delete(value)
      }
      applyRegisteredLabel(value)
    }
  }

  const firstEnabledIndex = () => items.findIndex((item) => !item.disabled)

  const nextEnabledIndex = (fromIndex: number | null, direction: 1 | -1) => {
    if (!items.length) return -1
    if (fromIndex == null || fromIndex < 0 || fromIndex >= items.length) {
      if (direction === 1) return firstEnabledIndex()
      for (let index = items.length - 1; index >= 0; index--) {
        if (!items[index].disabled) return index
      }
      return -1
    }
    for (let offset = 1; offset <= items.length; offset++) {
      const index = (fromIndex + direction * offset + items.length) % items.length
      if (!items[index]?.disabled) return index
    }
    return -1
  }

  const findTypeaheadIndex = (search: string, fromIndex: number | null) => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    if (!normalizedSearch) return -1
    const start = fromIndex == null || fromIndex < 0 ? -1 : fromIndex
    for (let offset = 1; offset <= items.length; offset++) {
      const index = (start + offset) % items.length
      const item = items[index]
      const label = item.textValue || getSelectLabelText(item.label) || item.value
      if (!item.disabled && label.toLocaleLowerCase().startsWith(normalizedSearch)) {
        return index
      }
    }
    return -1
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    registerItem,
    registerLabel,
    getItems,
    getItem,
    getIndex,
    firstEnabledIndex,
    nextEnabledIndex,
    findTypeaheadIndex,
    getDisabledIndices: () =>
      items.flatMap((item, index) => (item.disabled ? [index] : [])),
    getTypeaheadLabels: () =>
      items.map((item) => item.textValue || getSelectLabelText(item.label) || item.value),
  }
}

export function normalizeSelectSelection(
  mode: SelectMode,
  value: SelectSelection | undefined
): SelectSelection {
  if (mode === 'single') {
    return typeof value === 'string' ? value : ''
  }
  const values = Array.isArray(value) ? value : []
  return [...new Set(values)]
}

export function selectedValuesFromSelection(
  mode: SelectMode,
  value: SelectSelection | undefined
): string[] {
  const normalized = normalizeSelectSelection(mode, value)
  return mode === 'multiple'
    ? (normalized as string[])
    : normalized
      ? [normalized as string]
      : []
}

export function createSelectSelectionController({
  mode: initialMode,
  value: initialValue,
  registry,
}: {
  mode: SelectMode
  value: SelectSelection
  registry: SelectItemRegistry
}) {
  let mode = initialMode
  let value = normalizeSelectSelection(mode, initialValue)
  let activeIndex: number | null = null

  const selectedValues = () => selectedValuesFromSelection(mode, value)

  const setMode = (nextMode: SelectMode) => {
    if (mode === nextMode) return value
    mode = nextMode
    value = normalizeSelectSelection(mode, value)
    return value
  }

  const setValue = (nextValue: SelectSelection) => {
    value = normalizeSelectSelection(mode, nextValue)
    return value
  }

  const isSelected = (itemValue: string) => selectedValues().includes(itemValue)

  const toggle = (itemValue: string) => {
    const item = registry.getItem(itemValue)
    if (!item || item.disabled) return value
    if (mode === 'single') {
      value = itemValue
      return value
    }
    const current = selectedValues()
    value = current.includes(itemValue)
      ? current.filter((currentValue) => currentValue !== itemValue)
      : [...current, itemValue]
    return value
  }

  const selectionAnchor = () => {
    const values = selectedValues()
    for (let index = values.length - 1; index >= 0; index--) {
      const item = registry.getItem(values[index])
      if (item) return item
    }
    const firstEnabledIndex = registry.firstEnabledIndex()
    return firstEnabledIndex < 0 ? undefined : registry.getItems()[firstEnabledIndex]
  }

  const selectionAnchorIndex = () => {
    const anchor = selectionAnchor()
    return anchor ? registry.getIndex(anchor.value) : -1
  }

  const initialActiveIndex = () => {
    const anchorIndex = selectionAnchorIndex()
    const anchor = anchorIndex < 0 ? undefined : registry.getItems()[anchorIndex]
    return anchor && !anchor.disabled ? anchorIndex : registry.firstEnabledIndex()
  }

  const moveActive = (direction: 1 | -1) => {
    const nextIndex = registry.nextEnabledIndex(activeIndex, direction)
    activeIndex = nextIndex < 0 ? null : nextIndex
    return activeIndex == null ? undefined : registry.getItems()[activeIndex]
  }

  return {
    registry,
    get mode() {
      return mode
    },
    get value() {
      return value
    },
    get activeIndex() {
      return activeIndex
    },
    get activeItem() {
      return activeIndex == null ? undefined : registry.getItems()[activeIndex]
    },
    get shouldCloseOnSelect() {
      return mode === 'single'
    },
    setMode,
    setValue,
    isSelected,
    toggle,
    selectionAnchor,
    selectionAnchorIndex,
    initialActiveIndex,
    setActiveIndex(index: number | null) {
      activeIndex = index
    },
    moveActive,
  }
}

export function getSelectListboxProps(mode: SelectMode) {
  return {
    role: 'listbox' as const,
    'aria-multiselectable': mode === 'multiple' ? true : undefined,
  }
}

export function getSelectOptionProps(
  mode: SelectMode,
  selected: boolean,
  disabled: boolean,
  platform: 'web' | 'native'
) {
  if (platform === 'native') {
    return {
      accessibilityRole:
        mode === 'multiple' ? ('checkbox' as const) : ('button' as const),
      accessibilityState: {
        selected: mode === 'single' ? selected : undefined,
        checked: mode === 'multiple' ? selected : undefined,
        disabled,
      },
    }
  }
  return {
    role: 'option' as const,
    'aria-selected': selected,
    'aria-disabled': disabled || undefined,
  }
}
