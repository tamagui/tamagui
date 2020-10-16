import React, { useEffect, useRef } from 'react'

export const useLazyEffect: typeof React.useEffect = (cb, dep) => {
  const initializeRef = useRef(false)
  useEffect((...args) => {
    if (initializeRef.current) {
      cb(...args)
    } else {
      initializeRef.current = true
    }
  }, dep)
}
