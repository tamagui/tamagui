import type { ServerResponse } from 'http';
import type { IncomingMessage, NextFunction } from 'connect';
import type { ViteDevServer } from 'vite';
declare type UnagiMiddlewareArgs = {
    dev?: boolean;
    indexTemplate: string | ((url: string) => Promise<string>);
    getServerEntrypoint: () => any;
    devServer?: ViteDevServer;
    cache?: Cache;
};
export declare function unagiMiddleware({ dev, cache, indexTemplate, getServerEntrypoint, devServer, }: UnagiMiddlewareArgs): (request: IncomingMessage, response: ServerResponse, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=middleware.d.ts.map