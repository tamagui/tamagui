import type { FastifyInstance } from 'fastify';
import type { Server } from '../../types';
declare function apiPlugin(instance: FastifyInstance, { delegate }: {
    delegate: Server.Delegate;
}): Promise<void>;
export default apiPlugin;
//# sourceMappingURL=apiPlugin.d.ts.map