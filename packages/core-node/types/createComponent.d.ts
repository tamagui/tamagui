/// <reference types="react" />
import { View, ViewStyle } from 'react-native';
import { SpaceTokens, StackProps, StaticConfig, StaticConfigParsed, TamaguiComponent, TamaguiComponentState } from './types';
export declare const defaultComponentState: TamaguiComponentState;
export declare const mouseUps: Set<Function>;
export declare function createComponent<ComponentPropTypes extends Object = {}, Ref = View, BaseProps = never>(configIn: Partial<StaticConfig> | StaticConfigParsed): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, {}>;
export declare const Spacer: TamaguiComponent<Omit<StackProps, "flex" | "direction"> & {
    size?: SpaceTokens | undefined;
    flex?: number | boolean | undefined;
    direction?: "horizontal" | "vertical" | undefined;
}, View, never, {}>;
export declare function spacedChildren({ isZStack, children, space, flexDirection, spaceFlex, }: {
    isZStack?: boolean;
    children: any;
    space?: any;
    spaceFlex?: boolean | number;
    flexDirection?: ViewStyle['flexDirection'];
}): any[];
export declare const AbsoluteFill: (props: any) => JSX.Element;
//# sourceMappingURL=createComponent.d.ts.map