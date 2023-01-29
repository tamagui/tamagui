import { IncomingMessage } from 'http'
import { URL } from 'url'

import { FastifyInstance } from 'fastify'
import WebSocket from 'ws'

import { HmrDelegate } from '../types'
import { WebSocketServer } from '../WebSocketServer'

/**
 * Class for creating a WebSocket server for Hot Module Replacement.
 *
 * @category Development server
 */
export class WebSocketHMRServer extends WebSocketServer {
  private clients = new Map<{ clientId: string; platform: string }, WebSocket>()
  private nextClientId = 0

  /**
   * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   * @param delegate HMR delegate instance.
   */
  constructor(fastify: FastifyInstance, private delegate: HmrDelegate) {
    super(fastify, delegate.getUriPath())
  }

  /**
   * Send action to all connected HMR clients.
   *
   * @param event Event to send to the clients.
   * @param platform Platform of clients to send the event to.
   * @param clientIds Ids of clients who should receive the event.
   */
  send(event: any, platform: string, clientIds?: string[]) {
    const data = typeof event === 'string' ? event : JSON.stringify(event)

    for (const [key, socket] of this.clients) {
      if (
        key.platform !== platform ||
        !(clientIds ?? [key.clientId]).includes(key.clientId)
      ) {
        return
      }

      try {
        socket.send(data)
      } catch (error) {
        this.fastify.log.error({
          msg: 'Cannot send action to client',
          event,
          error,
          ...key,
        })
      }
    }
  }

  /**
   * Process new WebSocket connection from HMR client.
   *
   * @param socket Incoming HMR client's WebSocket connection.
   */
  onConnection(socket: WebSocket, request: IncomingMessage) {
    const { searchParams } = new URL(request.url || '', 'http://localhost')
    const platform = searchParams.get('platform')

    if (!platform) {
      this.fastify.log.info({
        msg: 'HMR connection disconnected - missing platform',
      })
      socket.close()
      return
    }

    const clientId = `client#${this.nextClientId++}`
    this.clients.set({ clientId, platform }, socket)

    this.fastify.log.info({ msg: 'HMR client connected', clientId, platform })

    const onClose = () => {
      this.fastify.log.info({
        msg: 'HMR client disconnected',
        clientId,
        platform,
      })
      this.clients.delete({ clientId, platform })
    }

    socket.addEventListener('error', onClose)
    socket.addEventListener('close', onClose)

    this.delegate.onClientConnected(platform, clientId)
  }
}
