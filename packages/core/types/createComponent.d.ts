/// <reference types="react" />
import { View, ViewStyle } from 'react-native';
import { SpaceTokens, StaticComponent, StaticConfig, StaticConfigParsed } from './types';
export declare const mouseUps: Set<Function>;
declare type DefaultProps = {};
export declare function createComponent<ComponentPropTypes extends Object = DefaultProps, Ref = View>(configIn: Partial<StaticConfig> | StaticConfigParsed): StaticComponent<ComponentPropTypes, void, Ref, StaticConfigParsed>;
export declare const Spacer: StaticComponent<{
    size?: SpaceTokens | undefined;
    flex?: number | boolean | undefined;
}, void, View, StaticConfigParsed>;
export declare function spacedChildren({ isZStack, children, space, flexDirection, }: {
    isZStack?: boolean;
    children: any;
    space?: any;
    flexDirection?: ViewStyle['flexDirection'];
}): any;
export declare const AbsoluteFill: (props: any) => JSX.Element;
export {};
//# sourceMappingURL=createComponent.d.ts.map