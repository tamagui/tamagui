import { PropMapper, SplitStyleState, StaticConfigParsed, TamaguiInternalConfig } from '../types';
export declare type ResolveVariableTypes = 'auto' | 'value' | 'variable' | 'both' | 'non-color-value';
export declare const getReturnVariablesAs: (props: any, state: Partial<SplitStyleState>) => "auto" | "value" | "non-color-value";
export declare const createPropMapper: (staticConfig: StaticConfigParsed) => PropMapper;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export declare const getPropMappedFontFamily: (expanded?: any) => any;
//# sourceMappingURL=createPropMapper.d.ts.map