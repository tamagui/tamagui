import type { FastifyInstance } from 'fastify'
import WebSocket from 'ws'

import { WebSocketServer } from '../WebSocketServer'

/**
 * Class for creating a WebSocket server for communication with React Native clients.
 * All client logs - logs from React Native application - are processed here.
 *
 * @category Development server
 */
export class WebSocketDevClientServer extends WebSocketServer {
  private clients = new Map<string, WebSocket>()
  private nextClientId = 0

  /**
   * Create new instance of WebSocketDevClientServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   */
  constructor(fastify: FastifyInstance) {
    super(fastify, '/__client')
  }

  /**
   * Process client message.
   *
   * @param message Stringified client message.
   */
  processMessage(message: string) {
    const { type, ...body } = JSON.parse(message)
    switch (type) {
      case 'client-log':
        if (body.level === 'error') {
          this.fastify.log.error({ issuer: 'Console', msg: body.data })
        } else if (body.level === 'warn') {
          this.fastify.log.warn({ issuer: 'Console', msg: body.data })
        } else {
          this.fastify.log.info({ issuer: 'Console', msg: body.data })
        }
        break
      default:
        this.fastify.log.warn({ msg: 'Unknown client message', message })
    }
  }

  /**
   * Process new WebSocket connection from client application.
   *
   * @param socket Incoming client's WebSocket connection.
   */
  onConnection(socket: WebSocket) {
    const clientId = `client#${this.nextClientId++}`
    this.clients.set(clientId, socket)

    this.fastify.log.info({ msg: 'React Native client connected', clientId })
    this.clients.set(clientId, socket)

    const onClose = () => {
      this.fastify.log.info({
        msg: 'React Native client disconnected',
        clientId,
      })
      this.clients.delete(clientId)
    }

    socket.addEventListener('error', onClose)
    socket.addEventListener('close', onClose)
    socket.addEventListener('message', (event) => {
      this.processMessage(event.data.toString())
    })
  }
}
