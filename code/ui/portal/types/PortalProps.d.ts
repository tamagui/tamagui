import type { StackZIndexProp } from '@tamagui/z-index-stack';
import { CSSProperties, ReactNode } from 'react';
export type PortalProps = {
    zIndex?: number;
    passThrough?: boolean;
    stackZIndex?: StackZIndexProp;
    children?: ReactNode;
    style?: CSSProperties;
    /**
     * Optional property just to indicate open and enable pointer-events
     */
    open?: boolean;
};
//# sourceMappingURL=PortalProps.d.ts.map