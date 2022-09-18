import React from 'react';
import { TamaguiComponent } from '../types';
export declare type TamaguiReactElement<P = any> = React.ReactElement<P> & {
    type: TamaguiComponent;
};
export declare const isTamaguiElement: (child: any, name?: string) => child is TamaguiReactElement<any>;
//# sourceMappingURL=isTamaguiElement.d.ts.map