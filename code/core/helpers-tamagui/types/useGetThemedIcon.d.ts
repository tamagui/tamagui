import type { ColorProp } from './useCurrentColor';
/** icon px for a size: numbers are px, strings are font size keys, else the 16px default */
export declare const getThemedIconSize: (size: string | number | boolean | null | undefined, scaleIcon?: number) => number;
export declare const useGetThemedIcon: (props: {
    color: ColorProp;
    size?: number;
}) => (el: any) => any;
//# sourceMappingURL=useGetThemedIcon.d.ts.map