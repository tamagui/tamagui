import type { FontSizeTokens, GetFinalProps, SizeTokens, StackStyleBase } from '@tamagui/core';
import type { SvgProps } from 'react-native-svg';
export interface IconStyleProps extends StackStyleBase {
    size?: number | FontSizeTokens;
    strokeWidth?: number | SizeTokens;
    color?: string;
}
export type NonStyleProps = Omit<SvgProps, keyof IconStyleProps> & {
    disableTheme?: boolean;
    style?: SvgProps['style'];
};
export type IconProps = GetFinalProps<NonStyleProps, IconStyleProps, {}>;
//# sourceMappingURL=IconProps.d.ts.map