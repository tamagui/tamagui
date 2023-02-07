import { RefObject } from 'react';
import { GetStyleResult, TamaguiComponentEvents, TamaguiComponentState, TamaguiElement } from './types';
export declare const hooks: InternalHooks;
export declare function setupHooks(next: InternalHooks): void;
type InternalHooks = {
    usePropsTransform?: (elementType: any, props: Record<string, any>, hostRef: RefObject<TamaguiElement>) => any;
    useEvents?: (viewProps: Record<string, any>, events: TamaguiComponentEvents | null, splitStyles: GetStyleResult, setStateShallow: (next: Partial<TamaguiComponentState>) => void) => any;
    getBaseViews?: () => {
        View: any;
        Text: any;
    };
};
export {};
//# sourceMappingURL=setupHooks.d.ts.map