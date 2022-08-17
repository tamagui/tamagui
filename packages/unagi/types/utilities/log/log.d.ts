import { UnagiRequest } from '../../foundation/UnagiRequest/UnagiRequest.server.js';
declare type LoggerMethod = (...args: Array<any>) => void | Promise<any>;
export interface Logger {
    trace: LoggerMethod;
    debug: LoggerMethod;
    warn: LoggerMethod;
    error: LoggerMethod;
    fatal: LoggerMethod;
    options: () => LoggerOptions;
}
export declare type LoggerOptions = {
    showCacheControlHeader?: boolean;
    showCacheApiStatus?: boolean;
    showQueryTiming?: boolean;
    showUnusedQueryProperties?: boolean;
};
export declare type LoggerConfig = Partial<Exclude<Logger, 'options'>> & LoggerOptions;
export declare type RenderType = 'str' | 'rsc' | 'ssr' | 'api';
export declare function getLoggerWithContext(context: Partial<UnagiRequest>): Logger;
export declare const log: Logger;
export declare function setLogger(config?: LoggerConfig): void;
export declare function logServerResponse(type: RenderType, request: UnagiRequest, responseStatus: number): void;
export {};
//# sourceMappingURL=log.d.ts.map