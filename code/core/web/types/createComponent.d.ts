import React from 'react';
import type { StaticConfig, TamaguiComponent, TamaguiComponentState, TamaguiElement } from './types';
type ComponentSetState = React.Dispatch<React.SetStateAction<TamaguiComponentState>>;
export declare const componentSetStates: Set<ComponentSetState>;
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends TamaguiElement = TamaguiElement, BaseProps = never, BaseStyles extends object = never>(staticConfig: StaticConfig): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
export {};
//# sourceMappingURL=createComponent.d.ts.map