import type { ImportGlobEagerOutput } from '../../types.js';
interface FileRoutesProps {
    /** The routes defined by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. */
    routes?: ImportGlobEagerOutput;
    /** A path that's prepended to all file routes. You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale. */
    basePath?: string;
    /** The portion of the file route path that shouldn't be a part of the URL. You need to modify this if you want to import routes from a location other than the default `src/routes`. */
    dirPrefix?: string | RegExp;
}
/**
 * The `FileRoutes` component builds a set of default Unagi routes based on the output provided by Vite's
 * [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. You can have multiple
 * instances of this component to source file routes from multiple locations.
 */
export declare function FileRoutes({ routes, basePath, dirPrefix }: FileRoutesProps): JSX.Element | null;
interface UnagiRoute {
    component: any;
    path: string;
    exact: boolean;
}
export declare function createPageRoutes(pages: ImportGlobEagerOutput, topLevelPath?: string, dirPrefix?: string | RegExp): UnagiRoute[];
export {};
//# sourceMappingURL=FileRoutes.server.d.ts.map