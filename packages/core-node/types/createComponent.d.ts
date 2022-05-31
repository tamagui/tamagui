/// <reference types="react" />
import { SpaceDirection, SpaceTokens, StackProps, StaticConfig, StaticConfigParsed, StylableComponent, TamaguiComponent, TamaguiElement } from './types';
export declare const mouseUps: Set<Function>;
export declare function createComponent<ComponentPropTypes extends Object = {}, Ref = TamaguiElement, BaseProps = never>(configIn: Partial<StaticConfig> | StaticConfigParsed, ParentComponent?: StylableComponent): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, {}>;
export declare const Spacer: TamaguiComponent<Omit<StackProps, "flex" | "direction"> & {
    size?: SpaceTokens | undefined;
    flex?: number | boolean | undefined;
    direction?: "horizontal" | "vertical" | undefined;
}, TamaguiElement, never, {}>;
export declare const Unspaced: {
    (props: {
        children?: any;
    }): any;
    isUnspaced: boolean;
};
export declare function spacedChildren({ isZStack, children, space, direction, spaceFlex, }: {
    isZStack?: boolean;
    children: any;
    space?: any;
    spaceFlex?: boolean | number;
    direction?: SpaceDirection;
}): any;
export declare function AbsoluteFill(props: any): JSX.Element;
//# sourceMappingURL=createComponent.d.ts.map