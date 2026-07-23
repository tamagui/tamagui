import { getDocsSection } from '@tamagui/logo'
import { usePathname, useRouter } from 'one'
import React, { startTransition, useEffect } from 'react'
import { getCanonicalDocsPath } from './docsVersion'
import { allNotPending } from './docsRoutes'

export const useDocsMenu = () => {
  const [open, setOpen] = React.useState<boolean | 'press'>(false)
  const pathname = usePathname()
  const router = useRouter()
  const canonicalPath = getCanonicalDocsPath(pathname)
  const versionedComponentPath = canonicalPath.match(
    /^(\/ui\/[^/]+)\/(\d+\.\d+\.\d+(?:-[^/]+)?)$/
  )
  const currentPath = versionedComponentPath?.[1] ?? canonicalPath
  const documentVersion = versionedComponentPath?.[2] ?? ''

  const documentVersionPath = documentVersion ? `/${documentVersion}` : ''
  const currentPageIndex = allNotPending.findIndex((page) => page.route === currentPath)
  const previous = allNotPending[currentPageIndex - 1]
  let nextIndex = currentPageIndex + 1
  let next = allNotPending[nextIndex]
  while (next && next.route.startsWith('http')) {
    next = allNotPending[++nextIndex]
  }

  const section = getDocsSection(currentPath)

  // on route change close menu
  useEffect(() => {
    return router.subscribe(() => {
      startTransition(() => {
        setOpen(false)
      })
    })
  }, [])

  return {
    open,
    pathname,
    setOpen,
    currentPath,
    next,
    previous,
    documentVersionPath,
    section,
  }
}
