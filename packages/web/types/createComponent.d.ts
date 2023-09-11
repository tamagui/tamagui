import React from 'react';
import { DebugProp, SpaceDirection, SpaceValue, SpacerProps, StackProps, StaticConfig, TamaguiComponent, TamaguiElement, TextProps } from './types';
export declare const mouseUps: Set<Function>;
export declare function createComponent<ComponentPropTypes extends StackProps | TextProps = {}, Ref = TamaguiElement, BaseProps = never>(staticConfig: StaticConfig): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, {}>;
export declare function Unspaced(props: {
    children?: any;
}): any;
export declare const Spacer: TamaguiComponent<SpacerProps, TamaguiElement, never, {}>;
export type SpacedChildrenProps = {
    isZStack?: boolean;
    children?: React.ReactNode;
    space?: SpaceValue;
    spaceFlex?: boolean | number;
    direction?: SpaceDirection;
    separator?: React.ReactNode;
    debug?: DebugProp;
};
export declare function spacedChildren(props: SpacedChildrenProps): React.ReactNode;
//# sourceMappingURL=createComponent.d.ts.map