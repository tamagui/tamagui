import type { SizeTokens } from '@tamagui/web';
import type { ColorProp } from './useCurrentColor';
/** icon px for a size: the recipe's icon (font size on the 4px grid), numbers are px */
export declare const getThemedIconSize: (size: SizeTokens | number | null | undefined, scaleIcon?: number) => number;
export declare const useGetThemedIcon: (props: {
    color: ColorProp;
    size?: number;
}) => (el: any) => any;
//# sourceMappingURL=useGetThemedIcon.d.ts.map