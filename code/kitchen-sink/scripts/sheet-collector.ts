/**
 * Telemetry collector for sheet frame/gesture tracking.
 *
 * The instrumented SheetWebKeyboardCase fixture (loaded with ?track=1) POSTs
 * batches of samples here — frame positions, touch events, focus, onLayout — all
 * on one monotonic timeline. We append them to a JSONL file on disk so the run
 * on the real iOS sim can be analyzed precisely out-of-browser (no video).
 *
 *   bun scripts/sheet-collector.ts            # writes /tmp/sheet-frames/frames.jsonl
 *
 * Endpoints (CORS-open; POST uses text/plain so there's no preflight):
 *   POST /collect   body = JSON array of samples -> appended
 *   GET  /reset     truncate the file (call before a run)
 *   GET  /dump      return the file
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const DIR = '/tmp/sheet-frames'
const FILE = `${DIR}/frames.jsonl`
const PORT = Number(process.env.COLLECTOR_PORT || 7980)

mkdirSync(DIR, { recursive: true })
writeFileSync(FILE, '')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (url.pathname === '/reset') {
      writeFileSync(FILE, '')
      return new Response('reset', { headers: cors })
    }
    if (url.pathname === '/dump') {
      let body = ''
      try {
        body = readFileSync(FILE, 'utf8')
      } catch {}
      return new Response(body, { headers: { ...cors, 'content-type': 'text/plain' } })
    }
    if (url.pathname === '/collect' && req.method === 'POST') {
      const text = await req.text()
      try {
        const arr = JSON.parse(text) as unknown[]
        if (Array.isArray(arr) && arr.length) {
          appendFileSync(FILE, arr.map((s) => JSON.stringify(s)).join('\n') + '\n')
        }
      } catch (e) {
        return new Response('bad-json', { status: 400, headers: cors })
      }
      return new Response('ok', { headers: cors })
    }
    return new Response('na', { status: 404, headers: cors })
  },
})

console.info(`[sheet-collector] listening on :${PORT} -> ${FILE}`)
