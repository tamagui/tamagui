import { useMemo, useState } from 'react'

export function LoadFont(props: { cssFile?: string; woff2File?: string }) {
  const [loads, setLoads] = useState(0)

  const [finish, promise] = (() => {
    let finish
    return [
      finish,
      new Promise((_) => {
        finish = _
      }),
    ]
  })()

  const handleLoad = () => {
    console.log('loading', loads)
    if (loads === 1) {
      finish()
    } else {
      setLoads(loads + 1)
    }
  }

  if (loads < 2) {
    throw promise
  }

  return (
    <>
      {props.cssFile && (
        <link
          onLoad={handleLoad}
          crossOrigin="anonymous"
          href={props.cssFile}
          rel="stylesheet"
        />
      )}
      {props.woff2File && (
        <link
          onLoad={handleLoad}
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

export const LoadSilkscreen = () => (
  <LoadFont woff2File="/fonts/slkscr.woff2" cssFile="/fonts/silkscreen.css" />
)

export const LoadInter400 = () => (
  <LoadFont woff2File="/fonts/Inter-Regular.woff2" cssFile="/fonts/inter-400.css" />
)

export const LoadInter700 = () => (
  <LoadFont woff2File="/fonts/Inter-ExtraBold.woff2" cssFile="/fonts/inter-700.css" />
)

export const LoadInter900 = () => (
  <LoadFont woff2File="/fonts/Inter-Black.woff2" cssFile="/fonts/inter-900.css" />
)

export const LoadGlusp = () => (
  <LoadFont woff2File="/fonts/glusp.woff2" cssFile="/fonts/glusp.css" />
)

export const LoadMunro = () => (
  <LoadFont woff2File="/fonts/munro.woff2" cssFile="/fonts/munro.css" />
)

export const LoadCherryBomb = () => (
  <LoadFont woff2File="/fonts/cherry-bomb.woff2" cssFile="/fonts/cherry-bomb.css" />
)
