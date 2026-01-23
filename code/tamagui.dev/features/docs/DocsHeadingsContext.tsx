import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Heading } from './DocsQuickNav'

const DocsHeadingsContext = createContext<{
  headings: Heading[]
  setHeadings: (headings: Heading[]) => void
}>({
  headings: [],
  setHeadings: () => {},
})

export function DocsHeadingsProvider({ children }: { children: ReactNode }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  return (
    <DocsHeadingsContext.Provider value={{ headings, setHeadings }}>
      {children}
    </DocsHeadingsContext.Provider>
  )
}

export function useDocsHeadings() {
  return useContext(DocsHeadingsContext).headings
}

// component that pages use to set headings
export function SetDocsHeadings({ headings }: { headings?: Heading[] }) {
  const { setHeadings } = useContext(DocsHeadingsContext)

  useEffect(() => {
    if (headings) {
      setHeadings(headings)
    }
    return () => setHeadings([])
  }, [headings, setHeadings])

  return null
}
