import type { ServerResponse } from 'http';
import type { IncomingMessage, NextFunction } from 'connect';
import type { ViteDevServer } from 'vite';
declare type TamaguiMiddlewareArgs = {
    dev?: boolean;
    indexTemplate: string | ((url: string) => Promise<string>);
    getServerEntrypoint: () => any;
    devServer?: ViteDevServer;
    cache?: Cache;
};
export declare function tamaguiMiddleware({ dev, cache, indexTemplate, getServerEntrypoint, devServer, }: TamaguiMiddlewareArgs): (request: IncomingMessage, response: ServerResponse, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=middleware.d.ts.map