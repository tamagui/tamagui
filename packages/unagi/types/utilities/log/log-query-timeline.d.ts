import { UnagiRequest } from '../../foundation/UnagiRequest/UnagiRequest.server.js';
import { QueryKey } from '../../types.js';
import { RenderType } from './log.js';
export declare type TimingType = 'requested' | 'resolved' | 'rendered' | 'preload';
export declare type QueryTiming = {
    name: string;
    timingType: TimingType;
    timestamp: number;
    duration?: number;
};
export declare function collectQueryTimings(request: UnagiRequest, queryKey: QueryKey, timingType: TimingType, duration?: number): void;
export declare function logQueryTimings(type: RenderType, request: UnagiRequest): void;
//# sourceMappingURL=log-query-timeline.d.ts.map