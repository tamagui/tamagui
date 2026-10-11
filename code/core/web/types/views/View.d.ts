import type { StackNonStyleProps, StackStyle, StackStyleBase, StaticConfig, TamaguiElement } from '../types';
export type View = TamaguiElement;
export type ViewNonStyleProps = StackNonStyleProps;
export type ViewStylePropsBase = StackStyleBase;
export type ViewStyle = StackStyle;
export type ViewProps = ViewNonStyleProps & ViewStyle;
/**
 * Shared by every frontend's View. `createComponent` never mutates the config it
 * receives, so another frontend spreads this and adds its own descriptor rather
 * than touching the regular View singleton.
 */
export declare const viewStaticConfig: StaticConfig;
export declare const View: import("..").TamaguiComponent<ViewProps, TamaguiElement, StackNonStyleProps, StackStyleBase, {}>;
//# sourceMappingURL=View.d.ts.map