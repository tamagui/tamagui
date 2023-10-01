import type { Server } from '../../types';
import { HermesInspectorProxy } from './servers/HermesInspectorProxy';
import { WebSocketApiServer } from './servers/WebSocketApiServer';
import { WebSocketDebuggerServer } from './servers/WebSocketDebuggerServer';
import { WebSocketDevClientServer } from './servers/WebSocketDevClientServer';
import { WebSocketEventsServer } from './servers/WebSocketEventsServer';
import { WebSocketHMRServer } from './servers/WebSocketHMRServer';
import { WebSocketMessageServer } from './servers/WebSocketMessageServer';
import { WebSocketRouter } from './WebSocketRouter';
declare module 'fastify' {
    interface FastifyInstance {
        wss: {
            debuggerServer: WebSocketDebuggerServer;
            devClientServer: WebSocketDevClientServer;
            messageServer: WebSocketMessageServer;
            eventsServer: WebSocketEventsServer;
            hermesInspectorProxy: HermesInspectorProxy;
            apiServer: WebSocketApiServer;
            hmrServer: WebSocketHMRServer;
            router: WebSocketRouter;
        };
    }
}
declare const _default: import("fastify").FastifyPluginAsync<{
    options: Server.Options;
    delegate: Server.Delegate;
}>;
export default _default;
//# sourceMappingURL=wssPlugin.d.ts.map