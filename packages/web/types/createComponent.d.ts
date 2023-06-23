import React from 'react';
import { DebugProp, SpaceDirection, SpaceValue, SpacerProps, StaticConfig, StaticConfigParsed, StylableComponent, TamaguiComponent, TamaguiComponentState, TamaguiElement } from './types';
export declare const defaultComponentState: TamaguiComponentState;
export declare const mouseUps: Set<Function>;
export declare function createComponent<ComponentPropTypes extends Object = {}, Ref = TamaguiElement, BaseProps = never>(staticConfigIn: Partial<StaticConfig> | StaticConfigParsed, ParentComponent?: StylableComponent): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, {}>;
export declare const Unspaced: {
    (props: {
        children?: any;
    }): any;
    isUnspaced: boolean;
};
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