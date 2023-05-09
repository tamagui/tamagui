export function LoadFont(props: { cssFile?: string; woff2File?: string }) {
  return (
    <>
      {props.cssFile && <link href={props.cssFile} rel="stylesheet" />}
      {props.woff2File && (
        <link rel="preload" href={props.woff2File} as="font" type="font/woff2" />
      )}
    </>
  )
}

export const LoadInter900 = () => (
  <LoadFont
    woff2File="/fonts/subset-Inter-Black.woff2"
    cssFile="/fonts/inter-takeout.css"
  />
)

export const LoadGlusp = () => (
  <LoadFont woff2File="/fonts/glusp.woff2" cssFile="/fonts/glusp.css" />
)

export const LoadMunro = () => (
  <LoadFont woff2File="/fonts/munro.woff2" cssFile="/fonts/munro.css" />
)
