import { PropMapper, SplitStyleState, StaticConfigParsed } from '../types';
export declare type ResolveVariableTypes = 'auto' | 'value' | 'variable' | 'both' | 'non-color-value';
export declare const getReturnVariablesAs: (props: any, state: Partial<SplitStyleState>) => "auto" | "value" | "non-color-value";
export declare const createPropMapper: (staticConfig: StaticConfigParsed) => PropMapper;
export declare const getPropMappedFontFamily: (expanded?: any) => any;
//# sourceMappingURL=createPropMapper.d.ts.map