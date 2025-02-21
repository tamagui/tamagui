import type React from 'react';
import type * as Floating from './Floating';
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
};
export declare const FloatingOverrideContext: React.Context<typeof Floating.useFloating | null>;
export declare const useFloating: (props: UseFloatingProps) => UseFloatingReturn;
//# sourceMappingURL=useFloating.d.ts.map