import React from 'react';
import { DebugProp, SpaceDirection, SpaceValue, SpacerProps, SpacerPropsBase, StackNonStyleProps, StackProps, StackStylePropsBase, StaticConfig, TamaguiComponent, TamaguiElement, TextProps } from './types';
export declare const mouseUps: Set<Function>;
export declare function createComponent<ComponentPropTypes extends StackProps | TextProps = {}, Ref extends TamaguiElement = TamaguiElement, BaseProps = never, BaseStyles extends Object = never>(staticConfig: StaticConfig): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, void>;
export declare function Unspaced(props: {
    children?: any;
}): any;
export declare namespace Unspaced {
    var isUnspaced: boolean;
}
export declare const Spacer: TamaguiComponent<SpacerProps, TamaguiElement, StackNonStyleProps, StackStylePropsBase & SpacerPropsBase, void>;
export type SpacedChildrenProps = {
    isZStack?: boolean;
    children?: React.ReactNode;
    space?: SpaceValue;
    spaceFlex?: boolean | number;
    direction?: SpaceDirection | 'unset';
    separator?: React.ReactNode;
    debug?: DebugProp;
};
export declare function spacedChildren(props: SpacedChildrenProps): React.ReactNode;
//# sourceMappingURL=createComponent.d.ts.map