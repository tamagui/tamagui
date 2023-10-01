/// <reference types="node" />
import { StartOptions } from './types';
export declare const create: (options: StartOptions) => Promise<{
    nativeServer: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance> & PromiseLike<import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
    viteServer: import("vite").ViteDevServer;
    start(): Promise<{
        closePromise: Promise<unknown>;
    }>;
    stop: () => Promise<void>;
}>;
//# sourceMappingURL=create.d.ts.map