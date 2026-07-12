import type { AllGroupContexts, AnimationDriver, ComponentContextI, DebugProp, GetStyleResult, GetStyleState, SplitStyleProps, StaticConfig, TamaguiComponentState, TamaguiInternalConfig, TextStyle, ThemeParsed } from '../types';
import { styleOriginalValues } from './styleOriginalValues';
export { styleOriginalValues };
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfig, theme: ThemeParsed, themeName: string, componentState: TamaguiComponentState, styleProps: SplitStyleProps, parentSplitStyles?: GetStyleResult | null, context?: ComponentContextI, groupContext?: AllGroupContexts | null, elementType?: string, startedUnhydrated?: boolean, debug?: DebugProp, animationDriver?: AnimationDriver | null) => null | GetStyleResult;
export declare const PROP_SPLIT = "-";
/**
 * The single styleMode pass: tokenizes className once and flattens the resulting props once,
 * producing the component-level PROPS (enterStyle/exitStyle via the flat-props pass, size +
 * animation via the className pass) plus the style props. Hoisted to run in createComponent
 * BEFORE the state/variant/animation machinery reads those props; getSplitStyles then skips
 * its own preprocess for these marked props (guarded, so direct callers still self-process
 * exactly once). Non-styleMode returns immediately with zero tokenization.
 */
export declare function preprocessStyleModeProps(props: Record<string, any>, config: TamaguiInternalConfig): Record<string, any>;
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleState: GetStyleState, subKey: string, styleIn: object, avoidMergeTransform?: boolean) => TextStyle;
export declare const useSplitStyles: StyleSplitter;
//# sourceMappingURL=getSplitStyles.d.ts.map