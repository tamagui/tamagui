import { parseFlatValue, type CompiledModifierVocabulary } from '@tamagui/style-grammar/runtime';
import type { StaticConfig, TamaguiInternalConfig } from '../types';
import { type RuntimeTokenCategory } from './tokenCategories';
import { expandSafeAreaValue } from './resolveSafeArea';
import { resolveSafeAreaVariable } from './resolveSafeAreaVariable';
import type { StyleStaticConfig } from './styleStaticConfig';
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
    resolveCondition(name: string): ConditionModifier | null;
    tokenCategory(property: string): RuntimeTokenCategory | undefined;
    expandSafeArea: typeof expandSafeAreaValue;
    safeAreaVariable: typeof resolveSafeAreaVariable;
    parseFlatValue: typeof parseFlatValue;
    styleStaticConfig(staticConfig: StaticConfig, conf: TamaguiInternalConfig): StyleStaticConfig;
    propertyKind(property: string): number;
    compositeValue(property: string, raw: string, context: any, resolve: (context: any, property: string, raw: string) => any): string | undefined;
    normalizeTransition(value: string): string;
    embeddedTokens(value: string, resolve: (token: string) => any): string;
    snapshot?: ConfigRevisionSnapshot;
}
export type ConditionModifier = [
    name: string,
    kind: number,
    rank: number,
    selectorOrQuery?: string,
    groupOrSize?: string,
    containerName?: string,
    platformActive?: boolean
];
export declare function prepareConfigRevision(config: TamaguiInternalConfig): ConfigRevisionState;
export declare function getConfigRevisionState(config: TamaguiInternalConfig): ConfigRevisionState;
export declare function getConfigRevisionSnapshot(config: TamaguiInternalConfig): ConfigRevisionSnapshot;
//# sourceMappingURL=grammarConfig.d.ts.map