import { assetBasePath, handleRequest, indexTemplate, isAsset } from './virtual.js'

declare global {
  // eslint-disable-next-line no-var
  var globalThis: {
    Oxygen: { env: any }
    [key: string]: any
  }
}

export default {
  async fetch(
    request: Request,
    env: unknown,
    context: { waitUntil: (promise: Promise<any>) => void }
  ) {
    // Proxy assets to the CDN. This should be removed
    // once the proxy is implemented in Oxygen itself.
    const url = new URL(request.url)
    if (assetBasePath && isAsset(url.pathname)) {
      return fetch(request.url.replace(url.origin, assetBasePath), request)
    }

    if (!globalThis.Oxygen) {
      globalThis.Oxygen = { env }
    }

    try {
      return (await handleRequest(request, {
        indexTemplate,
        cache: await caches.open('oxygen'),
        context,
        buyerIpHeader: 'oxygen-buyer-ip',
      })) as Response
    } catch (error: any) {
      return new Response(error.message || error.toString(), { status: 500 })
    }
  },
}
