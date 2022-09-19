declare type NavigationOptions = {
    /** Whether to update the state object or URL of the current history entry. Defaults to false. */
    replace?: boolean;
    /** Whether to reload the whole document on navigation. */
    reloadDocument?: boolean;
    /** The custom client state with the navigation. */
    clientState?: any;
    /** Whether to emulate natural browser behavior and restore scroll position on navigation. Defaults to true. */
    scroll?: any;
    basePath?: string;
};
/**
 * The useNavigate hook imperatively navigates between routes.
 */
export declare function useNavigate(): (path: string, options?: NavigationOptions) => void;
export declare function buildPath(basePath: string, path: string): string;
export {};
//# sourceMappingURL=useNavigate.d.ts.map