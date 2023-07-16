import type { FastifyInstance } from 'fastify';
import { WebSocketServer } from './WebSocketServer';
/**
 * Class for creating a WebSocket router to forward connections to the
 * respective {@link WebSocketServer} as long as the connection is accepted for the upgrade by the
 * server.
 *
 * If the connection is not accepted by any `WebSocketServer`, it will be destroyed to avoid
 * creating handling connections and potentially throwing `ECONNRESET` errors.
 *
 * @category Development server
 */
export declare class WebSocketRouter {
    private fastify;
    /** The list of all register WebSocket servers. */
    protected servers: WebSocketServer[];
    /**
     * Create new instance of `WebSocketRouter` and attach it to the given Fastify instance.
     * Any logging information, will be passed through standard `fastify.log` API.
     *
     * @param fastify Fastify instance to attach the WebSocket router to.
     */
    constructor(fastify: FastifyInstance);
    /**
     * Register a new {@link WebSocketServer}. New connection will now
     * check if the given server will accept them and forward them.
     *
     * @param server WebSocket server to register.
     * @returns The same instance of the WebSocket server after it's been registered.
     */
    registerServer<T extends WebSocketServer>(server: T): T;
}
//# sourceMappingURL=WebSocketRouter.d.ts.map