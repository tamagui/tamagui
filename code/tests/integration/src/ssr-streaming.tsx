import { renderToPipeableStream } from 'react-dom/server'

import { StreamingRoot } from './StreamingRoot'

/**
 * Streams the app into a response.
 *
 * `onShellReady` rather than `onAllReady` is the whole point: the shell goes
 * out as soon as it can render, and the suspended boundary follows later on the
 * same response. Buffering to `onAllReady` would produce a byte-identical
 * document and prove nothing about streaming, which is why the test asserts the
 * late content is *absent* while the shell is already painted.
 */
export function renderStream(onShellReady: () => void) {
  const stream = renderToPipeableStream(<StreamingRoot />, { onShellReady })
  return stream
}
