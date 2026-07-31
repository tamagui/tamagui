import { type BorderFamilyError, type ModifierRegistryView, type ParsedValue, type TextDecorationFamilyError, type ValueParseError } from '@tamagui/style-grammar';
/** one authored prop's contribution to one CSS longhand, pre-resolution */
export interface ProgramEntry {
    property: string;
    value: ParsedValue;
}
/** a background family component that is neither a color nor an image */
export interface BackgroundFamilyError {
    code: 'unsupported-bg-component';
    component: string;
    where: 'base' | number;
}
export type ProgramError = ValueParseError | BackgroundFamilyError | BorderFamilyError | TextDecorationFamilyError;
export type CachedEntry = {
    programs: readonly ProgramEntry[];
    errors?: undefined;
} | {
    programs?: undefined;
    errors: readonly ProgramError[];
};
export interface ProgramCacheContext {
    /** the registry the active config's modifiers were built from */
    registry: ModifierRegistryView;
    /** stamped at config creation; a new revision means a new cache generation */
    configRevision: string;
    /** color token names, for classifying background family components */
    colorTokens: ReadonlySet<string>;
}
/**
 * Authored props that expand to more than one background longhand. Geometric
 * shorthands (`padding`, `borderRadius`) are NOT split here: they expand during
 * the forward merge, so the cache stays keyed by the authored prop.
 */
export declare const backgroundFamilyProps: ReadonlySet<string>;
/**
 * Replaces the active context wholesale and drops every cached entry, mirroring
 * how @tamagui/web holds a single active config. Called from config creation.
 */
export declare function setProgramCacheContext(next: ProgramCacheContext): void;
export declare function resetProgramCache(): void;
/** for tests and diagnostics only */
export declare function getProgramCacheSize(): number;
export declare function getCachedPrograms(property: string, input: string): CachedEntry;
//# sourceMappingURL=programCache.d.ts.map