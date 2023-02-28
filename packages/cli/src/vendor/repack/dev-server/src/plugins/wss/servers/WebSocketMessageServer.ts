import type { IncomingMessage } from 'http'
import { URL } from 'url'

import type { FastifyInstance } from 'fastify'
import WebSocket from 'ws'

import { WebSocketServer } from '../WebSocketServer'

/**
 * Holds {@link ReactNativeMessage} `id` data.
 */
export interface ReactNativeIdObject {
  requestId: string
  clientId: string
}

/**
 * Message representation used by {@link WebSocketMessageServer}.
 */
export interface ReactNativeMessage {
  version?: string
  id?: ReactNativeIdObject
  method?: string
  target: string
  result?: any
  error?: Error
  params?: Record<string, any>
}

type WebSocketWithUpgradeReq = WebSocket & { upgradeReq?: IncomingMessage }

/**
 * Class for creating a WebSocket server and sending messages between development server
 * and the React Native applications.
 *
 * Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/messageSocketServer.ts
 *
 * @category Development server
 */
export class WebSocketMessageServer extends WebSocketServer {
  static readonly PROTOCOL_VERSION = 2

  /**
   * Check if message is a broadcast request.
   *
   * @param message Message to check.
   * @returns True if message is a broadcast request and should be broadcasted
   * with {@link sendBroadcast}.
   */
  static isBroadcast(message: Partial<ReactNativeMessage>) {
    return (
      typeof message.method === 'string' &&
      message.id === undefined &&
      message.target === undefined
    )
  }

  /**
   * Check if message is a method request.
   *
   * @param message Message to check.
   * @returns True if message is a request.
   */
  static isRequest(message: Partial<ReactNativeMessage>) {
    return typeof message.method === 'string' && typeof message.target === 'string'
  }

  /**
   * Check if message is a response with results of performing some request.
   *
   * @param message Message to check.
   * @returns True if message is a response.
   */
  static isResponse(message: Partial<ReactNativeMessage>) {
    return (
      typeof message.id === 'object' &&
      typeof message.id.requestId !== 'undefined' &&
      typeof message.id.clientId === 'string' &&
      (message.result !== undefined || message.error !== undefined)
    )
  }

  private clients = new Map<string, WebSocketWithUpgradeReq>()
  private nextClientId = 0

  /**
   * Create new instance of WebSocketMessageServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   */
  constructor(fastify: FastifyInstance) {
    super(fastify, '/message')
  }

  /**
   * Parse stringified message into a {@link ReactNativeMessage}.
   *
   * @param data Stringified message.
   * @param binary Additional binary data if any.
   * @returns Parsed message or `undefined` if parsing failed.
   */
  parseMessage(data: string, binary: any): Partial<ReactNativeMessage> | undefined {
    if (binary) {
      this.fastify.log.error({
        msg: 'Failed to parse message - expected text message, got binary',
      })
      return undefined
    }
    try {
      const message = JSON.parse(data) as Partial<ReactNativeMessage>
      if (message.version === WebSocketMessageServer.PROTOCOL_VERSION.toString()) {
        return message
      }
      this.fastify.log.error({
        msg: 'Received message had wrong protocol version',
        message,
      })
    } catch (e) {
      this.fastify.log.error({
        msg: 'Failed to parse the message as JSON',
        data,
      })
    }
    return undefined
  }

  /**
   * Get client's WebSocket connection for given `clientId`.
   * Throws if no such client is connected.
   *
   * @param clientId Id of the client.
   * @returns WebSocket connection.
   */
  getClientSocket(clientId: string) {
    const socket = this.clients.get(clientId)
    if (socket === undefined) {
      throw new Error(`Could not find client with id "${clientId}"`)
    }
    return socket
  }

  /**
   * Process error by sending an error message to the client whose message caused the error
   * to occur.
   *
   * @param clientId Id of the client whose message caused an error.
   * @param message Original message which caused the error.
   * @param error Concrete instance of an error that occurred.
   */
  handleError(clientId: string, message: Partial<ReactNativeMessage>, error: Error) {
    const errorMessage = {
      id: message.id,
      method: message.method,
      target: message.target,
      error: message.error === undefined ? 'undefined' : 'defined',
      params: message.params === undefined ? 'undefined' : 'defined',
      result: message.result === undefined ? 'undefined' : 'defined',
    }

    if (message.id === undefined) {
      this.fastify.log.error({
        msg: 'Handling message failed',
        clientId,
        error,
        errorMessage,
      })
    } else {
      try {
        const socket = this.getClientSocket(clientId)
        socket.send(
          JSON.stringify({
            version: WebSocketMessageServer.PROTOCOL_VERSION,
            error,
            id: message.id,
          })
        )
      } catch (error) {
        this.fastify.log.error('Failed to reply', {
          clientId,
          error,
          errorMessage,
        })
      }
    }
  }

