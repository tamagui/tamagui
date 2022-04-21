import { ReactComponentWithRef } from '@tamagui/core';
import { View } from 'react-native';
import { SizableTextProps } from './SizableText';
export declare type AnchorProps = SizableTextProps & {
    href?: string;
    target?: string;
    rel?: string;
};
export declare const Anchor: ReactComponentWithRef<AnchorProps, HTMLAnchorElement | View>;
//# sourceMappingURL=Anchor.d.ts.map