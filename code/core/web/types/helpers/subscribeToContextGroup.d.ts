import type { TamaguiComponentState, ComponentContextI } from '../types';
export declare const subscribeToContextGroup: ({ disabled, setStateShallow, pseudoGroups, mediaGroups, componentContext, state, }: {
    disabled?: boolean;
    setStateShallow: (next?: Partial<TamaguiComponentState> | undefined) => void;
    pseudoGroups?: Set<string>;
    mediaGroups?: Set<string>;
    componentContext: ComponentContextI;
    state: TamaguiComponentState;
}) => import("../types").DisposeFn | undefined;
//# sourceMappingURL=subscribeToContextGroup.d.ts.map