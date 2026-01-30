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
    if (props.prefetch) {
      // Query all 'a' and 'button' elements at the root of the document
      const elements = document.querySelectorAll('a, button')
      const disposes = Array.from(elements).map((element) => {
        const listener = () => {
          setShow(true)
        }
        element.addEventListener('mouseenter', listener)
        return () => {
          element.removeEventListener('mouseenter', listener)
        }
      })

      return () => {
        disposes.forEach((_) => _())
      }
    }
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
