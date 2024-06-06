import { useEffect, useRef, useState } from 'react'

export const useScrollObserver = ({ index, onIntersect }) => {
  const sectionRef = useRef(null)

  const [rootMargin, setRootMargin] = useState('0px 0px 0px 0px') // top, right, bottom, left

  useEffect(() => {
    const updateRootMargin = () => {
      setRootMargin(`0px 0px -${window.innerHeight * 0.8}px 0px`)
    }

    updateRootMargin()
    window.addEventListener('resize', updateRootMargin)

    return () => {
      window.removeEventListener('resize', updateRootMargin)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect(`${index}-${entry.target.id}`)
            window.history.pushState({}, '', `#${entry.target.id}`)
          }
        })
      },
      {
        rootMargin,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Clean up on unmount
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [rootMargin])

  return sectionRef
}
