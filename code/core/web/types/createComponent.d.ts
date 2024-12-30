import React from 'react';
import type { TamaguiComponentState } from './interfaces/TamaguiComponentState';
import type { StaticConfig, TamaguiComponent, TamaguiElement } from './types';
type ComponentSetState = React.Dispatch<React.SetStateAction<TamaguiComponentState>>;
export declare const componentSetStates: Set<ComponentSetState>;
export declare function createComponent<ComponentPropTypes extends Record<string, any> = {}, Ref extends TamaguiElement = TamaguiElement, BaseProps = never, BaseStyles extends Object = never>(staticConfig: StaticConfig): TamaguiComponent<ComponentPropTypes, Ref, BaseProps, BaseStyles, {}>;
export {};
//# sourceMappingURL=createComponent.d.ts.map