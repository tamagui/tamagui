import { type ReactElement } from 'react';
import type { AnimationDriverLike } from '../types';
import type { AnimatedTextChannel, NativeTextMetrics } from './nativeTextMetrics';
export declare function NativeTextBinding({ element, useTextMetrics, inheritedText, lineHeight, isInput, }: {
    element: ReactElement<any>;
    useTextMetrics: NonNullable<AnimationDriverLike['useTextMetrics']>;
    inheritedText: AnimatedTextChannel;
    lineHeight: NativeTextMetrics['lineHeight'];
    isInput?: boolean;
}): ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=NativeTextBinding.d.ts.map