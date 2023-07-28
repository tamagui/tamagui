import { DebugProp, GetProps, SplitStyleProps, TamaguiComponent, TextNonStyleProps } from '../types';
export declare function useStyle<Component extends TamaguiComponent, StyleProps = Omit<GetProps<Component>, keyof TextNonStyleProps>>(base: Component, style: StyleProps, options?: Partial<SplitStyleProps> & {
    debug?: DebugProp;
}): {
    style: import("react-native").ViewStyle | null;
    classNames: import("../types").ClassNamesObject;
};
//# sourceMappingURL=useStyle.d.ts.map