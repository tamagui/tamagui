import { useEffect, useState } from 'react'

export function useIsScrolled(scrollView: HTMLElement) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!scrollView) return
    const onScroll = () => {
      setIsScrolled(scrollView.scrollTop > 30)
    }
    scrollView.addEventListener('scroll', onScroll)
    return () => {
      scrollView.removeEventListener('scroll', onScroll)
    }
  }, [scrollView])

  return isScrolled
}