  /**
   * Send given request `message` to it's designated client's socket based on `message.target`.
   * The target client must be connected, otherwise it will throw an error.
   *
   * @param clientId Id of the client that requested the forward.
   * @param message Message to forward.
   */
  forwardRequest(clientId: string, message: Partial<ReactNativeMessage>) {
    if (!message.target) {
      this.fastify.log.error({
        msg: 'Failed to forward request - message.target is missing',
        clientId,
        message,
      })
      return
    }

    const socket = this.getClientSocket(message.target)
    socket.send(
      JSON.stringify({
        version: WebSocketMessageServer.PROTOCOL_VERSION,
        method: message.method,
        params: message.params,
        id: message.id === undefined ? undefined : { requestId: message.id, clientId },
      })
    )
  }

  /**
   * Send given response `message` to it's designated client's socket based
   * on `message.id.clientId`.
   * The target client must be connected, otherwise it will throw an error.
   *
   * @param message Message to forward.
   */
  forwardResponse(message: Partial<ReactNativeMessage>) {
    if (!message.id) {
      return
    }

    const socket = this.getClientSocket(message.id.clientId)
    socket.send(
      JSON.stringify({
        version: WebSocketMessageServer.PROTOCOL_VERSION,
        result: message.result,
        error: message.error,
        id: message.id.requestId,
      })
    )
  }

  /**
   * Process request message targeted towards this {@link WebSocketMessageServer}
   * and send back the results.
   *
   * @param clientId Id of the client who send the message.
   * @param message The message to process by the server.
   */
  processServerRequest(clientId: string, message: Partial<ReactNativeMessage>) {
    let result: string | Record<string, Record<string, string>>

    switch (message.method) {
      case 'getid':
        result = clientId
        break
      case 'getpeers': {
        const output: Record<string, Record<string, string>> = {}
        this.clients.forEach((peerSocket, peerId) => {
          if (clientId !== peerId) {
            const { searchParams } = new URL(peerSocket.upgradeReq?.url || '')
            output[peerId] = [...searchParams.entries()].reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: value,
              }),
              {}
            )
          }
        })
        result = output
        break
      }
      default:
        throw new Error(
          `Cannot process server request - unknown method ${JSON.stringify({
            clientId,
            message,
          })}`
        )
    }

    const socket = this.getClientSocket(clientId)
    socket.send(
      JSON.stringify({
        version: WebSocketMessageServer.PROTOCOL_VERSION,
        result,
        id: message.id,
      })
    )
  }

  /**
   * Broadcast given message to all connected clients.
   *
   * @param broadcasterId Id of the client who is broadcasting.
   * @param message Message to broadcast.
   */
  sendBroadcast(broadcasterId: string | undefined, message: Partial<ReactNativeMessage>) {
    const forwarded = {
      version: WebSocketMessageServer.PROTOCOL_VERSION,
      method: message.method,
      params: message.params,
    }

    if (this.clients.size === 0) {
      this.fastify.log.warn({
        msg:
          'No apps connected. ' +
          `Sending "${message.method}" to all React Native apps failed. ` +
          'Make sure your app is running in the simulator or on a phone connected via USB.',
      })
    }

    for (const [clientId, socket] of this.clients) {
      if (clientId !== broadcasterId) {
        try {
          socket.send(JSON.stringify(forwarded))
        } catch (error) {
          this.fastify.log.error({
            msg: 'Failed to send broadcast',
            clientId,
            error,
            forwarded,
          })
        }
      }
    }
  }

  /**
   * Send method broadcast to all connected clients.
   *
   * @param method Method name to broadcast.
   * @param params Method parameters.
   */
  broadcast(method: string, params?: Record<string, any>) {
    this.sendBroadcast(undefined, { method, params })
  }

  /**
   * Process new client's WebSocket connection.
   *
   * @param socket Incoming WebSocket connection.
   * @param request Upgrade request for the connection.
   */
  onConnection(socket: WebSocket, request: IncomingMessage) {
    const clientId = `client#${this.nextClientId++}`
    let client: WebSocketWithUpgradeReq = socket
    client.upgradeReq = request
    this.clients.set(clientId, client)
    this.fastify.log.debug({ msg: 'Message client connected', clientId })

    const onClose = () => {
      this.fastify.log.debug({ msg: 'Message client disconnected', clientId })
      socket.removeAllListeners()
      this.clients.delete(clientId)
    }

    socket.addEventListener('error', onClose)
    socket.addEventListener('close', onClose)
    socket.addEventListener('message', (event) => {
      const message = this.parseMessage(
        event.data.toString(),
        // @ts-ignore
        event.binary
      )

      if (!message) {
        this.fastify.log.error({
          msg: 'Received message not matching protocol',
          clientId,
          message,
        })
        return
      }

      try {
        if (WebSocketMessageServer.isBroadcast(message)) {
          this.sendBroadcast(clientId, message)
        } else if (WebSocketMessageServer.isRequest(message)) {
          if (message.target === 'server') {
            this.processServerRequest(clientId, message)
          } else {
            this.forwardRequest(clientId, message)
          }
        } else if (WebSocketMessageServer.isResponse(message)) {
          this.forwardResponse(message)
        } else {
          throw new Error(
            `Invalid message, did not match the protocol ${JSON.stringify({
              clientId,
              message,
            })}`
          )
        }
      } catch (error) {
        this.handleError(clientId, message, error as Error)
      }
    })
  }
}
