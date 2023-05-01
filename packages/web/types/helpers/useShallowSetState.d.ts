import React from 'react';
import { DebugProp, TamaguiComponentState } from '../types';
export declare function useShallowSetState<State extends TamaguiComponentState>(setter: React.Dispatch<React.SetStateAction<State>>, debug?: DebugProp, debugName?: string): (next: Partial<State>) => void;
//# sourceMappingURL=useShallowSetState.d.ts.map