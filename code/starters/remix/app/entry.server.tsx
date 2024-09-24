import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import Tamagui from '../tamagui.config'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    try {
      const tamaguiCSS = Tamagui.getCSS()
      let markup = renderToString(
        <RemixServer context={remixContext} url={request.url} />
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
