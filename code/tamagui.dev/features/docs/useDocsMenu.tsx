import React, { startTransition, useEffect } from 'react'

import { allNotPending } from './docsRoutes'
import { usePathname, useRouter } from 'one'

export const useDocsMenu = () => {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  let currentPath = pathname
  let documentVersion = ''

  // if (Array.isArray(router.query.slug)) {
  //   currentPath = currentPath.replace('[...slug]', router.query.slug[0])
  //   documentVersion = router.query.slug[1]
  // } else {
  //   currentPath = currentPath.replace('[slug]', router.query.slug as string)
  // }

  const documentVersionPath = documentVersion ? `/${documentVersion}` : ''
  const currentPageIndex = allNotPending.findIndex((page) => page.route === currentPath)
  const previous = allNotPending[currentPageIndex - 1]
  let nextIndex = currentPageIndex + 1
  let next = allNotPending[nextIndex]
  while (next && next.route.startsWith('http')) {
    next = allNotPending[++nextIndex]
  }

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
    setOpen,
    currentPath,
    next,
    previous,
    documentVersionPath,
  }
}
