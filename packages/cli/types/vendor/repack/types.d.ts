import { FastifyLoggerInstance } from 'fastify';
import type { CompilerDelegate } from './plugins/compiler';
import type { SymbolicatorDelegate } from './plugins/symbolicate';
import type { HmrDelegate } from './plugins/wss';
export type { CompilerDelegate } from './plugins/compiler';
export type { SymbolicatorDelegate, ReactNativeStackFrame, InputStackFrame, StackFrame, CodeFrame, SymbolicatorResults, } from './plugins/symbolicate';
export type { HmrDelegate } from './plugins/wss';
export declare namespace Server {
    /** Development server configuration. */
    interface Config {
        /** Development server options to configure e.g: `port`, `host` etc. */
        options: Options;
        /** Function to create a delegate, which implements crucial functionalities. */
        delegate: (context: DelegateContext) => Delegate;
    }
    /** Development server options. */
    interface Options {
        /** Root directory of the project. */
        rootDir: string;
        /** Port under which to run the development server. */
        port: number;
        /**
         * Hostname or IP address under which to run the development server.
         * When left unspecified, it will listen on all available network interfaces, similarly to listening on '0.0.0.0'.
         */
        host?: string;
        /** Options for running the server as HTTPS. If `undefined`, the server will run as HTTP. */
        https?: {
            /** Path to certificate when running server as HTTPS. */
            cert?: string;
            /** Path to certificate key when running server as HTTPS. */
            key?: string;
        };
    }
    /**
     * A complete delegate with implementations for all server functionalities.
     */
    interface Delegate {
        /** A compiler delegate. */
        compiler: CompilerDelegate;
        /** A symbolicator delegate. */
        symbolicator: SymbolicatorDelegate;
        /** A logger delegate. */
        logger: LoggerDelegate;
        /** An HMR delegate. */
        hmr: HmrDelegate;
        /** An messages delegate. */
        messages: MessagesDelegate;
        /** An API delegate. */
        api?: Api.Delegate;
    }
    /**
     * A delegate context used in `delegate` builder in {@link Config}.
     *
     * Allows to emit logs, notify about compilation events and broadcast events to connected clients.
     */
    interface DelegateContext {
        /** A logger instance, useful for emitting logs from the delegate. */
        log: FastifyLoggerInstance;
        /** Send notification about compilation start for given `platform`. */
        notifyBuildStart: (platform: string) => void;
        /** Send notification about compilation end for given `platform`. */
        notifyBuildEnd: (platform: string) => void;
        /**
         * Broadcast arbitrary event to all connected HMR clients for given `platform`.
         *
         * @param event Arbitrary event to broadcast.
         * @param platform Platform of the clients to which broadcast should be sent.
         * @param clientIds Ids of the client to which broadcast should be sent.
         * If `undefined` the broadcast will be sent to all connected clients for the given `platform`.
         */
        broadcastToHmrClients: <E = any>(event: E, platform: string, clientIds?: string[]) => void;
        /**
         * Broadcast arbitrary method-like event to all connected message clients.
         *
         * @param event Arbitrary method-like event to broadcast.
         */
        broadcastToMessageClients: <E extends {
            method: string;
            params?: Record<string, any>;
        }>(event: E) => void;
    }
    /**
     * Delegate with implementation for logging functions.
     */
    interface LoggerDelegate {
        /**
         * Callback for when a new log is emitted.
         *
         * @param log An object with log data.
         */
        onMessage: (log: any) => void;
    }
    /**
     * Delegate with implementation for messages used in route handlers.
     */
    interface MessagesDelegate {
        /** Get message to send as a reply for `GET /` route. */
        getHello: () => string;
        /** Get message to send as a reply for `GET /status` route. */
        getStatus: () => string;
    }
    namespace Api {
        /** A compilation asset representation for API clients. */
        interface Asset {
            name: string;
            size: number;
            [key: string]: any;
        }
        /** A compilation stats representation for API clients. */
        interface CompilationStats {
            [key: string]: any;
        }
        /**
         * Delegate with implementation for API endpoints.
         */
        interface Delegate {
            /** Get all platforms - either with already existing compilations or all supported platforms. */
            getPlatforms: () => Promise<string[]>;
            /**
             * Get all assets from compilation for given platform.
             * Should return `[]` if the compilation does not exists for given platform.
             */
            getAssets: (platform: string) => Promise<Asset[]>;
            /**
             * Get compilation stats for a given platform.
             * Should return `null` if the compilation does not exists for given platform.
             */
            getCompilationStats: (platform: string) => Promise<CompilationStats | null>;
        }
    }
}
/** Representation of the compilation progress. */
export interface ProgressData {
    /** Number of modules built. */
    completed: number;
    /** Total number of modules detect as part of compilation. */
    total: number;
}
/**
 * Type representing a function to send the progress.
 *
 * Used by {@link CompilerDelegate} in `getAsset` function to send the compilation
 * progress to the client who requested the asset.
 */
export type SendProgress = (data: ProgressData) => void;
/**
 * Internal types. Do not use.
 *
 * @internal
 */
export declare namespace Internal {
    enum EventTypes {
        BuildStart = "BuildStart",
        BuildEnd = "BuildEnd",
        HmrEvent = "HmrEvent"
    }
}
//# sourceMappingURL=types.d.ts.map