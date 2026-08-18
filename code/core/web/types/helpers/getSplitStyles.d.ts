import type { AllGroupContexts, AnimationDriverLike, ComponentContextI, DebugProp, GetStyleResult, GetStyleState, SplitStyleProps, StaticConfig, TamaguiComponentState, TextStyle, ThemeParsed } from '../types';
import { styleOriginalValues } from './styleOriginalValues';
export { styleOriginalValues };
export { getStyleTokenProvenance, STYLE_TOKEN_PROVENANCE_KEY } from './styleProvenance';
export type { StyleTokenBinding, StyleTokenProvenance } from './styleProvenance';
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfig, theme: ThemeParsed, themeName: string, componentState: TamaguiComponentState, styleProps: SplitStyleProps, parentSplitStyles?: GetStyleResult | null, context?: ComponentContextI, groupContext?: AllGroupContexts | null, elementType?: string, startedUnhydrated?: boolean, debug?: DebugProp, animationDriver?: AnimationDriverLike | null) => null | GetStyleResult;
export declare function isValidStyleKey(key: string, validStyles: Record<string, boolean>, accept?: Record<string, any>): boolean;
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleState: GetStyleState, _subKey: string, styleIn: object, avoidMergeTransform?: boolean) => TextStyle;
export declare const useSplitStyles: StyleSplitter;
//# sourceMappingURL=getSplitStyles.d.ts.map