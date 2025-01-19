import React from 'react';
import type { TamaguiComponentState } from './interfaces/TamaguiComponentState';
import type { DebugProp, SpaceDirection, SpaceValue, SpacerProps, SpacerStyleProps, StackNonStyleProps, StaticConfig, TamaguiComponent, TamaguiElement } from './types';
type ComponentSetState = React.Dispatch<React.SetStateAction<TamaguiComponentState>>;
export declare const componentSetStates: Set<ComponentSetState>;
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends TamaguiElement = TamaguiElement, BaseProps = never, BaseStyles extends Object = never>(staticConfig: StaticConfig): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
export declare function Unspaced(props: {
    children?: any;
}): any;
export declare namespace Unspaced {
    var isUnspaced: boolean;
}
export declare const Spacer: TamaguiComponent<SpacerProps, TamaguiElement, StackNonStyleProps, SpacerStyleProps, {}>;
export type SpacedChildrenProps = {
    isZStack?: boolean;
    children?: React.ReactNode;
    space?: SpaceValue;
    spaceFlex?: boolean | number;
    direction?: SpaceDirection | 'unset';
    separator?: React.ReactNode;
    ensureKeys?: boolean;
    debug?: DebugProp;
};
export declare function spacedChildren(props: SpacedChildrenProps): React.ReactNode;
export {};
//# sourceMappingURL=createComponent.d.ts.map