import { useEffect, useRef } from 'react'

/**
 * Will memo items of the list based on getItemMemoKey.
 * If you have a sensitive performance list, you can use this to memo individual
 * items.
 *
 * @param items Input items, can be anything.
 * @param getItemMemoKey For each item, return a comparison array, like React effect args
 * @param getItem Map the items to anything you want
 * @param mountArgs Optional arguments if you want to change the getItemMemoKey
 */

export function useMemoList<T, R>({
  items,
  getItem,
  getItemMemoKey,
  mountArgs,
}: {
  items: T[]
  getItemMemoKey: (item: T, index: number) => any
  getItem: (item: T, index: number) => R
  mountArgs?: any[]
}): (T | R)[] {
  const state = useRef<{ items: (T | R)[]; keys: any[] }>({
    items: [],
    keys: [],
  })
  const update = () => {
    for (const [index, item] of items.entries()) {
      const key = getItemMemoKey(item, index)
      const curKey = state.current.keys[index]
      if (!curKey || curKey !== key) {
        state.current.keys[index] = key
        state.current.items[index] = getItem ? getItem(item, index) : item
      }
    }
  }

  useEffect(() => {
    state.current = { items: [], keys: [] }
    update()
  }, mountArgs || [])

  // update every call so it acts like a memo
  update()

  return state.current.items
}
