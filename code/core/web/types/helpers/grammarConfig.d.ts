import type { TamaguiInternalConfig } from '../types';
export type ConfigRevisionPart = 'media' | 'themeNames' | 'themeVariables' | 'tokens' | 'fonts' | 'shorthands';
export type ConfigRevisionParts = Readonly<Record<ConfigRevisionPart, string>>;
export interface ConfigRevisionSnapshot {
    revision: string;
    parts: ConfigRevisionParts;
}
export declare function getConfigRevisionSnapshot(config: TamaguiInternalConfig): ConfigRevisionSnapshot;
//# sourceMappingURL=grammarConfig.d.ts.map