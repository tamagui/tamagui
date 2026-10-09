import { createReadStream, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { PassThrough } from 'node:stream'

/**
 * A streaming SSR server for the program block fixture.
 *
 * It exists because nothing else in the repo drives a genuinely chunked
 * response into a browser. The document goes out in three parts: everything
 * before the root element, then React's output as it becomes available, then
 * the tail. The middle part is what arrives late, and a test can watch the gap.
 */

const dist = path.resolve('dist')
const port = Number(process.argv[2] || 5012)
const { renderStream } = await import(process.argv[3])

const document = readFileSync(path.join(dist, 'streaming.html'), 'utf8')
const marker = '<div id="root"></div>'
if (!document.includes(marker)) throw new Error('streaming.html lost its root element')
const [head, tail] = document.split(marker)

const types = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
}

createServer((req, res) => {
  const url = (req.url || '/').split('?')[0]

  if (url !== '/') {
    const file = path.join(dist, url)
    if (!file.startsWith(dist)) {
      res.writeHead(403).end()
      return
    }
    // resolve the file before writing any headers: writing 200 first and then
    // discovering the file is missing leaves nothing to say 404 with, and
    // throws ERR_HTTP_HEADERS_SENT out of the stream's error handler, which
    // takes the whole server down mid-suite
    let readable
    try {
      statSync(file)
      readable = createReadStream(file)
    } catch {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'text/plain' })
    readable.pipe(res)
    return
  }

  // no-store because a cached or buffered body is a body that is no longer
  // chunked, which would defeat the test without failing it
  res.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' })

  const body = new PassThrough()
  body.pipe(res, { end: false })
  body.on('end', () => {
    res.write(`</div>${tail}`)
    res.end()
  })

  const stream = renderStream(() => {
    res.write(`${head}<div id="root">`)
    stream.pipe(body)
  })
  // a browser that navigates away mid-stream closes the response; abort only
  // then, or React logs an aborted render for every completed page
  res.on('close', () => {
    if (!res.writableEnded) stream.abort()
  })
}).listen(port, () => console.info(`streaming fixture on http://localhost:${port}`))
