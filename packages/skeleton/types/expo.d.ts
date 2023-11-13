import React from 'react';
import { MotiSkeletonProps } from './types';
declare function SkeletonExpo(props: Omit<MotiSkeletonProps, 'Gradient'>): JSX.Element;
declare namespace SkeletonExpo {
    var Group: ({ children, show, }: {
        children: React.ReactNode;
        show: boolean;
    }) => JSX.Element;
}
export default SkeletonExpo;
//# sourceMappingURL=expo.d.ts.map