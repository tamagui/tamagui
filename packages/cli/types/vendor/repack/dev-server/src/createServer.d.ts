/// <reference types="node" />
import { Server } from './types';
/**
 * Create instance of development server, powered by Fastify.
 *
 * @param config Server configuration.
 * @returns `start` and `stop` functions as well as an underlying Fastify `instance`.
 */
export declare function createServer(config: Server.Config): Promise<{
    start: () => Promise<void>;
    stop: () => Promise<void>;
    instance: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance> & PromiseLike<import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
}>;
//# sourceMappingURL=createServer.d.ts.map