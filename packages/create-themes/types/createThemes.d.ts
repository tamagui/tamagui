import type { Variable } from '@tamagui/core';
type AltKeys = 1 | 2;
type Colors = {
    [key: string]: {
        [subKey: string]: string;
    };
};
type GeneratedTheme<ExtraKeys extends string = string> = {
    [Key in ExtraKeys]: Variable<string>;
} & {
    backgroundStrong: Variable<string>;
    background: Variable<string>;
    backgroundSoft: Variable<string>;
    backgroundHover: Variable<string>;
    backgroundPress: Variable<string>;
    backgroundFocus: Variable<string>;
    backgroundTransparent: Variable<string>;
    color: Variable<string>;
    colorHover: Variable<string>;
    colorPress: Variable<string>;
    colorFocus: Variable<string>;
    colorTranslucent: Variable<string>;
    colorMid: Variable<string>;
    shadowColor: Variable<string>;
    shadowColorHover: Variable<string>;
    shadowColorPress: Variable<string>;
    shadowColorFocus: Variable<string>;
    borderColor: Variable<string>;
    borderColorHover: Variable<string>;
    borderColorPress: Variable<string>;
    borderColorFocus: Variable<string>;
    placeholderColor: Variable<string>;
    color1: Variable<string>;
    color2: Variable<string>;
    color3: Variable<string>;
    color4: Variable<string>;
    color5: Variable<string>;
    color6: Variable<string>;
    color7: Variable<string>;
    color8: Variable<string>;
    color9: Variable<string>;
    color10: Variable<string>;
    color11: Variable<string>;
    color12: Variable<string>;
};
type GetSubThemes<Name extends string> = `${Name}` | `${Name}_alt${AltKeys}` | `${Name}_darker` | `${Name}_active` | `${Name}_Card` | `${Name}_SliderTrack` | `${Name}_SliderTrackActive` | `${Name}_Switch` | `${Name}_SwitchThumb` | `${Name}_DrawerFrame` | `${Name}_Button` | `${Name}_SliderThumb` | `${Name}_Progress` | `${Name}_ProgressIndicator` | `${Name}_RadioGroup` | `${Name}_RadioGroupIndicator` | `${Name}_TooltipArrow` | `${Name}_TooltipContent` | `${Name}_ToggleGroupItem` | `${Name}_Toggle` | `${Name}_Checkbox` | `${Name}_CheckboxIndicator`;
export type GeneratedThemes<ColorsList extends string, BaseColorList extends string> = {
    [key in GetSubThemes<ColorsList extends string ? ColorsList : never> | GetSubThemes<`light`> | GetSubThemes<`dark`>]: GeneratedTheme<BaseColorList>;
};
export declare const createThemes: <ColorsList extends string, BaseColorList extends string>({ activeColor, light, dark, colorsLight, colorsDark, }: {
    activeColor: string;
    light: string[];
    dark: string[];
    colorsLight: Colors;
    colorsDark: Colors;
}) => GeneratedThemes<ColorsList, BaseColorList>;
export {};
//# sourceMappingURL=createThemes.d.ts.map