import { type TransitionDiagnostic } from "./transition";
export type LegacyTransitionValue = string | Readonly<Record<string, unknown>> | readonly [string, Readonly<Record<string, unknown>>];
/** a v3 `transition` value: a css/preset string, or a config object */
export type MigratedTransition = string | Record<string, unknown>;
export type TransitionMigrationResult = {
	ok: true;
	value: MigratedTransition;
} | {
	ok: false;
	diagnostics: readonly TransitionDiagnostic[];
};
/**
* migrates a v2 transition value to its v3 spelling.
*
* @param presetNames configured animation names, so the migration can tell a
*   preset from a css timing exactly as the runtime does
* @param animateOnly the removed `animateOnly` prop's list, when the site had
*   one. an empty list disabled transitions entirely, which is `none`.
*/
export declare function migrateLegacyTransition(input: LegacyTransitionValue, presetNames: ReadonlySet<string>, animateOnly?: readonly string[]): TransitionMigrationResult;
/** prints a migrated value as javascript source, for a codemod to write back */
export declare function printMigratedTransition(value: MigratedTransition): string;

//# sourceMappingURL=transitionLegacy.d.ts.map