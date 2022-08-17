import React from 'react'

import type { CachingStrategy } from '../../types.js'
import { CacheShort, generateCacheControlHeader } from '../Cache/strategies/index.js'
import Redirect from '../Redirect/Redirect.client.js'

export class UnagiResponse extends Response {
  private wait = false
  private cacheOptions: CachingStrategy = CacheShort()

  private proxy = Object.defineProperties(Object.create(null), {
    // Default values:
    status: { value: 200, writable: true },
    statusText: { value: '', writable: true },
  })

  // @ts-ignore
  public status: number
  // @ts-ignore
  public statusText: string

  constructor(...args: ConstructorParameters<typeof Response>) {
    super(...args)

    return new Proxy(this, {
      get: (target, key) => target.proxy[key] ?? Reflect.get(target, key),
      set: (target, key, value) =>
        Reflect.set(key in target.proxy ? target.proxy : target, key, value),
    })
  }

  /**
   * Buffer the current response until all queries have resolved,
   * and prevent it from streaming back early.
   */
  doNotStream() {
    this.wait = true
  }

  canStream() {
    return !this.wait
  }

  cache(options?: CachingStrategy) {
    if (options) {
      this.cacheOptions = options
    }

    return this.cacheOptions
  }

  get cacheControlHeader(): string {
    return generateCacheControlHeader(this.cacheOptions)
  }

  redirect(location: string, status = 307) {
    this.status = status
    this.headers.set('location', location)

    // in the case of an RSC request, instead render a client component that will redirect
    return React.createElement(Redirect, { to: location })
  }
}
