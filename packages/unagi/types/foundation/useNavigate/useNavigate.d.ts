declare type NavigationOptions = {
    replace?: boolean;
    reloadDocument?: boolean;
    clientState?: any;
    scroll?: any;
    basePath?: string;
};
export declare function useNavigate(): (path: string, options?: NavigationOptions) => void;
export declare function buildPath(basePath: string, path: string): string;
export {};
//# sourceMappingURL=useNavigate.d.ts.map