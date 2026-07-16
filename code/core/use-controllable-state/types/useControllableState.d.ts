import * as React from 'react';
import type { TamaguiChangeEventDetails } from '@tamagui/core';
type ChangeCb<T, Details extends TamaguiChangeEventDetails> = (next: T, details?: Details) => void;
export type ControllableStateSetter<T, Details extends TamaguiChangeEventDetails = TamaguiChangeEventDetails> = {
    (next: React.SetStateAction<T>): void;
    (next: React.SetStateAction<T>, details: Details): void;
};
export declare function useControllableState<T, Details extends TamaguiChangeEventDetails = TamaguiChangeEventDetails>({ prop, defaultProp, onChange, strategy, preventUpdate, transition, }: {
    prop?: T | undefined;
    defaultProp: T;
    onChange?: ChangeCb<T, Details>;
    strategy?: 'prop-wins' | 'most-recent-wins';
    preventUpdate?: boolean;
    transition?: boolean;
}): [T, ControllableStateSetter<T, Details>];
export {};
//# sourceMappingURL=useControllableState.d.ts.map