import { MediaPropKeys, ThemeName } from '@tamagui/core';
import React from 'react';
export declare type HiddenProps = {
    theme?: ThemeName;
    platform?: ('ios' | 'web' | 'android')[];
    children?: React.ReactNode;
    strategy?: 'visually-hidden' | 'preserve-dimensions' | 'remove';
} & ({
    from?: MediaPropKeys;
    to?: MediaPropKeys;
} | {
    only?: MediaPropKeys[];
});
declare type HiddenHandle = {
    getIsHidden(): boolean;
};
export declare const Hidden: React.ForwardRefExoticComponent<({
    theme?: ThemeName | undefined;
    platform?: ("ios" | "web" | "android")[] | undefined;
    children?: React.ReactNode;
    strategy?: "visually-hidden" | "preserve-dimensions" | "remove" | undefined;
} & ({
    from?: `$${string}` | `$${number}` | undefined;
    to?: `$${string}` | `$${number}` | undefined;
} | {
    only?: (`$${string}` | `$${number}`)[] | undefined;
})) & React.RefAttributes<HiddenHandle>>;
export {};
//# sourceMappingURL=Hidden.d.ts.map