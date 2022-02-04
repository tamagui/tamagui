import * as React from 'react';
import { View } from 'react-native';
export declare type NativeLinearGradientProps = React.ComponentProps<typeof View> & React.PropsWithChildren<{
    colors: (number | string)[];
    locations?: number[] | null;
    start?: NativeLinearGradientPoint | null;
    end?: NativeLinearGradientPoint | null;
}>;
export declare type NativeLinearGradientPoint = {
    x?: number;
    y?: number;
} | [number, number];
//# sourceMappingURL=NativeLinearGradientProps.d.ts.map