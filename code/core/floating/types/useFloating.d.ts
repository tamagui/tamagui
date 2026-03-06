import React from 'react';
import * as Floating from './Floating';
import type { PopupTriggerMap } from './interactions/PopupTriggerMap';
export type UseFloatingFn = typeof Floating.useFloating;
type InferFloatingProps = UseFloatingFn extends (props: infer Props) => any ? Props : never;
export type UseFloatingProps = InferFloatingProps & {
    sameScrollView?: boolean;
};
export type UseFloatingReturn = Floating.UseFloatingReturn & {
    context?: any;
    getFloatingProps?: (props: {
        ref: any;
        [key: string]: any;
    }) => any;
    getReferenceProps?: (props: {
        ref: any;
        [key: string]: any;
    }) => any;
    open?: boolean;
    onHoverReference?: (event: any) => void;
    onLeaveReference?: () => void;
    triggerElements?: PopupTriggerMap;
};
export type UseFloatingOverrideFn = (props?: UseFloatingProps) => UseFloatingReturn;
export declare const FloatingOverrideContext: React.Context<UseFloatingOverrideFn | null>;
export declare const useFloating: (props: UseFloatingProps) => UseFloatingReturn;
export {};
//# sourceMappingURL=useFloating.d.ts.map