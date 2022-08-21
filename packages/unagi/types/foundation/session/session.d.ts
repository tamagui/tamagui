import { Logger } from '../../utilities/log/index.js';
import type { UnagiRequest } from '../UnagiRequest/UnagiRequest.server.js';
import type { UnagiResponse } from '../UnagiResponse/UnagiResponse.server.js';
import type { SessionStorageAdapter } from './session-types.js';
export declare function getSyncSessionApi(request: UnagiRequest, componentResponse: UnagiResponse, log: Logger, session?: SessionStorageAdapter): {
    get(): any;
    set(data: Record<string, any>): any;
};
export declare const emptySessionImplementation: (log: Logger) => {
    getFlash(key: string): Promise<null>;
    get(): Promise<{}>;
    set(key: string, value: string): Promise<void>;
    destroy(): Promise<void>;
};
export declare const emptySyncSessionImplementation: (log: Logger) => {
    get(): {};
    set(data: Record<string, any>): null;
};
//# sourceMappingURL=session.d.ts.map