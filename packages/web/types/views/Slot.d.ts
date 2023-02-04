import { ReactNode } from 'react';
interface SlotProps {
    children: ReactNode;
}
export declare const Slot: import("react").ForwardRefExoticComponent<SlotProps & import("react").RefAttributes<any>>;
export declare const Slottable: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare function mergeEvent(a?: Function, b?: Function): (...args: unknown[]) => void;
export {};
//# sourceMappingURL=Slot.d.ts.map