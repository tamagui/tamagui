// for vite dev mode

const stylesheets: Record<string, HTMLElement> = {}

interface InjectStylesOptions {
  filePath: string
  css: string
}

export const injectStyles = ({ filePath, css }: InjectStylesOptions) => {
  let stylesheet = stylesheets[filePath]
  if (!stylesheet) {
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-file', filePath)
    styleEl.setAttribute('type', 'text/css')
    stylesheet = stylesheets[filePath] = styleEl
    document.head.appendChild(styleEl)
  }
  stylesheet.innerHTML = css
}
