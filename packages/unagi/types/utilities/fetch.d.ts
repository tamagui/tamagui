declare type FetchInit = {
    body?: string;
    method?: string;
    headers?: Record<string, string>;
};
export declare function fetchBuilder<T>(url: string, options?: FetchInit): () => Promise<T>;
export {};
//# sourceMappingURL=fetch.d.ts.map