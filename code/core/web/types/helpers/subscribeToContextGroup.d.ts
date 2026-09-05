import type { ComponentSetStateShallow, AllGroupContexts } from '../types';
type SubscribeToContextGroupProps = {
    setStateShallow: ComponentSetStateShallow;
    pseudoGroups?: Set<string>;
    mediaGroups?: Set<string>;
    groupContext: AllGroupContexts;
};
export declare const useGroupSetRevision: (pseudoGroups: Set<string> | undefined, mediaGroups: Set<string> | undefined) => number;
export declare const subscribeToContextGroup: (props: SubscribeToContextGroupProps) => (() => void) | undefined;
export {};
//# sourceMappingURL=subscribeToContextGroup.d.ts.map