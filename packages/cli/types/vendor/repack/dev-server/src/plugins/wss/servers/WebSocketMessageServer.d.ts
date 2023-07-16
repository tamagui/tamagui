/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { FastifyInstance } from 'fastify';
import WebSocket from 'ws';
import { WebSocketServer } from '../WebSocketServer';
/**
 * Holds {@link ReactNativeMessage} `id` data.
 */
export interface ReactNativeIdObject {
    requestId: string;
    clientId: string;
}
/**
 * Message representation used by {@link WebSocketMessageServer}.
 */
export interface ReactNativeMessage {
    version?: string;
    id?: ReactNativeIdObject;
    method?: string;
    target: string;
    result?: any;
    error?: Error;
    params?: Record<string, any>;
}
type WebSocketWithUpgradeReq = WebSocket & {
    upgradeReq?: IncomingMessage;
};
/**
 * Class for creating a WebSocket server and sending messages between development server
 * and the React Native applications.
 *
 * Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/messageSocketServer.ts
 *
 * @category Development server
 */
export declare class WebSocketMessageServer extends WebSocketServer {
    static readonly PROTOCOL_VERSION = 2;
    /**
     * Check if message is a broadcast request.
     *
     * @param message Message to check.
     * @returns True if message is a broadcast request and should be broadcasted
     * with {@link sendBroadcast}.
     */
    static isBroadcast(message: Partial<ReactNativeMessage>): boolean;
    /**
     * Check if message is a method request.
     *
     * @param message Message to check.
     * @returns True if message is a request.
     */
    static isRequest(message: Partial<ReactNativeMessage>): boolean;
    /**
     * Check if message is a response with results of performing some request.
     *
     * @param message Message to check.
     * @returns True if message is a response.
     */
    static isResponse(message: Partial<ReactNativeMessage>): boolean;
    private clients;
    private nextClientId;
    /**
     * Create new instance of WebSocketMessageServer and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket server to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Parse stringified message into a {@link ReactNativeMessage}.
     *
     * @param data Stringified message.
     * @param binary Additional binary data if any.
     * @returns Parsed message or `undefined` if parsing failed.
     */
    parseMessage(data: string, binary: any): Partial<ReactNativeMessage> | undefined;
    /**
     * Get client's WebSocket connection for given `clientId`.
     * Throws if no such client is connected.
     *
     * @param clientId Id of the client.
     * @returns WebSocket connection.
     */
    getClientSocket(clientId: string): WebSocketWithUpgradeReq;
    /**
     * Process error by sending an error message to the client whose message caused the error
     * to occur.
     *
     * @param clientId Id of the client whose message caused an error.
     * @param message Original message which caused the error.
     * @param error Concrete instance of an error that occurred.
     */
    handleError(clientId: string, message: Partial<ReactNativeMessage>, error: Error): void;
    /**
     * Send given request `message` to it's designated client's socket based on `message.target`.
     * The target client must be connected, otherwise it will throw an error.
     *
     * @param clientId Id of the client that requested the forward.
     * @param message Message to forward.
     */
    forwardRequest(clientId: string, message: Partial<ReactNativeMessage>): void;
    /**
     * Send given response `message` to it's designated client's socket based
     * on `message.id.clientId`.
     * The target client must be connected, otherwise it will throw an error.
     *
     * @param message Message to forward.
     */
    forwardResponse(message: Partial<ReactNativeMessage>): void;
    /**
     * Process request message targeted towards this {@link WebSocketMessageServer}
     * and send back the results.
     *
     * @param clientId Id of the client who send the message.
     * @param message The message to process by the server.
     */
    processServerRequest(clientId: string, message: Partial<ReactNativeMessage>): void;
    /**
     * Broadcast given message to all connected clients.
     *
     * @param broadcasterId Id of the client who is broadcasting.
     * @param message Message to broadcast.
     */
    sendBroadcast(broadcasterId: string | undefined, message: Partial<ReactNativeMessage>): void;
    /**
     * Send method broadcast to all connected clients.
     *
     * @param method Method name to broadcast.
     * @param params Method parameters.
     */
    broadcast(method: string, params?: Record<string, any>): void;
    /**
     * Process new client's WebSocket connection.
     *
     * @param socket Incoming WebSocket connection.
     * @param request Upgrade request for the connection.
     */
    onConnection(socket: WebSocket, request: IncomingMessage): void;
}
export {};
//# sourceMappingURL=WebSocketMessageServer.d.ts.map