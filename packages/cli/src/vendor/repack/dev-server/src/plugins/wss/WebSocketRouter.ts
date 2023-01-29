import type { IncomingMessage } from 'http'
import type { Socket } from 'net'

import type { FastifyInstance } from 'fastify'

import { WebSocketServer } from './WebSocketServer'

/**
 * Class for creating a WebSocket router to forward connections to the
 * respective {@link WebSocketServer} as long as the connection is accepted for the upgrade by the
 * server.
 *
 * If the connection is not accepted by any `WebSocketServer`, it will be destroyed to avoid
 * creating handling connections and potentially throwing `ECONNRESET` errors.
 *
 * @category Development server
 */
export class WebSocketRouter {
  /** The list of all register WebSocket servers. */
  protected servers: WebSocketServer[] = []

  /**
   * Create new instance of `WebSocketRouter` and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket router to.
   */
  constructor(private fastify: FastifyInstance) {
    this.fastify.server.on(
      'upgrade',
      (request: IncomingMessage, socket: Socket, head: Buffer) => {
        const { pathname } = new URL(request.url || '', 'http://localhost')
        let matched = false

        console.log('check for upgrade', pathname)

        for (const server of this.servers) {
          if (server.shouldUpgrade(pathname)) {
            matched = true
            server.upgrade(request, socket, head)
            break
          }
        }

        if (!matched) {
          this.fastify.log.debug({
            msg: 'Destroying socket connection as no server was matched',
            pathname,
          })
          socket.destroy()
        }
      }
    )
  }

  /**
   * Register a new {@link WebSocketServer}. New connection will now
   * check if the given server will accept them and forward them.
   *
   * @param server WebSocket server to register.
   * @returns The same instance of the WebSocket server after it's been registered.
   */
  registerServer<T extends WebSocketServer>(server: T): T {
    this.servers.push(server)
    return server
  }
}
