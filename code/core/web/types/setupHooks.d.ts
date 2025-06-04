import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents';
import type { TamaguiComponentState } from './interfaces/TamaguiComponentState';
import type { GetStyleResult, StaticConfig, TamaguiComponentStateRef } from './types';
export declare const hooks: InternalHooks;
export declare function setupHooks(next: InternalHooks): void;
type InternalHooks = {
    usePropsTransform?: (elementType: any, props: Record<string, any>, stateRef: {
        current: TamaguiComponentStateRef;
    }, willHydrate?: boolean) => any;
    setElementProps?: (node?: any) => void;
    useEvents?: (viewProps: Record<string, any>, events: TamaguiComponentEvents | null, splitStyles: GetStyleResult, setStateShallow: (next: Partial<TamaguiComponentState>) => void, staticConfig: StaticConfig) => any;
    useChildren?: (elementType: any, children: any, viewProps: Record<string, any>) => any;
    getBaseViews?: () => {
        View: any;
        Text: any;
        TextAncestor: any;
    };
};
export {};
//# sourceMappingURL=setupHooks.d.ts.map