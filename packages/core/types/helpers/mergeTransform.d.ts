import type { ViewStyle } from '@tamagui/types-react-native';
export type FlatTransforms = Record<string, any>;
export declare const mergeTransform: (obj: ViewStyle, key: string, val: any, backwards?: boolean) => void;
export declare const mergeTransforms: (obj: ViewStyle, flatTransforms: FlatTransforms, backwards?: boolean) => void;
export declare const mapTransformKeys: {
    x: string;
    y: string;
};
//# sourceMappingURL=mergeTransform.d.ts.map