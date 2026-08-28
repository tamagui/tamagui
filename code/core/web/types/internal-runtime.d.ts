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
import type { ParsedValue } from '@tamagui/style-grammar/runtime';
import type { DeepVariableObject } from './createVariables';
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend';
import type { FrontendProgramValue } from './internalRuntimeTypes';
import type { CreateTamaguiProps, GenericFont, ThemeParsed, ThemeState, UseThemeWithStateProps } from './types';
export { STYLE_FRONTEND_PASSTHROUGH_PREFIX, STYLE_FRONTEND_PREPROCESSED, regularStyleFrontend, } from './helpers/styleFrontend';
export type * from './internalRuntimeTypes';
type DeepTokenObject<Val extends string | number = any> = {
    [key: string]: Val | DeepTokenObject<Val>;
};
export declare const createVariables: <A extends DeepTokenObject>(tokens: A, parentPath?: string, isFont?: boolean) => DeepVariableObject<A>;
export declare const parseFont: <A extends GenericFont>(definition: A) => DeepVariableObject<A>;
export declare const registerFontVariables: (parsedFont: any) => string[];
export declare const fixStyles: (style: Record<string, any>) => void;
export declare const getThemeCSSRules: (props: {
    config: CreateTamaguiProps;
    themeName: string;
    theme: ThemeParsed;
    names: string[];
    hasDarkLight?: boolean;
    useMutatedVariables?: boolean;
}) => string[];
export declare const normalizeValueWithProperty: (value: any, property?: string) => any;
export declare const proxyThemeToParents: (themeName: string, theme: ThemeParsed) => ThemeParsed;
export declare const ensureThemeVariable: (theme: any, key: string) => void;
export declare const transformsToString: (transforms: object[]) => string;
export declare const styleToCSS: (style: Record<string, any>) => void;
export declare const useThemeWithState: (props: UseThemeWithStateProps, isRoot?: boolean, forThemeView?: boolean) => [ThemeParsed, ThemeState];
export declare const createFrontendProgram: (property: string, value: ParsedValue) => FrontendProgramValue;
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