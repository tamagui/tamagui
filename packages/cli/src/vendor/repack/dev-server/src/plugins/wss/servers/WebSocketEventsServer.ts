import type { FastifyInstance } from 'fastify'
import * as prettyFormat from 'pretty-format'
import WebSocket from 'ws'

import { WebSocketServer } from '../WebSocketServer'
import { WebSocketMessageServer } from './WebSocketMessageServer'

/**
 * {@link WebSocketEventsServer} configuration options.
 */
export interface WebSocketEventsServerConfig {
  /** Instance of a {@link WebSocketMessageServer} which can be used for broadcasting. */
  webSocketMessageServer: WebSocketMessageServer
}

/**
 * Represents a command that connected clients can send to the {@link WebSocketEventsServer}.
 */
export interface Command {
  version: number
  type: 'command'
  command: string
  params?: any
}

/**
 * Represents an event message.
 */
export interface EventMessage {
  error?: Error | string
  type?: string
  data?: any
}

/**
 * Class for creating a WebSocket server to process events and reports.
 *
 * Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/eventsSocketServer.ts
 *
 * @category Development server
 */
export class WebSocketEventsServer extends WebSocketServer {
  static readonly PROTOCOL_VERSION = 2

  private clients = new Map<string, WebSocket>()
  private nextClientId = 0

  /**
   * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   * @param config Configuration object.
   */
  constructor(fastify: FastifyInstance, private config: WebSocketEventsServerConfig) {
    super(fastify, '/events', {
      verifyClient: (({ origin }) => {
        return /^(https?:\/\/localhost|file:\/\/)/.test(origin)
      }) as WebSocket.VerifyClientCallbackSync,
    })
  }

  /**
   * Parse received command message from connected client.
   *
   * @param data Stringified command message to parse.
   * @returns Parsed command or `undefined` if parsing failed.
   */
  parseMessage(data: string): Command | undefined {
    try {
      const message = JSON.parse(data)
      if (message.version === WebSocketEventsServer.PROTOCOL_VERSION) {
        return message
      }
      this.fastify.log.error({
        msg: 'Received message had wrong protocol version',
        message,
      })
    } catch {
      this.fastify.log.error({
        msg: 'Failed to parse the message as JSON',
        data,
      })
    }

    return undefined
  }

  /**
   * Stringify `message` into a format that can be transported as a `string`.
   *
   * @param message Message to serialize.
   * @returns String representation of a `message` or `undefined` if serialization failed.
   */
  serializeMessage(message: EventMessage) {
    let toSerialize = message
    if (message.error && message.error instanceof Error) {
      toSerialize = {
        ...message,
        error: prettyFormat.default(message.error, {
          escapeString: true,
          highlight: true,
          maxDepth: 3,
          min: true,
        }),
      }
    } else if (message && message.type === 'client_log') {
      toSerialize = {
        ...message,
        data: message.data.map((item: any) =>
          typeof item === 'string'
            ? item
            : prettyFormat.default(item, {
                escapeString: true,
                highlight: true,
                maxDepth: 3,
                min: true,
                plugins: [prettyFormat.plugins.ReactElement],
              })
        ),
      }
    }
    try {
      return JSON.stringify(toSerialize)
    } catch (error) {
      this.fastify.log.error({ msg: 'Failed to serialize', error })
      return undefined
    }
  }

  /**
   * Broadcast event to all connected clients.
   *
   * @param event Event message to broadcast.
   */
  broadcastEvent(event: EventMessage) {
    if (!this.clients.size) {
      return
    }

    const serialized = this.serializeMessage(event)
    if (!serialized) {
      return
    }

    for (const [clientId, socket] of this.clients.entries()) {
      try {
        socket.send(serialized)
      } catch (error) {
        this.fastify.log.error({
          msg: 'Failed to send broadcast to client',
          clientId,
          error,
          _skipBroadcast: true,
        })
      }
    }
  }

  /**
   * Process new client's WebSocket connection.
   *
   * @param socket Incoming WebSocket connection.
   */
  onConnection(socket: WebSocket) {
    const clientId = `client#${this.nextClientId++}`
    this.clients.set(clientId, socket)
    this.fastify.log.debug({ msg: 'Events client connected', clientId })

    const onClose = () => {
      this.fastify.log.debug({ msg: 'Events client disconnected', clientId })
      socket.removeAllListeners()
      this.clients.delete(clientId)
    }

    socket.addEventListener('error', onClose)
    socket.addEventListener('close', onClose)
    socket.addEventListener('message', (event) => {
      const message = this.parseMessage(event.data.toString())

      if (!message) {
        return
      }

      if (message.type === 'command') {
        try {
          this.config.webSocketMessageServer.broadcast(message.command, message.params)
        } catch (error) {
          this.fastify.log.error({
            msg: 'Failed to forward message to clients',
            error,
          })
        }
      } else {
        this.fastify.log.error({
          msg: 'Unknown message type',
          message,
        })
      }
    })
  }
}
