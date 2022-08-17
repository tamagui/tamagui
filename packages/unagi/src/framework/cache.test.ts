import { describe, expect, it, vi } from 'vitest'

import { InMemoryCache } from './cache'

describe('In-Memory Cache', () => {
  const clock = { timestamp: 0 }
  Date.now = vi.fn(() => clock.timestamp)

  const advanceTimeBy = (ms: number) => {
    clock.timestamp += ms
  }

  it('uses cache control header to persist', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')
    response.headers.set('cache-control', 'max-age=60')
    await cache.put(request, response)

    advanceTimeBy(59 * 1000)

    const cachedResponse = await cache.match(request)
    expect(cachedResponse).toBeDefined()
    expect(cachedResponse!.headers.get('cache-control')).toBe(response.headers.get('cache-control'))
    expect(cachedResponse!.headers.get('cache')).toBe('HIT')

    advanceTimeBy(2 * 1000)

    expect(await cache.match(request)).toBeUndefined()
  })

  it('supports stale-while-revalidate', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')
    response.headers.set('cache-control', 'max-age=10, stale-while-revalidate=60')
    await cache.put(request, response)

    advanceTimeBy(9 * 1000)

    let cachedResponse

    cachedResponse = await cache.match(request)
    expect(cachedResponse).toBeDefined()
    expect(cachedResponse!.headers.get('cache')).toBe('HIT')

    advanceTimeBy(2 * 1000)

    cachedResponse = await cache.match(request)
    expect(cachedResponse).toBeDefined()
    expect(cachedResponse!.headers.get('cache')).toBe('STALE')

    advanceTimeBy(60 * 1000)
    expect(await cache.match(request)).toBeUndefined()
  })

  it('supports deleting cache entries', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')
    response.headers.set('cache-control', 'max-age=10')
    await cache.put(request, response)

    advanceTimeBy(9 * 1000)

    const cachedResponse = await cache.match(request)
    expect(cachedResponse).toBeDefined()
    expect(cachedResponse!.headers.get('cache')).toBe('HIT')

    expect(await cache.delete(request)).toBeTruthy()

    expect(await cache.match(request)).toBeUndefined()
  })

  it('deletes entry when encountering cache MISS', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')
    response.headers.set('cache-control', 'max-age=10')
    cache.put(request, response)

    advanceTimeBy(11 * 1000)

    expect(await cache.match(request)).toBeUndefined()

    // Falsy indicates there was nothing to be deleted
    expect(await cache.delete(request)).toBeFalsy()
  })

  it('reads the body', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')
    await cache.put(request, response)

    const cachedResponse = await cache.match(request)
    expect(await cachedResponse!.text()).toBe('Hello World')
  })

  it('does not cache non-GET requests', async () => {
    const cache = new InMemoryCache()
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const request = new Request('https://tamagui.dev/', { method })
      const response = new Response('Hello World')

      await expect(cache.put(request, response)).rejects.toThrow(
        'Cannot cache response to non-GET request'
      )
    }
  })

  it('does not match non-GET requests', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')

    await cache.put(request, response)

    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const request = new Request('https://tamagui.dev/', { method })

      expect(await cache.match(request)).toBeUndefined()
    }
  })

  it('does not cache responses to a range request (status 206)', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/', {
      headers: { Range: 'bytes=0-10' },
    })
    const response = new Response('Hello World', { status: 206 })

    await expect(cache.put(request, response)).rejects.toThrow(
      'Cannot cache response to a range request'
    )
  })

  it('does not cache responses containing vary=* header', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World')
    response.headers.set('vary', '*')

    await expect(cache.put(request, response)).rejects.toThrow(
      `Cannot cache response with 'Vary: *' header.`
    )
  })

  it('stores the response status', async () => {
    const cache = new InMemoryCache()
    const request = new Request('https://tamagui.dev/')
    const response = new Response('Hello World', { status: 404 })
    await cache.put(request, response)

    const cachedResponse = await cache.match(request)
    expect(cachedResponse!.status).toBe(404)
  })
})
