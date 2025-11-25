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

export const LoadCherryBomb = ({ prefetch }: { prefetch?: boolean }) => (
  <LoadFont
    prefetch={prefetch || false}
    woff2File="/fonts/cherry-bomb.woff2"
    cssFile="/fonts/cherry-bomb.css"
  />
)
