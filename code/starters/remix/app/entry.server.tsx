import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import tamaguiConfig from '../tamagui.config'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    try {
      const tamaguiCSS = tamaguiConfig.getCSS()
      let markup = renderToString(
        <ServerRouter context={routerContext} url={request.url} />
      )
      markup = markup.replace(
        '</head>',
        `<style id="tamagui">${tamaguiCSS}</style></head>`
      )

      responseHeaders.set('Content-Type', 'text/html')

      resolve(
        new Response('<!DOCTYPE html>' + markup, {
          headers: responseHeaders,
          status: responseStatusCode,
        })
      )
    } catch (error) {
      reject(error)
    }
  })
}
