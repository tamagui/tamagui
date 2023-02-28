import { FastifyInstance } from 'fastify';
import WebSocket from 'ws';
import { WebSocketServer } from '../WebSocketServer';
/**
 * Class for creating a WebSocket server for API clients.
 * Useful to listening for compilation events and new logs.
 *
 * @category Development server
 */
export declare class WebSocketApiServer extends WebSocketServer {
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketApiServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Send message to all connected API clients.
     *
     * @param event Event string or object to send.
     */
    send(event: any): void;
    /**
     * Process new WebSocket connection from client application.
     *
     * @param socket Incoming client's WebSocket connection.
     */
    onConnection(socket: WebSocket): void;
}
//# sourceMappingURL=WebSocketApiServer.d.ts.map