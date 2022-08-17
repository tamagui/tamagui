import moduleEntry from './worker.js'

interface FetchEvent extends Event {
  readonly request: Request
  respondWith(promise: Response | Promise<Response>): void
  passThroughOnException(): void
  waitUntil(promise: Promise<any>): void
}

// @ts-ignore
addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(moduleEntry.fetch(event.request, globalThis, event))
)
