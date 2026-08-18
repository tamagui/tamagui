// Serves the Metro web fixture: the entry HTML, the zero bundle, and the
// published CSS artifact and island bundles.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const port = Number(process.env.PORT || 7880)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
}

function resolveFile(urlPath) {
  if (urlPath === '/' || urlPath === '/index.html') return path.join(root, 'metro.html')
  if (urlPath === '/main.js') return path.join(root, 'dist-metro/main.js')
  return path.join(root, 'public-metro', urlPath.replace(/^\//, ''))
}

createServer((request, response) => {
  const file = resolveFile(new URL(request.url, 'http://localhost').pathname)
  if (!existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404)
    response.end('not found')
    return
  }
  response.writeHead(200, {
    'content-type': types[path.extname(file)] ?? 'application/octet-stream',
  })
  createReadStream(file).pipe(response)
}).listen(port, () => {
  console.info(`metro fixture on http://localhost:${port}`)
})
