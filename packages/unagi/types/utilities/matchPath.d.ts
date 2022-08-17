import { TokensToRegexpOptions } from 'path-to-regexp';
interface MatchPathOptions extends TokensToRegexpOptions {
    path?: string;
    exact?: boolean;
}
export declare function matchPath(pathname: string, options?: MatchPathOptions): any;
export {};
//# sourceMappingURL=matchPath.d.ts.map