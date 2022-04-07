import { PropsWithChildren } from 'react';
import { StackProps } from './Stacks';
export declare type NativeLinearGradientPoint = [number, number];
declare type LinearGradientSpecificProps = PropsWithChildren<{
    colors: number[];
    locations?: number[] | null;
    startPoint?: NativeLinearGradientPoint | null;
    endPoint?: NativeLinearGradientPoint | null;
}>;
export declare type NativeLinearGradientProps = Omit<StackProps, keyof LinearGradientSpecificProps> & LinearGradientSpecificProps;
export {};
//# sourceMappingURL=LinearGradient.types.d.ts.map