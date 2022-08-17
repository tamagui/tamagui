import type { ImportGlobEagerOutput } from '../../types.js';
interface FileRoutesProps {
    routes?: ImportGlobEagerOutput;
    basePath?: string;
    dirPrefix?: string | RegExp;
}
export declare function FileRoutes({ routes, basePath, dirPrefix }: FileRoutesProps): JSX.Element | null;
interface UnagiRoute {
    component: any;
    path: string;
    exact: boolean;
}
export declare function createPageRoutes(pages: ImportGlobEagerOutput, topLevelPath?: string, dirPrefix?: string | RegExp): UnagiRoute[];
export {};
//# sourceMappingURL=FileRoutes.server.d.ts.map