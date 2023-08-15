import type { ViteHotContext } from './hot';
export declare function createHotContext(ownerPath: string): ViteHotContext;
/**
 * urls here are dynamic import() urls that couldn't be statically analyzed
 */
export declare function injectQuery(url: string, queryToInject: string): string;
//# sourceMappingURL=client.d.ts.map