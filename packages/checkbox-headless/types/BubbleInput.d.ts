import * as React from 'react';
import type { CheckedState } from './useCheckbox';
export interface BubbleInputProps extends Omit<React.ComponentProps<'input'>, 'checked'> {
    checked: CheckedState;
    control: HTMLElement | null;
    bubbles: boolean;
    isHidden?: boolean;
}
export declare const BubbleInput: (props: BubbleInputProps) => JSX.Element;
//# sourceMappingURL=BubbleInput.d.ts.map