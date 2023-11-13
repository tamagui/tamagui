import React from 'react';
import { MotiSkeletonProps } from './types';
declare function Skeleton(props: MotiSkeletonProps): JSX.Element;
declare namespace Skeleton {
    var Group: typeof SkeletonGroup;
}
export default Skeleton;
declare function SkeletonGroup({ children, show, }: {
    children: React.ReactNode;
    /**
     * If `true`, all `Skeleton` children components will be shown.
     *
     * If `false`, the `Skeleton` children will be hidden.
     */
    show: boolean;
}): JSX.Element;
//# sourceMappingURL=skeleton.d.ts.map