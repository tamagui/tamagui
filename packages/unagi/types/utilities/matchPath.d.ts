import { TokensToRegexpOptions } from 'path-to-regexp';
interface MatchPathOptions extends TokensToRegexpOptions {
    path?: string;
    exact?: boolean;
}
/**
 * Public API for matching a URL pathname to a path.
 */
export declare function matchPath(pathname: string, options?: MatchPathOptions): any;
export {};
//# sourceMappingURL=matchPath.d.ts.map