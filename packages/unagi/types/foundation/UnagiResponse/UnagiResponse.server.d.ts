import React from 'react';
import type { CachingStrategy } from '../../types.js';
export declare class UnagiResponse extends Response {
    private wait;
    private cacheOptions;
    private proxy;
    status: number;
    statusText: string;
    constructor(...args: ConstructorParameters<typeof Response>);
    doNotStream(): void;
    canStream(): boolean;
    cache(options?: CachingStrategy): import("../../types.js").AllCacheOptions;
    get cacheControlHeader(): string;
    redirect(location: string, status?: number): React.FunctionComponentElement<{
        to: string;
    }>;
}
//# sourceMappingURL=UnagiResponse.server.d.ts.map