import type { GetStyleState, PropMapper, SplitStyleProps, TamaguiInternalConfig } from '../types';
export type ResolveVariableAs = 'auto' | 'value' | 'variable';
export declare const propMapper: PropMapper;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export declare const getPropMappedFontFamily: (expanded?: any) => any;
export declare const getTokenForKey: (key: string, value: string, resolveAs: SplitStyleProps['resolveVariablesAs'], styleState: Partial<GetStyleState>) => any;
//# sourceMappingURL=propMapper.d.ts.map