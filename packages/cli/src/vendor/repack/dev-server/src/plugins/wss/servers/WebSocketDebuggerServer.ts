import type { IncomingMessage } from 'http'

import type { FastifyInstance } from 'fastify'
import WebSocket from 'ws'

import { WebSocketServer } from '../WebSocketServer'

/**
 * Class for creating a WebSocket server and providing a bridge between
 * debugger UI (Remote JS debugger) and the running React Native application.
 *
 * React Native application (aka client) will send and receive messages from the debugger UI
 * which runs inside a browser.
 *
 * @category Development server
 */
export class WebSocketDebuggerServer extends WebSocketServer {
  /**
   * A WebSocket connection with the debugger UI.
   */
  private debuggerSocket: WebSocket | undefined

  /**
   * A WebSocket connection with the client (React Native app).
   */
  private clientSocket: WebSocket | undefined

  /**
   * Create new instance of WebSocketDebuggerServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   */
  constructor(fastify: FastifyInstance) {
    super(fastify, '/debugger-proxy')
  }

  /**
   * Check if debugger UI is connected to the WebSocketDebuggerServer.
   */
  isDebuggerConnected() {
    return Boolean(this.debuggerSocket)
  }

  /**
   * Send a message to a given WebSocket connection.
   *
   * @param socket WebSocket connection to send the message to.
   * @param message Message to send.
   */
  send(socket: WebSocket | undefined, message: string) {
    try {
      socket?.send(message)
    } catch (error) {
      this.fastify.log.warn({ msg: 'Failed to send data to socket', error })
    }
  }

  /**
   * Process new WebSocket connection. The upgrade request should contain `role` query param
   * for determining the type of the connection.
   *
   * @param socket Incoming WebSocket connection.
   * @param request Upgrade request for the connection.
   */
  onConnection(socket: WebSocket, request: IncomingMessage) {
    const { url = '' } = request
    if (url.indexOf('role=debugger') >= 0) {
      this.fastify.log.info({ msg: 'Chrome Remote JS debugger connected' })
      this.onDebuggerConnection(socket)
    } else if (url.indexOf('role=client') >= 0) {
      this.fastify.log.info({ msg: 'React Native app connected to debugger' })
      this.onClientConnection(socket)
    } else {
      socket.close(1011, 'Missing role param')
    }
  }

  /**
   * Process new WebSocket connection from Debugger UI (Remote JS Debugger).
   * If there's already open connection, the new one gets closed automatically.
   *
   * @param socket Incoming debugger WebSocket connection.
   */
  onDebuggerConnection(socket: WebSocket) {
    if (this.debuggerSocket) {
      socket.close(1011, 'Another debugger is already connected')
      return
    }
    this.debuggerSocket = socket
    const onClose = () => {
      this.fastify.log.info({ msg: 'Chrome Remote JS debugger disconnected' })
      this.debuggerSocket = undefined
      if (this.clientSocket) {
        this.clientSocket.removeAllListeners()
        this.clientSocket.close(1011, 'Debugger was disconnected')
      }
    }
    this.debuggerSocket.addEventListener('error', onClose)
    this.debuggerSocket.addEventListener('close', onClose)
    this.debuggerSocket.addEventListener('message', ({ data }) => {
      this.send(this.clientSocket, data.toString())
    })
  }

  /**
   * Process new WebSocket connection from React Native app (client)
   * and close any previous connection.
   *
   * @param socket Incoming client WebSocket connection.
   */
  onClientConnection(socket: WebSocket) {
    if (this.clientSocket) {
      this.clientSocket.removeAllListeners()
      this.clientSocket.close(1011, 'Another client is connected')
      this.clientSocket = undefined
    }

    const onClose = () => {
      this.fastify.log.info({
        msg: 'React Native app disconnected from debugger',
      })
      this.clientSocket = undefined
      this.send(this.debuggerSocket, JSON.stringify({ method: '$disconnected' }))
    }

    this.clientSocket = socket
    this.clientSocket.addEventListener('error', onClose)
    this.clientSocket.addEventListener('close', onClose)
    this.clientSocket.addEventListener('message', ({ data }) => {
      this.send(this.debuggerSocket, data.toString())
    })
  }
}
