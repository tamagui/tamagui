import { ReactNode } from 'react';
export type SlotProps = {
    children?: ReactNode;
};
export declare const Slot: import("react").ForwardRefExoticComponent<SlotProps & import("react").RefAttributes<HTMLElement>>;
export declare const Slottable: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare function mergeEvent(a?: Function, b?: Function): (...args: unknown[]) => void;
//# sourceMappingURL=Slot.d.ts.map