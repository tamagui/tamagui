import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend';
export { STYLE_FRONTEND_PREPROCESSED, regularStyleFrontend, } from './helpers/styleFrontend';
export { createFrontendStyled } from './styled';
export type * from './internalRuntimeTypes';
export { createTamagui } from './createTamagui';
export { setupHooks } from './setupHooks';
export { TamaguiProvider } from './views/TamaguiProvider';
export type { TamaguiProviderProps } from './types';
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