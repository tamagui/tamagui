import { useEffect, useState } from 'react'

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

export const LoadSilkscreen = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch}
    woff2File="/fonts/slkscr.woff2"
    cssFile="/fonts/silkscreen.css"
  />
)

export const LoadInter400 = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch}
    woff2File="/fonts/Inter-Regular.woff2"
    cssFile="/fonts/inter-400.css"
  />
)

export const LoadInter700 = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch}
    woff2File="/fonts/Inter-ExtraBold.woff2"
    cssFile="/fonts/inter-700.css"
  />
)

export const LoadInter900 = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch}
    woff2File="/fonts/Inter-Black.woff2"
    cssFile="/fonts/inter-900.css"
  />
)

export const LoadMunro = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch}
    woff2File="/fonts/munro.woff2"
    cssFile="/fonts/munro.css"
  />
)

export const LoadCherryBomb = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch}
    woff2File="/fonts/cherry-bomb.woff2"
    cssFile="/fonts/cherry-bomb.css"
  />
)
