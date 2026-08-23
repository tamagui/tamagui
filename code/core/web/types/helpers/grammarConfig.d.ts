import { type ClausePrecedenceOrder, type CompiledModifierVocabulary } from '@tamagui/style-grammar/runtime';
import type { TamaguiInternalConfig } from '../types';
export type ConfigRevisionPart = 'media' | 'themeNames' | 'themeVariables' | 'tokens' | 'fonts' | 'shorthands';
export type ConfigRevisionParts = Readonly<Record<ConfigRevisionPart, string>>;
export interface ConfigRevisionSnapshot {
    revision: string;
    parts: ConfigRevisionParts;
}
export interface ConfigRevisionState {
    revision: number;
    modifiers: CompiledModifierVocabulary;
    mediaQueries: Readonly<Record<string, string>>;
    precedenceOrder: ClausePrecedenceOrder;
    snapshot?: ConfigRevisionSnapshot;
}
export declare function prepareConfigRevision(config: TamaguiInternalConfig): ConfigRevisionState;
export declare function getConfigRevisionState(config: TamaguiInternalConfig): ConfigRevisionState;
export declare function getConfigRevisionSnapshot(config: TamaguiInternalConfig): ConfigRevisionSnapshot;
//# sourceMappingURL=grammarConfig.d.ts.map