import * as React from 'react';
import type { Delay, FloatingInteractionContext } from './types';
type DelayGroupContextValue = {
    currentId: string | null | undefined;
    setCurrentId: (id: string | null | undefined) => void;
    delay: Delay;
    timeoutMs: number;
    initialDelay: Delay;
};
export declare function useDelayGroupContext(): DelayGroupContextValue;
export declare function FloatingDelayGroup({ children, delay, timeoutMs, }: {
    children: React.ReactNode;
    delay: Delay;
    timeoutMs?: number;
}): React.FunctionComponentElement<React.ProviderProps<DelayGroupContextValue>>;
export declare function useDelayGroup(context: FloatingInteractionContext, options?: {
    id?: string;
}): {
    delay: Delay;
    currentId: string | null | undefined;
};
export {};
//# sourceMappingURL=useDelayGroup.d.ts.map