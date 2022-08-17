export {
  renderToPipeableStream as ssrRenderToPipeableStream, // Only available in Node context
  renderToReadableStream as ssrRenderToReadableStream, // Only available in Browser/Worker context
} from 'react-dom/server'

// @ts-ignore
import { createFromReadableStream as _createFromReadableStream } from '@tamagui/unagi/vendor/react-server-dom-vite'
// @ts-ignore
import { renderToReadableStream as _rscRenderToReadableStream } from '@tamagui/unagi/vendor/react-server-dom-vite/writer.browser.server'

// From Flight flow types
type ServerContextJSONValue =
  | string
  | boolean
  | number
  | null
  | Readonly<ServerContextJSONValueCircular>
  | { [key: string]: ServerContextJSONValueCircular }

interface ServerContextJSONValueCircular extends Array<ServerContextJSONValue> {}

export const rscRenderToReadableStream = _rscRenderToReadableStream as (
  App: JSX.Element,
  options?: {
    onError?: (error: Error) => void
    context?: Array<[string, ServerContextJSONValue]>
    identifierPrefix?: string
  }
) => ReadableStream<Uint8Array>

export const createFromReadableStream = _createFromReadableStream as (
  rs: ReadableStream<Uint8Array>
) => {
  readRoot: () => JSX.Element
}

export async function bufferReadableStream(
  reader: ReadableStreamDefaultReader,
  cb?: (chunk: string) => void
) {
  const decoder = new TextDecoder()
  let result = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const stringValue = typeof value === 'string' ? value : decoder.decode(value)

    result += stringValue

    if (cb) {
      cb(stringValue)
    }
  }

  return result
}
