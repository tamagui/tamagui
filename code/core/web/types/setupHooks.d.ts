import type { TamaguiComponentStateRef } from './types';
export declare const hooks: InternalHooks;
export declare function setupHooks(next: InternalHooks): void;
type InternalHooks = {
    usePropsTransform?: (elementType: any, props: Record<string, any>, stateRef: {
        current: TamaguiComponentStateRef;
    }, willHydrate?: boolean) => any;
    setElementProps?: (node?: any) => void;
    useChildren?: (elementType: any, children: any, viewProps: Record<string, any>) => any;
    getBaseViews?: () => {
        View: any;
        Text: any;
        TextAncestor: any;
    };
};
export {};
//# sourceMappingURL=setupHooks.d.ts.map