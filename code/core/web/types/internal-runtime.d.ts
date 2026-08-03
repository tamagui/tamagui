/**
 * Private implementation boundary for building another style frontend on the shared
 * Tamagui runtime. Not public API: never reexport it from `@tamagui/web`,
 * `@tamagui/core`, `tamagui`, or `@tamagui/tailwind` roots — doing so would
 * reconnect the frontend graphs the package split exists to keep apart.
 *
 * It deliberately exposes purpose-built, explicitly typed wrappers rather than raw
 * module reexports. That keeps the emitted declaration entry on the frontend
 * descriptor and component factory only: it never resolves the regular View, Text,
 * styled, or inline style-prop declarations.
 */
import type { FunctionComponent } from 'react';
import type { ParsedValue } from '@tamagui/style-grammar/runtime';
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend';
import type { FrontendProgramValue } from './internalRuntimeTypes';
export { STYLE_FRONTEND_PASSTHROUGH_PREFIX, STYLE_FRONTEND_PREPROCESSED, regularStyleFrontend, } from './helpers/styleFrontend';
export type * from './internalRuntimeTypes';
export declare const createFrontendProgram: (property: string, value: ParsedValue) => FrontendProgramValue;
export declare const plainValueToPayload: (value: unknown, longhand: string) => string | null;
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