import { WebSocketDebuggerServer } from './servers/WebSocketDebuggerServer';
import { WebSocketDevClientServer } from './servers/WebSocketDevClientServer';
import { WebSocketMessageServer } from './servers/WebSocketMessageServer';
import { WebSocketEventsServer } from './servers/WebSocketEventsServer';
import { HermesInspectorProxy } from './servers/HermesInspectorProxy';
import { WebSocketApiServer } from './servers/WebSocketApiServer';
import { WebSocketHMRServer } from './servers/WebSocketHMRServer';
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
declare const _default: any;
export default _default;
//# sourceMappingURL=wssPlugin.d.ts.map