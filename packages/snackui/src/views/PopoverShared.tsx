import { createContext } from 'react'

export const PopoverContext = createContext({
  id: 0,
})

export const popoverCloseCbs = new Set<Function>()
export const closeAllPopovers = () => {
  popoverCloseCbs.forEach((cb) => cb())
  popoverCloseCbs.clear()
}

const handleKeyDown = (e) => {
  if (e.keyCode == 27) {
    // esc
    if (popoverCloseCbs.size) {
      const [first] = [...popoverCloseCbs]
      first?.(false)
      popoverCloseCbs.delete(first)
      e.preventDefault()
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener?.('keydown', handleKeyDown)
}
