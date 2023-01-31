/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { FastifyInstance } from 'fastify';
import WebSocket from 'ws';
import { WebSocketServer } from '../WebSocketServer';
/**
 * Class for creating a WebSocket server and providing a bridge between
 * debugger UI (Remote JS debugger) and the running React Native application.
 *
 * React Native application (aka client) will send and receive messages from the debugger UI
 * which runs inside a browser.
 *
 * @category Development server
 */
export declare class WebSocketDebuggerServer extends WebSocketServer {
    /**
     * A WebSocket connection with the debugger UI.
     */
    private debuggerSocket;
    /**
     * A WebSocket connection with the client (React Native app).
     */
    private clientSocket;
    /**
     * Create new instance of WebSocketDebuggerServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Check if debugger UI is connected to the WebSocketDebuggerServer.
     */
    isDebuggerConnected(): boolean;
    /**
     * Send a message to a given WebSocket connection.
     *
     * @param socket WebSocket connection to send the message to.
     * @param message Message to send.
     */
    send(socket: WebSocket | undefined, message: string): void;
    /**
     * Process new WebSocket connection. The upgrade request should contain `role` query param
     * for determining the type of the connection.
     *
     * @param socket Incoming WebSocket connection.
     * @param request Upgrade request for the connection.
     */
    onConnection(socket: WebSocket, request: IncomingMessage): void;
    /**
     * Process new WebSocket connection from Debugger UI (Remote JS Debugger).
     * If there's already open connection, the new one gets closed automatically.
     *
     * @param socket Incoming debugger WebSocket connection.
     */
    onDebuggerConnection(socket: WebSocket): void;
    /**
     * Process new WebSocket connection from React Native app (client)
     * and close any previous connection.
     *
     * @param socket Incoming client WebSocket connection.
     */
    onClientConnection(socket: WebSocket): void;
}
//# sourceMappingURL=WebSocketDebuggerServer.d.ts.map