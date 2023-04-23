import { TamaguiBaseTheme } from "@tamagui/web"

// TODO: Can I incorporate a generic here for type completion on custom tokens?
export type TamaguiBaseThemeMap = Record<keyof TamaguiBaseTheme, string>;


export const defaultTamaguiComponentVariables: TamaguiBaseThemeMap = {
    color: "$color",
    background: "$background",
    backgroundHover: "$backgroundHover",
    backgroundPress: "$backgroundPress",
    backgroundFocus: "$backgroundFocus",
    colorHover: "$colorHover",
    colorPress: "$colorPress",
    colorFocus: "$colorFocus",
    borderColor: "$borderColor",
    borderColorHover: "$borderColorHover",
    borderColorPress: "$borderColorPress",
    borderColorFocus: "$borderColorFocus",
    shadowColor: "$shadowColor",
    shadowColorHover: "$shadowColorHover",
    shadowColorPress: "$shadowColorPress",
    shadowColorFocus: "$shadowColorFocus"
} 