export { rgba } from '@tamagui/normalize-css-color';
type DynamicColor = {
    dynamic: Record<string, string>;
};
export declare const normalizeColor: (color?: string | DynamicColor | null, opacity?: number) => string | DynamicColor | undefined;
export declare const getRgba: (color: string) => {
    r: number;
    g: number;
    b: number;
    a: number;
} | undefined;
//# sourceMappingURL=normalizeColor.native.d.ts.map