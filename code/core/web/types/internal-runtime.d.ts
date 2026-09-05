/**
 * Private implementation boundary shared by Tamagui workspace packages. Not public
 * API: never reexport it from `@tamagui/web`, `@tamagui/core`, `tamagui`, or
 * `@tamagui/tailwind` roots. Doing so would expose implementation details again.
 *
 * It deliberately exposes purpose-built, explicitly typed wrappers rather than raw
 * module reexports. That keeps the private declaration entry narrow and avoids
 * reconnecting the regular root barrel.
 */
import type { FunctionComponent } from 'react';
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend';
export { mergeFrontendCondition, regularStyleFrontend } from './helpers/styleFrontend';
export type * from './internalRuntimeTypes';
export declare const createVariables: (tokens: Record<string, any>, parentPath?: string, isFont?: boolean) => any;
export declare const parseFont: (definition: Record<string, any>) => any;
export declare const registerFontVariables: (parsedFont: any) => string[];
export declare const fixStyles: (style: Record<string, any>) => void;
export declare const getThemeCSSRules: (props: {
    config: any;
    themeName: string;
    theme: any;
    names: string[];
    hasDarkLight?: boolean;
    useMutatedVariables?: boolean;
}) => string[];
export declare const normalizeValueWithProperty: (value: any, property?: string) => any;
export declare const proxyThemeToParents: (themeName: string, theme: any) => any;
export declare const ensureThemeVariable: (theme: any, key: string) => void;
export declare const transformsToString: (transforms: object[]) => string;
export declare const styleToCSS: (style: Record<string, any>) => void;
export declare const useThemeWithState: (props: any, isRoot?: boolean, forThemeView?: boolean) => [any, any];
export declare const plainValueToPayload: (value: unknown, property: string) => string | null;
export declare const createTamagui: (config: any) => any;
export declare const setupHooks: (hooks: Record<string, any>) => void;
export declare const TamaguiProvider: FunctionComponent<any>;
export declare function createFrontendStyled(frontend: StyleFrontend): (ComponentIn: any, optionsOrBaseClassName?: any, configOrOptions?: any, maybeConfig?: any) => FrontendComponent;
/**
 * Distinct View/Text component objects carrying `frontend`. The regular singletons
 * are untouched: only their static configuration is shared, and `createComponent`
 * does not mutate the config it receives.
 */
export declare function createFrontendViews(frontend: StyleFrontend): {
    View: FrontendComponent;
    Text: FrontendComponent;
};
//# sourceMappingURL=internal-runtime.d.ts.map