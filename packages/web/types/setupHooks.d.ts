import { RefObject } from 'react';
import { GetStyleResult, StaticConfig, TamaguiComponentEvents, TamaguiComponentState, TamaguiElement } from './types';
export declare const hooks: InternalHooks;
export declare function setupHooks(next: InternalHooks): void;
type InternalHooks = {
    usePropsTransform?: (elementType: any, props: Record<string, any>, hostRef: RefObject<TamaguiElement>) => any;
    useEvents?: (viewProps: Record<string, any>, events: TamaguiComponentEvents | null, splitStyles: GetStyleResult, setStateShallow: (next: Partial<TamaguiComponentState>) => void, staticConfig: StaticConfig) => any;
    useChildren?: (children: any, viewProps: Record<string, any>, events: TamaguiComponentEvents | null, staticConfig: StaticConfig) => any;
    getBaseViews?: () => {
        View: any;
        Text: any;
    };
};
export {};
//# sourceMappingURL=setupHooks.d.ts.map