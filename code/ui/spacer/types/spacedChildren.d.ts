import { type DebugProp, type SpaceDirection, type SpaceValue } from '@tamagui/web';
import React from 'react';
export type SpacedChildrenProps = {
    isZStack?: boolean;
    children?: React.ReactNode;
    space?: SpaceValue;
    spaceFlex?: boolean | number;
    direction?: SpaceDirection | 'unset';
    separator?: React.ReactNode;
    ensureKeys?: boolean;
    debug?: DebugProp;
};
export declare function spacedChildren(props: SpacedChildrenProps): React.ReactNode;
//# sourceMappingURL=spacedChildren.d.ts.map