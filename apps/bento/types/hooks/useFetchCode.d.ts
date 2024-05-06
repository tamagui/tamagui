type Params = {
    cacheTime?: number;
};
export declare function useFetchCode(params?: Params): {
    data: string | undefined;
    status: "error" | "success" | "loading" | "idle";
    fetchData: (url: string) => Promise<void>;
};
export {};
//# sourceMappingURL=useFetchCode.d.ts.map