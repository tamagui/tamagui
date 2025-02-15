import type { TamaguiComponentState, ComponentContextI } from '../types';
export declare const subscribeToContextGroup: ({ setStateShallow, pseudoGroups, mediaGroups, componentContext, state, }: {
    setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void;
    pseudoGroups?: Set<string>;
    mediaGroups?: Set<string>;
    componentContext: ComponentContextI;
    state: TamaguiComponentState;
}) => import("../types").DisposeFn | undefined;
//# sourceMappingURL=subscribeToContextGroup.d.ts.map