export declare type SessionSyncApi = {
    get: () => Record<string, string>;
};
export declare type SessionApi = {
    get: () => Promise<Record<string, string>>;
    set: (key: string, value: string) => Promise<void>;
    destroy: () => Promise<void>;
};
export declare type SessionStorageAdapter = {
    get: (request: Request) => Promise<Record<string, string>>;
    set: (request: Request, value: Record<string, string>) => Promise<string>;
    destroy: (request: Request) => Promise<string>;
};
//# sourceMappingURL=session-types.d.ts.map