/**
 * The narrow type surface another style frontend needs to build components on the
 * shared runtime.
 *
 * The descriptor contract is self-contained: it names only the shared grammar's
 * dependency-free config projection and the static-config fields a frontend
 * rewrites. Component behavior props belong to each public frontend package, so
 * this private construction entry never reaches `./types`.
 */
export type { FrontendComponent, FrontendClassPlan, FrontendClassPlanEntry, FrontendClassSink, FrontendStaticConfig, StyleFrontend, StyleFrontendConfig, } from './helpers/styleFrontend';
//# sourceMappingURL=internalRuntimeTypes.d.ts.map