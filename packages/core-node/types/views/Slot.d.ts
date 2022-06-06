import * as React from 'react';
export declare type SlotProps = {
    children?: React.ReactNode;
};
export declare const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;
export declare const Slottable: ({ children }: {
    children: React.ReactNode;
}) => JSX.Element;
export declare function mergeEvent(a?: Function, b?: Function): (...args: unknown[]) => void;
//# sourceMappingURL=Slot.d.ts.map