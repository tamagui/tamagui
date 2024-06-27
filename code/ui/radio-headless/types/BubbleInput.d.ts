import React from 'react';
interface BubbleInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'checked'> {
    checked: boolean;
    control: HTMLElement | null;
    bubbles: boolean;
    isHidden?: boolean;
    accentColor?: string;
}
export declare const BubbleInput: (props: BubbleInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=BubbleInput.d.ts.map