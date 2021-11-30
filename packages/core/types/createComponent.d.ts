import { ViewStyle } from 'react-native';
import { StaticComponent, StaticConfig, StaticConfigParsed } from './types';
export declare const mouseUps: Set<Function>;
declare type DefaultProps = {};
export declare function createComponent<A extends Object = DefaultProps>(configIn: Partial<StaticConfig> | StaticConfigParsed): StaticComponent<A, void, StaticConfigParsed, any>;
export declare const Spacer: StaticComponent<{
    size?: number | `$${string}` | `$${number}` | undefined;
    flex?: number | boolean | undefined;
}, void, StaticConfigParsed, any>;
export declare function spacedChildren({ isZStack, children, space, flexDirection, }: {
    isZStack?: boolean;
    children: any;
    space?: any;
    flexDirection?: ViewStyle['flexDirection'];
}): any;
export {};
//# sourceMappingURL=createComponent.d.ts.map