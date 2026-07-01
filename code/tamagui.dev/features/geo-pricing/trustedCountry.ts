import { timingSafeEqual } from 'node:crypto'

// Only trust Cloudflare's CF-IPCountry header when the request is proven to have
// transited Cloudflare.
//
// CF-IPCountry is set by Cloudflare's edge, but the Railway origin is directly
// reachable, so a client that hits the origin URL directly can send any
// CF-IPCountry value it wants. Trusting it on the *charge* path let an authed
// user spoof CF-IPCountry: VE (a deep-discount tier) and buy the $250 license
// for ~$37.
//
// Fix: a Cloudflare Transform Rule (or Worker) adds a request header
//   X-Origin-Secret: <CF_ORIGIN_SECRET>
// to every request it proxies. A direct origin hit can't produce it, so it can't
// spoof the country. If CF_ORIGIN_SECRET isn't configured we can't prove transit,
// so we fail safe to no discount (full price). The secret is read via dynamic
// process.env access so the server build can't inline it (see api/serverEnv.ts).
export function getTrustedCountryCode(req: Request): string | null {
  const expected = process.env['CF_ORIGIN_SECRET']
  if (!expected) return null

  const provided = req.headers.get('x-origin-secret')
  if (!provided) return null

  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  return req.headers.get('CF-IPCountry')
}
