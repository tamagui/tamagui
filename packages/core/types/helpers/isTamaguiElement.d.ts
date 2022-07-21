import React from 'react';
import { StaticConfig } from '../types';
export declare type TamaguiElement = Omit<React.ReactElement, 'type'> & {
    type: Function & {
        staticConfig: StaticConfig;
    };
};
export declare const isTamaguiElement: (child: any, name?: string) => child is TamaguiElement;
//# sourceMappingURL=isTamaguiElement.d.ts.map