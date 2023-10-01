import type { FastifyInstance } from 'fastify';
import WebSocket from 'ws';
import { WebSocketServer } from '../WebSocketServer';
import { WebSocketMessageServer } from './WebSocketMessageServer';
/**
 * {@link WebSocketEventsServer} configuration options.
 */
export interface WebSocketEventsServerConfig {
    /** Instance of a {@link WebSocketMessageServer} which can be used for broadcasting. */
    webSocketMessageServer: WebSocketMessageServer;
}
/**
 * Represents a command that connected clients can send to the {@link WebSocketEventsServer}.
 */
export interface Command {
    version: number;
    type: 'command';
    command: string;
    params?: any;
}
/**
 * Represents an event message.
 */
export interface EventMessage {
    error?: Error | string;
    type?: string;
    data?: any;
}
/**
 * Class for creating a WebSocket server to process events and reports.
 *
 * Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/eventsSocketServer.ts
 *
 * @category Development server
 */
export declare class WebSocketEventsServer extends WebSocketServer {
    private config;
    static readonly PROTOCOL_VERSION = 2;
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     * @param config Configuration object.
     */
    constructor(fastify: FastifyInstance, config: WebSocketEventsServerConfig);
    /**
     * Parse received command message from connected client.
     *
     * @param data Stringified command message to parse.
     * @returns Parsed command or `undefined` if parsing failed.
     */
    parseMessage(data: string): Command | undefined;
    /**
     * Stringify `message` into a format that can be transported as a `string`.
     *
     * @param message Message to serialize.
     * @returns String representation of a `message` or `undefined` if serialization failed.
     */
    serializeMessage(message: EventMessage): string | undefined;
    /**
     * Broadcast event to all connected clients.
     *
     * @param event Event message to broadcast.
     */
    broadcastEvent(event: EventMessage): void;
    /**
     * Process new client's WebSocket connection.
     *
     * @param socket Incoming WebSocket connection.
     */
    onConnection(socket: WebSocket): void;
}
//# sourceMappingURL=WebSocketEventsServer.d.ts.map