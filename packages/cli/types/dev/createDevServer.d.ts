import { ResolvedOptions } from '../types.js';
export declare function createDevServer(options: ResolvedOptions, { indexJson, getIndexBundle, }: {
    indexJson: Object;
    getIndexBundle: () => Promise<string>;
}): Promise<() => Promise<void>>;
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