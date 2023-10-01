/// <reference types="node" />
import { HMRListener, StartOptions } from '../types';
export declare function createDevServer(options: StartOptions, { indexJson, listenForHMR, getIndexBundle, hotUpdatedCJSFiles, }: {
    indexJson: Object;
    getIndexBundle: () => Promise<string>;
    listenForHMR: (cb: HMRListener) => void;
    hotUpdatedCJSFiles: Map<string, string>;
}): Promise<{
    start: () => Promise<void>;
    stop: () => Promise<void>;
    instance: import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance> & PromiseLike<import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>>;
}>;
/**
 * Represent Hot Module Replacement Update body.
 *
 * @internal
 */
export interface HMRMessageBody {
    name: string;
    time: number;
    hash: string;
    warnings: any;
    errors: any;
    modules: Record<string, string>;
}
/**
 * Represent Hot Module Replacement Update message.
 *
 * @internal
 */
export interface HMRMessage {
    action: 'building' | 'built' | 'sync';
    body: HMRMessageBody | null;
}
//# sourceMappingURL=createDevServer.d.ts.map