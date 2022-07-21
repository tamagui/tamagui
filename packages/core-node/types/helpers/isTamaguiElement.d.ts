import React from 'react';
import { StaticConfig } from '../types';
export declare type TamaguiReactElement = React.ReactElement & {
    type: Function & {
        staticConfig: StaticConfig;
    };
};
export declare const isTamaguiElement: (child: any, name?: string) => child is TamaguiReactElement;
//# sourceMappingURL=isTamaguiElement.d.ts.map