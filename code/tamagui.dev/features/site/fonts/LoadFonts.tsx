import { createContext, useContext, useEffect, useState } from 'react'
import { isClient } from 'tamagui'

const FontLoadedContext = createContext(false)

export const useFontLoaded = (fontFamily: string) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isClient) return

    // check if already loaded
    if (document.fonts.check(`16px "${fontFamily}"`)) {
      setLoaded(true)
      return
    }

    // wait for font to load
    document.fonts.ready.then(() => {
      if (document.fonts.check(`16px "${fontFamily}"`)) {
        setLoaded(true)
      }
    })

    // also listen for load event
    const onFontLoad = () => {
      if (document.fonts.check(`16px "${fontFamily}"`)) {
        setLoaded(true)
      }
    }
    document.fonts.addEventListener('loadingdone', onFontLoad)
    return () => {
      document.fonts.removeEventListener('loadingdone', onFontLoad)
    }
  }, [fontFamily])

  return loaded
}

export const useCherryBombLoaded = () => useContext(FontLoadedContext)

export function LoadFont(props: {
  cssFile?: string
  woff2File?: string
  prefetch?: boolean
}) {
  const [show, setShow] = useState(!props.prefetch)

  useEffect(() => {
    if (!props.prefetch) return
    // one-time warm on the first user interaction anywhere on the page (touch +
    // mouse + keyboard), so the font is already loading by the time the user
    // navigates to a page that uses it, without an eager preload that
    // Lighthouse dings for being unused on the current page.
    const events = ['pointerdown', 'touchstart', 'keydown', 'mouseover'] as const
    const removeAll = () => {
      for (const e of events) document.removeEventListener(e, reveal, true)
    }
    // function decl so removeAll (defined above) can reference it; on the first
    // trigger we unregister ALL the listeners, not just the one that fired.
    function reveal() {
      removeAll()
      setShow(true)
    }
    for (const e of events) {
      document.addEventListener(e, reveal, { passive: true, capture: true })
    }
    return removeAll
  }, [props.prefetch])

  return (
    <>
      {show && props.cssFile && (
        <link crossOrigin="anonymous" href={props.cssFile} rel="stylesheet" />
      )}
      {show && props.woff2File && (
        <link
          crossOrigin="anonymous"
          rel="preload"
          href={props.woff2File}
          as="font"
          type="font/woff2"
        />
      )}
    </>
  )
}

export const LoadCherryBomb = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch || false}
    woff2File="/fonts/cherry-bomb.woff2"
    cssFile="/fonts/cherry-bomb.css"
  />
)

export const CherryBombFontProvider = ({ children }: { children: React.ReactNode }) => {
  const loaded = useFontLoaded('Cherry Bomb')
  return (
    <FontLoadedContext.Provider value={loaded}>{children}</FontLoadedContext.Provider>
  )
}
