import { ReactComponentWithRef } from '@tamagui/core';
import { SizableTextProps } from '@tamagui/text';
import { View } from 'react-native';
export declare type AnchorProps = SizableTextProps & {
    href?: string;
    target?: string;
    rel?: string;
};
export declare const Anchor: ReactComponentWithRef<AnchorProps, HTMLAnchorElement | View>;
//# sourceMappingURL=Anchor.d.ts.map