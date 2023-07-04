import { ColorTokens, SizeTokens, ThemeTokens } from '@tamagui/core';
import { SvgProps } from 'react-native-svg';
export type BaseIconProps = {
    size?: number | SizeTokens;
    strokeWidth?: number | SizeTokens;
    color?: (ColorTokens | ThemeTokens | (string & {})) | null;
    disableTheme?: boolean;
    style?: any;
};
export type IconProps = SvgProps & Omit<SvgProps, keyof BaseIconProps> & BaseIconProps;
//# sourceMappingURL=IconProps.d.ts.map