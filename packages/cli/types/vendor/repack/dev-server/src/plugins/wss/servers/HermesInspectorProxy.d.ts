/// <reference types="node" />
import type { IncomingMessage } from 'http';
import type { FastifyInstance } from 'fastify';
import WebSocket from 'ws';
import { Server } from '../../../types';
import { WebSocketServer } from '../WebSocketServer';
export interface InspectorProxyConfig extends Pick<Server.Options, 'port' | 'host' | 'rootDir'> {
}
export declare class HermesInspectorProxy extends WebSocketServer {
    private config;
    private devices;
    private deviceCounter;
    readonly serverHost: string;
    constructor(fastify: FastifyInstance, config: InspectorProxyConfig);
    private setup;
    private buildPageDescription;
    /**
     * Process new WebSocket connection from device.
     *
     * @param socket Incoming device's WebSocket connection.
     * @param request Upgrade request for the connection.
     */
    onConnection(socket: WebSocket, request: IncomingMessage): void;
}
//# sourceMappingURL=HermesInspectorProxy.d.ts.map