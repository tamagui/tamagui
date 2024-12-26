import type { GetProps, ReactComponentWithRef } from '@tamagui/web';
import type { View } from 'react-native';
export declare const LabelFrame: import("@tamagui/web").TamaguiComponent<import("@tamagui/web").TamaDefer, import("@tamagui/web").TamaguiTextElement, import("@tamagui/web").TextNonStyleProps, import("@tamagui/web").TextStylePropsBase, {
    size?: number | `$${string}` | `$${number}` | `$${string}.${string}` | `$${string}.${number}` | import("@tamagui/web").UnionableNumber | import("@tamagui/web").UnionableString | undefined;
    unstyled?: boolean | undefined;
}, import("@tamagui/web").StaticConfigPublic>;
export type LabelProps = GetProps<typeof LabelFrame> & {
    htmlFor?: string;
};
export declare const Label: ReactComponentWithRef<LabelProps, HTMLButtonElement | View>;
export declare const useLabelContext: (element?: HTMLElement | null) => string | undefined;
//# sourceMappingURL=Label.d.ts.map