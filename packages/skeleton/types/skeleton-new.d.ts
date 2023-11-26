import React from 'react';
import { MotiSkeletonProps } from './types';
export default function SkeletonFrame(props: MotiSkeletonProps): JSX.Element;
declare function AnimatedGradient(): JSX.Element | null;
declare function SkeletonGroup({ children, show, }: {
    children: React.ReactNode;
    /**
     * If `true`, all `Skeleton` children components will be shown.
     *
     * If `false`, the `Skeleton` children will be hidden.
     */
    show: boolean;
}): JSX.Element;
export declare const Skeleton: typeof SkeletonFrame & {
    Group: typeof SkeletonGroup;
    Gradient: typeof AnimatedGradient;
};
export {};
//# sourceMappingURL=skeleton-new.d.ts.map