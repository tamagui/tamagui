import '../utilities/webPolyfill.js';
import connect from 'connect';
declare type CreateServerOptions = {
    cache?: Cache;
};
export declare function createServer({ cache }?: CreateServerOptions): Promise<{
    app: connect.Server;
}>;
export {};
//# sourceMappingURL=node.d.ts.map