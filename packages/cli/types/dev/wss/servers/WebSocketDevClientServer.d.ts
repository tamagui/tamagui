import WebSocket from 'ws';
import type { FastifyInstance } from 'fastify';
import { WebSocketServer } from '../WebSocketServer';
/**
 * Class for creating a WebSocket server for communication with React Native clients.
 * All client logs - logs from React Native application - are processed here.
 *
 * @category Development server
 */
export declare class WebSocketDevClientServer extends WebSocketServer {
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketDevClientServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Process client message.
     *
     * @param message Stringified client message.
     */
    processMessage(message: string): void;
    /**
     * Process new WebSocket connection from client application.
     *
     * @param socket Incoming client's WebSocket connection.
     */
    onConnection(socket: WebSocket): void;
}
//# sourceMappingURL=WebSocketDevClientServer.d.ts.map