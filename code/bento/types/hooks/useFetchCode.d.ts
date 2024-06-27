type Params = {
    cacheTime?: number;
};
export declare function useFetchCode(params?: Params): {
    data: string | undefined;
    status: "loading" | "error" | "idle" | "success";
    fetchData: (url: string) => Promise<void>;
};
export {};
//# sourceMappingURL=useFetchCode.d.ts.map